// src/product/product.service.ts
import { HttpException, Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from '@sindresorhus/slugify';
import { User, UserDocument, UserRole, UserSchema } from 'src/user/entities/user.schema';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { ReviewStatsSchema, ReviewStats, ReviewStatsDocument } from './entities/review-stats.schema';
import { ReviewSchema, Review, ReviewDocument } from './entities/review.schema';
import { Product, ProductDocument, ProductSchema } from './entities/product.entity';
import { globalProducts, globalUser } from 'lib/global-db/globaldb';
import { ShortProduct, ShortProductDocument, ShortProductSchema } from './entities/short-product.schema';
import { UpdateShortProductDto } from './entities/update-short-product.dto';
import { SearchProductDto } from './entities/search-product.dto';
import { ProductHelper } from 'lib/product.helper';
import { MeilisearchService } from 'src/meilisearch/meilisearch.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from 'lib/pagination.dto';
import { SellProductItemService } from 'src/sell-product-item/sell-product-item.service';


@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name)
  constructor(private tenant: TenantConnectionService,private melieSeach:MeilisearchService, private salesService:SellProductItemService) {}


  private productModel() {
    return this.tenant.getModel<ProductDocument>(
      globalProducts,
      Product.name,
      ProductSchema,
    );
  }

  private shortProductModel() {
    return this.tenant.getModel<ShortProductDocument>(
      globalProducts,
      ShortProduct.name,
      ShortProductSchema,
    );
  }

  private reviewModel() {
    return this.tenant.getModel<ReviewDocument>(globalProducts, Review.name, ReviewSchema);
  }

  private reviewStatsModel() {
    return this.tenant.getModel<ReviewStatsDocument>(
      globalProducts,
      ReviewStats.name,
      ReviewStatsSchema,
    );
  }
  private userModel(){
    return this.tenant.getModel<UserDocument>(
      globalUser,
      User.name,
      UserSchema
      
    )
  }

  private rawSlugify(name: string, price: number, main: string, category: string, dbName: string) {
    return slugify(`${name}-${price}-${main}-${category}-${dbName}`);
  }

  private reverseSlugify(slug: string) {
    const rawText = slug.split('-').pop();
    return rawText;
  }


  async getProduct(slug:string){
    const ProductModel = this.productModel();
    return ProductModel.findOne({slug}).populate({
      path:"stats",
      model: this.reviewStatsModel(),
    });

  }
  async getAllReviews(query:PaginationDto){
    const {id,limit =5,page = 1} = query
    const userModel = this.userModel()
    const [CountProduct,getAllReviw] = await Promise.all([
      await this.reviewModel().countDocuments({productId:id}).lean(),
      await this.reviewModel().find({productId:id}).populate({
      path:"userId",
      model:userModel,
      select:"name"
    }).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean()
    ])

 
    return {data:getAllReviw,totalPage:CountProduct / limit}

  }

  // ✅ UPDATED: Create Short Product DTO Helper
  private createShortProductData(product: any) {
    const averagePrice = ProductHelper.calculateAveragePrice(product.variants);
    const averageOfferPrice = ProductHelper.calculateAverageOfferPrice(product.variants);
    const totalStock = ProductHelper.calculateTotalStock(product.variants);

    // ✅ Extract minimal variant info for short product
    const shortVariants = product.variants?.map((v: any) => ({
      size: v.size,
      color: v.color,
      price: v.price,
      discountPrice: v.discountPrice,
      stock: v.stock,
    })) || [];

    return {
      name: product.name,
      thumbnail: product.thumbnail.url,
      main: product.category.main,
      category: product.category.category,
      subMain: product.category.subMain,
      price: averagePrice || product.price,
      offerPrice: averageOfferPrice || product.offerPrice,
      hasOffer: product.hasOffer,
      isDigital: product.isDigital,
      brandId: product.brand.id,
      isActive: product.isActive,
      brandName: product.brand.name,
      slug: product.slug,
      isAdminCreated: product.isAdminCreated,
      stock: totalStock || product.stock,
      variants: shortVariants,
    };
  }
  private convertToMiliProduct(product:ShortProductDocument){
  return {
    name: product.name,
      thumbnail: product.thumbnail,
      main: product.main,
      category: product.category,
      subMain: product.subMain,
      price:  product.price ?? 0,
      offerPrice:  product.offerPrice,
      hasOffer: product.hasOffer,
      isDigital: product.isDigital,
      brandId: product.brandId,
      brandName: product.brandName,
      slug: product.slug,
      isAdminCreated: product.isAdminCreated,
      stock:  product.stock ?? 0,
      id: product._id.toString(),
      rating:0,
      createdAt:Date.now().toString(),
     

  }
  }

  // ✅ UPDATED: Create Product (Admin OR Vendor)
  async createProduct(dto: CreateProductDto, userId: string, role: UserRole) {
    const ProductModel = this.productModel();
    const rawSlug = this.rawSlugify(
      dto.name,
      dto.price,
      dto?.category?.main,
      dto?.category?.category,
      globalProducts
    );
    const slug = slugify(rawSlug);

    const exists = await ProductModel.exists({ slug });
    if (exists) throw new HttpException('Product with this name already exists', 400);

    const isAdmin = role === UserRole.ADMIN;

    // ✅ NEW: Calculate averages from variants if provided
    let finalPrice = dto.price;
    let finalStock = dto.stock;
    let finalOfferPrice = dto.offerPrice;

    if (dto.variants && dto.variants.length > 0) {
      finalPrice = ProductHelper.calculateAveragePrice(dto.variants);
      finalStock = ProductHelper.calculateTotalStock(dto.variants);
      finalOfferPrice = ProductHelper.calculateAverageOfferPrice(dto.variants) || dto.offerPrice;
    }

    const newProduct = await ProductModel.create({
      ...dto,
      slug,
      createdBy: userId,
      isAdminCreated: isAdmin,
      price: finalPrice,
      stock: finalStock,
      offerPrice: finalOfferPrice,
    });

    if (!newProduct) throw new HttpException('Product not created', 400);

    // ✅ Initialize ReviewStats
    const StatsModel = this.reviewStatsModel();
    const createdReviw = await StatsModel.create({
      productId: newProduct._id,
      averageRating: 0,
      totalReviews: 0,
      count5: 0,
      count4: 0,
      count3: 0,
      count2: 0,
      count1: 0,
    });
    newProduct.stats = createdReviw._id;
    await newProduct.save();

    // ✅ UPDATED: Create ShortProduct with variants
    const ShortProductModel = this.shortProductModel();
    const shortProductData = this.createShortProductData(newProduct);
    
   const shortProductCreated =  await ShortProductModel.create({
      ...shortProductData,
      vendorId: userId,
    });
    const miliProduct  = this.convertToMiliProduct(shortProductCreated)
    await this.melieSeach.create(miliProduct);

    return { message: 'Product created successfully', data: newProduct };
  }

  // ✅ UPDATED: Admin Update Product
  async adminUpdateProduct(productId: string, dto: UpdateProductDto) {
    const ProductModel = this.productModel();

    // ✅ Calculate new averages if variants changed
    let updateData = { ...dto };
    if (dto.variants && dto.variants.length > 0) {
      updateData.price = ProductHelper.calculateAveragePrice(dto.variants);
      updateData.stock = ProductHelper.calculateTotalStock(dto.variants);
      updateData.offerPrice = ProductHelper.calculateAverageOfferPrice(dto.variants) || dto.offerPrice;
    }

    const updated = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
    if (!updated) throw new HttpException('Product not found', 404);

    // ✅ UPDATED: Sync ShortProduct with variants
    const ShortProductModel = this.shortProductModel();
    const shortProductData = this.createShortProductData(updated);

   const updateProduct= await ShortProductModel.findOneAndUpdate(
      { slug: updated.slug },
      {
        ...shortProductData,
        vendorId: updated.createdBy,
      },
    );
    if(!updateProduct) throw new HttpException('Short product not found', 404);
    const updateMili = this.convertToMiliProduct(updateProduct)
    await this.melieSeach.update(updateProduct._id.toString(),updateMili);
    return { message: 'Product updated by admin', data: updated };
  }

  // ✅ UPDATED: Vendor Update Product (Restricted)
  async vendorUpdateProduct(productId: string, userId: string, dto: UpdateProductDto) {
    const ProductModel = this.productModel();
    const ShortProductModel = this.shortProductModel();

    const product = await ProductModel.findById(productId);
    if (!product) throw new HttpException('Product not found', 404);

    if (product.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('You can update only your products');
    }

    // ✅ Calculate new averages if variants changed
    let updateData = { ...dto };
    if (dto.variants && dto.variants.length > 0) {
      updateData.price = ProductHelper.calculateAveragePrice(dto.variants);
      updateData.stock = ProductHelper.calculateTotalStock(dto.variants);
      updateData.offerPrice = ProductHelper.calculateAverageOfferPrice(dto.variants) || dto.offerPrice;
    }

    const updated = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
    if (!updated) throw new HttpException('Product not found', 404);

    // ✅ UPDATED: Sync ShortProduct with variants
    const shortProductData = this.createShortProductData(updated);
  

   const updateProduct =  await ShortProductModel.findOneAndUpdate(
      { slug: updated.slug },
      shortProductData,
    );
       if(!updateProduct) throw new HttpException('Short product not found', 404);
    const updateMili = this.convertToMiliProduct(updateProduct)
    await this.melieSeach.update(updateProduct._id.toString(),updateMili);

    return {
      message: 'Product updated by vendor',
      data: updated,
    };
  }

  // ✅ DELETE PRODUCT (Admin only)
  async deleteProduct(productId: string, role: UserRole) {
  /*   if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete products');
    } */

    const ProductModel = this.productModel();
    const deleted = await ProductModel.findByIdAndUpdate(productId, { isActive: false }, { new: true });
    if (!deleted) throw new HttpException('Product not found', 404);

    // ✅ NEW: Also delete from ShortProduct
    const ShortProductModel = this.shortProductModel();
    await ShortProductModel.findOneAndUpdate({ slug: deleted.slug }, { isActive: false });
    await this.melieSeach.delete(productId)

    return { message: 'Product deleted successfully' };
  }

  async updateShortProductFlags(slug: string, dto: UpdateShortProductDto) {
    const ShortProductModel = this.shortProductModel();
    const updated = await ShortProductModel.findOneAndUpdate({ slug }, dto, { new: true });
    if (!updated) throw new HttpException('Short product not found', 404);
    return { message: 'Short product flags updated', data: updated };
  }

  async searchProducts(query: SearchProductDto) {
    const ShortProductModel = this.shortProductModel();

    const {
      search,
      main,
      category,
      brandName,
      hasOffer,
      isDigital,
      page = 1,
      limit = 10,
      sortOrder = 'desc',
      sortBy='createdAt'
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (main) filter.main = main;
    if (category) filter.category = category;
    if (brandName) filter.brandName = brandName;
    if (hasOffer !== undefined) filter.hasOffer = hasOffer;
    if (isDigital !== undefined) filter.isDigital = isDigital;

    const skip = (page - 1) * limit;
    
    const total = await ShortProductModel.countDocuments(filter);
    const data = await ShortProductModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  // ✅ CREATE REVIEW

  // have to like check here if user really buy this product or not
  async createReview(dto: CreateReviewDto,id:string) {
    this.logger.log(`Creating review for product ${JSON.stringify(dto)}`);
    const ShortProductModel = this.shortProductModel();
      const ProductModel = this.productModel();
    const ReviewModel = this.reviewModel();
    const StatsModel = this.reviewStatsModel();
    const finalData ={
      ...dto,
      userId:id
    }


   const isUserAlreadyReviewed = await ReviewModel.exists({ userId: id, productId: dto.productId });
    if (isUserAlreadyReviewed) {
      throw new HttpException('You have already reviewed this product', 400);
    }
     const product = await ProductModel.findById(dto.productId);
    if (!product) throw new HttpException('Product not found', 404);
    const shortProduct = await ShortProductModel.findOne({ 
      slug: product.slug  // ✅ Use slug to find ShortProduct
    });
    if (!shortProduct) throw new HttpException('Short product not found', 404);
    this.logger.log(`Product found: ${JSON.stringify(shortProduct)}`);
    const findOneinSals =  await this.salesService.checkUserBuyTheProductOrNot(id,shortProduct._id.toString()) // ✅ Check if user has already bought this product
    this.logger.log("use buy this product or not",findOneinSals);
    if (!findOneinSals) throw new HttpException('You have not bought this product', 400);
    // ✅ Create Review
    const review = await ReviewModel.create(finalData);

    // ✅ Update stats
    const stats = await StatsModel.findOne({ productId: dto.productId });

    if (!stats) {
      throw new HttpException('Review stats not initialized for this product', 500);
    }

    // ✅ Increase counters
    switch (dto.rating) {
      case 5:
        stats.count5++;
        break;
      case 4:
        stats.count4++;
        break;
      case 3:
        stats.count3++;
        break;
      case 2:
        stats.count2++;
        break;
      case 1:
        stats.count1++;
        break;
    }

    stats.totalReviews++;

    // ✅ Recalculate average rating
    stats.averageRating =
     parseFloat(
  (
    (stats.count5 * 5 + stats.count4 * 4 + stats.count3 * 3 + 
     stats.count2 * 2 + stats.count1 * 1) / stats.totalReviews
  ).toFixed(2)
);
  
    await stats.save();
     
       await this.melieSeach.update(   shortProduct._id.toString(),{
         
        rating: stats.averageRating
      });
     
    return {
      message: 'Review added successfully',
      review,
      stats,
    };
  }




}
