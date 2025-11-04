import { Injectable, HttpException } from '@nestjs/common';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalProducts, globalSells } from 'lib/global-db/globaldb';
import { ShortProductSchema, ShortProductDocument } from '../product/entities/short-product.schema';
import { ProductSchema, ProductDocument } from '../product/entities/product.entity';
import { OrderStatus, Sell, SellSchema, SellDocument } from './entities/sell-product-item.entity';
import { CreateSellProductItemDto, GetOrdersDto } from './dto/create-sell-product-item.dto';

@Injectable()
export class SellProductItemService {
  constructor(private tenant: TenantConnectionService) {}

  private sellModel() {
    return this.tenant.getModel<SellDocument>(globalSells, Sell.name, SellSchema);
  }

  private shortProductModel() {
    return this.tenant.getModel<ShortProductDocument>(globalProducts, 'ShortProduct', ShortProductSchema);
  }

  private productModel() {
    return this.tenant.getModel<ProductDocument>(globalProducts, 'Product', ProductSchema);
  }

  /**
   * Create Sell(s) grouped by vendor
   */
  async createSell(dto: CreateSellProductItemDto) {
    const ShortProductModel = this.shortProductModel();
    const SellModel = this.sellModel();

    // Group products by vendor
    const vendorGroups: Record<string, any[]> = {};

    for (const item of dto.products) {
      const product = await ShortProductModel.findOne({ slug: item.slug });
      if (!product) throw new HttpException(`Product not found: ${item.slug}`, 404);

      if (item.quantity > (product.stock || Infinity)) {
        throw new HttpException(`Insufficient stock for product ${product.name}`, 400);
      }

      const productData = {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
        brandName: product.brandName,
        brandId: product.brandId,
        mainCategory: product.main,
        category: product.category,
        vendorId: product.vendorId || 'admin',
        vendorSlug: product?.slug || 'admin',
        isAdmin: product.isAdminCreated,
      };

      const vendorKey = productData.vendorId.toString();
      if (!vendorGroups[vendorKey]) vendorGroups[vendorKey] = [];
      vendorGroups[vendorKey].push(productData);
    }

    const results: any = [];

    // Bulk create per vendor - ONE Sell document per vendor
    for (const vendorId in vendorGroups) {
      const products = vendorGroups[vendorId];

      // Create sell document
      const sellDoc = await SellModel.create({
        products,
        shipment: dto.shipment,
        userId: dto.userId,
        isAdmin: products[0].isAdmin,
        orderStatus: OrderStatus.PENDING,
      });

      results.push(sellDoc);
    }

    return { message: 'Sell(s) created successfully', data: results };
  }

  /**
   * Update order status
   */
  async updateOrderStatus(sellId: string, newStatus: OrderStatus) {
    const SellModel = this.sellModel();
    const ShortProductModel = this.shortProductModel();
    const ProductModel = this.productModel();

    const sell = await SellModel.findById(sellId);
    if (!sell) throw new HttpException('Sell not found', 404);

    // Update order status
    sell.orderStatus = newStatus;

    // If order is confirmed, deduct stock from all products
    if (newStatus === OrderStatus.CONFIRMED) {
      for (const product of sell.products) {
        const shortProduct = await ShortProductModel.findOne({ slug: product.slug });
        if (!shortProduct) throw new HttpException(`Product not found: ${product.slug}`, 404);

        // Deduct from short product
        shortProduct.stock = (shortProduct.stock || 0) - product.quantity;
        await shortProduct.save();

        // Also deduct from full product
        await ProductModel.findOneAndUpdate(
          { slug: product.slug },
          { $inc: { stock: -product.quantity } }
        );
      }
    }

    await sell.save();
    return { message: `Order status updated to ${newStatus}` };
  }

  /**
   * Get sells filtered by role
   */
  async getOrders(userId: string, role: string, dto: GetOrdersDto) {
    const SellModel = this.sellModel();
    const filter: any = {};

    // Filter by role
    if (role === 'ADMIN') {
      filter.isAdmin = true;
    }
    if (role === 'VENDOR') {
      // Filter sells where at least one product belongs to this vendor
      filter['products.vendorId'] = userId;
    }

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = dto;
    const skip = (page - 1) * limit;

    // Total count for pagination
    const total = await SellModel.countDocuments(filter);

    // Fetch paginated and sorted data
    const sells = await SellModel
      .find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      message: 'Orders fetched successfully',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sells,
    };
  }

  /**
   * Get single sell by ID
   */
  async getSellById(sellId: string) {
    const SellModel = this.sellModel();
    
    const sell = await SellModel.findById(sellId);
    if (!sell) throw new HttpException('Sell not found', 404);

    return { message: 'Sell fetched successfully', data: sell };
  }

  /**
   * Delete sell
   */
  async deleteSell(sellId: string) {
    const SellModel = this.sellModel();

    const sell = await SellModel.findById(sellId);
    if (!sell) throw new HttpException('Sell not found', 404);

    await SellModel.findByIdAndDelete(sellId);

    return { message: 'Sell deleted successfully' };
  }
}
