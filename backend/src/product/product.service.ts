import { HttpException, Injectable, ForbiddenException } from '@nestjs/common';


import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';



import slugify from '@sindresorhus/slugify';
import { UserRole } from 'src/user/entities/user.schema';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { ReviewStatsSchema,ReviewStats,ReviewStatsDocument } from './entities/review-stats.schema';
import { ReviewSchema,Review ,ReviewDocument} from './entities/review.schema';
import { Product, ProductDocument, ProductSchema } from './entities/product.entity';
import { globalProducts } from 'lib/global-db/globaldb';
import { ShortProduct,ShortProductSchema } from './entities/short-product.schema';
import { UpdateShortProductDto } from './entities/update-short-product.dto';
import { SearchProductDto } from './entities/search-product.dto';
@Injectable()
export class ProductService {
  constructor(private tenant: TenantConnectionService) {}

   private productModel() {
    return this.tenant.getModel<ProductDocument>(
      globalProducts,
      Product.name,
      ProductSchema,
    );
  }

  private shortProductModel() {
    return this.tenant.getModel(
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

  private rawSlugify(name: string, price: number, main: string, category: string, dbName: string) {
    return slugify(`${name}-${price}-${main}-${category}-${dbName}`);
  }
  private reverseSlugify(slug:string) {
   const rawText = slug.split('-').pop();
   return rawText

    
  }


  // ✅ Create Product (Admin OR Vendor)
  async createProduct(dto: CreateProductDto, userId: string, role: UserRole) {
    const ProductModel = this.productModel();
    const rawSlug = this.rawSlugify(dto.name, dto.price, dto?.category?.main, dto?.category?.category, globalProducts);
    const slug = slugify(rawSlug);

    const exists = await ProductModel.exists({ slug });
    if (exists) throw new HttpException('Product with this name already exists', 400);

    const isAdmin = role === UserRole.ADMIN;

    const newProduct = await ProductModel.create({
      ...dto,
      slug,
      createdBy: userId,
      isAdminCreated: isAdmin,
    });
 if(!newProduct) throw new HttpException('Product not created', 400);
    // ✅ Initialize ReviewStats
    const StatsModel = this.reviewStatsModel();
    await StatsModel.create({
      productId: newProduct._id,
      averageRating: 0,
      totalReviews: 0,
      count5: 0,
      count4: 0,
      count3: 0,
      count2: 0,
      count1: 0,
    });

    // ✅ Create ShortProduct
    const ShortProductModel = this.shortProductModel();
    await ShortProductModel.create({
      name: newProduct.name,
      thumbnail: newProduct.thumbnail.url, // assuming thumbnail is object
      main: newProduct.category.main,
      category: newProduct.category.category,
      price: newProduct.price,
      offerPrice: newProduct.offerPrice,
      hasOffer: newProduct.hasOffer,
      isDigital: newProduct.isDigital,
      brandId: newProduct.brand.id,
      brandName: newProduct.brand.name,
      slug: newProduct.slug,
      isAdminCreated: isAdmin,
      stock:newProduct.stock
    });

    return { message: 'Product created successfully', data: newProduct };
  }

  // ✅ Admin Update Product
   async adminUpdateProduct(productId: string, dto: UpdateProductDto) {
    const ProductModel = this.productModel();
    const updated = await ProductModel.findByIdAndUpdate(productId, dto, { new: true });
    if (!updated) throw new HttpException('Product not found', 404);

    // ✅ Sync ShortProduct
    const ShortProductModel = this.shortProductModel();
    await ShortProductModel.findOneAndUpdate(
      { slug: updated.slug },
      {
        name: updated.name,
        thumbnail: updated.thumbnail.url,
        main: updated.category.main,
        category: updated.category.category,
        price: updated.price,
        offerPrice: updated.offerPrice,
        hasOffer: updated.hasOffer,
        isDigital: updated.isDigital,
        brandId: updated.brand.id,
        brandName: updated.brand.name,
        stock:updated.stock,
        vendorId:updated.createdBy
      },
    );

    return { message: 'Product updated by admin', data: updated };
  }

  // ✅ Vendor Update Product (Restricted)
  async vendorUpdateProduct(productId: string, userId: string, dto: UpdateProductDto) {
  const ProductModel = this.productModel();
  const ShortProductModel = this.shortProductModel();

  const product = await ProductModel.findById(productId);
  if (!product) throw new HttpException('Product not found', 404);

  if (product.createdBy.toString() !== userId.toString()) {
    throw new ForbiddenException('You can update only your products');
  }

  const updated = await ProductModel.findByIdAndUpdate(productId, dto, { new: true });
  if (!updated) throw new HttpException('Product not found', 404);

  // ✅ Sync ShortProduct
  await ShortProductModel.findOneAndUpdate(
    { slug: updated.slug },
    {
      name: updated.name,
      thumbnail: updated.thumbnail.url,
      main: updated.category.main,
      category: updated.category.category,
      price: updated.price,
      offerPrice: updated.offerPrice,
      hasOffer: updated.hasOffer,
      isDigital: updated.isDigital,
      brandId: updated.brand.id,
      brandName: updated.brand.name,
      stock:updated.stock
    },
  );

  return {
    message: 'Product updated by vendor',
    data: updated,
  };
}


  // ✅ DELETE PRODUCT (Admin only)
  async deleteProduct(productId: string, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete products');
    }

    const ProductModel = this.productModel();

    const deleted = await ProductModel.findByIdAndDelete(productId);
    if (!deleted) throw new HttpException('Product not found', 404);

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
      .sort({ price: sortOrder === 'asc' ? 1 : -1 })
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
  async createReview(dto: any) {
    const ReviewModel = this.reviewModel();
    const StatsModel = this.reviewStatsModel();

    // ✅ Create Review
    const review = await ReviewModel.create(dto);

    // ✅ Update stats
    const stats = await StatsModel.findOne({ productId: dto.productId });

    if (!stats) {
      throw new HttpException('Review stats not initialized for this product', 500);
    }

    // ✅ Increase counters
    switch (dto.rating) {
      case 5: stats.count5++; break;
      case 4: stats.count4++; break;
      case 3: stats.count3++; break;
      case 2: stats.count2++; break;
      case 1: stats.count1++; break;
    }

    stats.totalReviews++;

    // ✅ Recalculate average rating
    stats.averageRating =
      (stats.count5 * 5 +
        stats.count4 * 4 +
        stats.count3 * 3 +
        stats.count2 * 2 +
        stats.count1 * 1) /
      stats.totalReviews;

    await stats.save();

    return {
      message: 'Review added successfully',
      review,
      stats,
    };
  }
}
