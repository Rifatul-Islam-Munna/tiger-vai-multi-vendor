// src/sell/services/sell-product-item.service.ts
import { Injectable, HttpException, Logger } from '@nestjs/common';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalProducts, globalSells } from 'lib/global-db/globaldb';
import { ShortProductSchema, ShortProductDocument } from '../product/entities/short-product.schema';
import { OrderStatus, Sell, SellSchema, SellDocument } from './entities/sell-product-item.entity';
import { CreateSellProductItemDto, GetOrdersDto } from './dto/create-sell-product-item.dto';
import { randomBytes, randomUUID } from "crypto";
import { MeilisearchService } from 'src/meilisearch/meilisearch.service';

@Injectable()
export class SellProductItemService {
  private logger = new Logger(SellProductItemService.name);
  constructor(private tenant: TenantConnectionService,private milieSeach:MeilisearchService) {}

  private sellModel() {
    return this.tenant.getModel<SellDocument>(globalSells, Sell.name, SellSchema);
  }

  private shortProductModel() {
    return this.tenant.getModel<ShortProductDocument>(globalProducts, 'ShortProduct', ShortProductSchema);
  }
  private generateOrderUUID() {
   const time = Date.now().toString(36).toUpperCase(); // compact timestamp
  const rand = randomBytes(6).toString("hex").toUpperCase(); // 12 hex characters (48 bits)
  return `ORD-${time}${rand}`;
}

  /**
   * ✅ UPDATED: Case-insensitive variant matching
   */
  private findVariant(variants: any[], variantSize: string, variantColor: string) {
    return variants?.find(
      (v: any) => 
        v.size.toLowerCase().trim() === variantSize.toLowerCase().trim() && 
        v.color.toLowerCase().trim() === variantColor.toLowerCase().trim()
    );
  }

  /**
   * ✅ UPDATED: Create Sell - Use ShortProduct ONLY
   */
  async createSell(dto: CreateSellProductItemDto,userId:string) {
    const ShortProductModel = this.shortProductModel();
    const SellModel = this.sellModel();

    // Group products by vendor with variant tracking
    const vendorGroups: Record<string, any[]> = {};

    for (const item of dto.products) {
      // ✅ CHANGED: Query ShortProduct (faster, already has variant info)
      const shortProduct = await ShortProductModel.findOne({ slug: item.slug });
      if (!shortProduct) throw new HttpException(`Product not found: ${item.slug}`, 404);

      // ✅ NEW: Find specific variant from ShortProduct
      const variant = this.findVariant(shortProduct.variants, item.variant.size, item.variant.color);
      if (!variant) {
        throw new HttpException(
          `Variant not found: ${item.variant.size}-${item.variant.color} for product ${shortProduct.name}`,
          404
        );
      }

      // ✅ NEW: Check stock of THAT specific variant
      if (item.quantity > (variant.stock || 0)) {
        throw new HttpException(
          `Insufficient stock for variant ${variant.size}-${variant.color}. Available: ${variant.stock}`,
          400
        );
      }

      // ✅ NEW: Get price from variant
      const unitPrice = variant.discountPrice || variant.price;

      // ✅ NEW: Calculate total with variant-specific price
      const totalPrice = unitPrice * item.quantity;

      const productData = {
        productId: shortProduct._id,
        slug: shortProduct.slug,
        name: shortProduct.name,
        quantity: item.quantity,
        unitPrice, // Store unit price at time of order
        totalPrice,
        // ✅ CHANGED: Store variant info (NO SKU - you don't need it here)
        variant: {
          size: variant.size,
          color: variant.color,
          price: variant.price,
          discountPrice: variant.discountPrice,
        },
        brandName: shortProduct.brandName,
        brandId: shortProduct.brandId,
        mainCategory: shortProduct.main,
        category: shortProduct.category,
        vendorId: shortProduct.vendorId?.toString() || 'admin',
        vendorSlug: shortProduct.slug, // we dont have have yet so we saved product slog insted
        isAdmin: shortProduct.isAdminCreated,
       
      };

      const vendorKey = productData.vendorId;
      if (!vendorGroups[vendorKey]) vendorGroups[vendorKey] = [];
      vendorGroups[vendorKey].push(productData);
    }

    const results: any = [];
    let totalOrderAmount = 0;
    let totalDiscount = 0;

    for (const vendorId in vendorGroups) {
      const products = vendorGroups[vendorId];

      // Calculate totals for this order
      const orderTotal = products.reduce((sum, p) => sum + p.totalPrice, 0);
      const discount = products.reduce((sum, p) => {
        return sum + (p.variant.discountPrice ? (p.variant.price - p.variant.discountPrice) * p.quantity : 0);
      }, 0);

      // Create sell document
      const sellDoc = await SellModel.create({
        products,
        shipment: dto.shipment,
        userId: userId,
        isAdmin: products[0].isAdmin,
        orderStatus: OrderStatus.PENDING,
        orderTotal,
        totalDiscount: discount,
        vendorId: products[0].vendorId ,
        orderNumber: this.generateOrderUUID(),
      });

      results.push(sellDoc);
      totalOrderAmount += orderTotal;
      totalDiscount += discount;
    }
    this.logger.debug(results)

    return {
      message: 'Sell(s) created successfully',
      data: results,
      summary: { totalOrderAmount, totalDiscount },
    };
  }

  /**
   * ✅ UPDATED: Update order status - Only update ShortProduct
   */
  async updateOrderStatus(sellId: string, newStatus: OrderStatus) {
  const SellModel = this.sellModel();
  const ShortProductModel = this.shortProductModel();

  const sell = await SellModel.findById(sellId);
  if (!sell) throw new HttpException('Sell not found', 404);

  // ✅ Store previous status for cancel logic
  const previousStatus = sell.orderStatus;

  // Update order status
  sell.orderStatus = newStatus;

  // ✅ CONFIRMED: Deduct stock from both MongoDB and MeiliSearch
  if (newStatus === OrderStatus.CONFIRMED) {
    for (const orderItem of sell.products) {
      const shortProduct = await ShortProductModel.findOne({ slug: orderItem.slug });
      if (!shortProduct) throw new HttpException(`Product not found: ${orderItem.slug}`, 404);

      // Find the specific variant
      const variant = this.findVariant(
        shortProduct.variants, 
        orderItem.variant.size, 
        orderItem.variant.color
      );
      if (!variant) {
        throw new HttpException(
          `Variant not found: ${orderItem.variant.size}-${orderItem.variant.color}`,
          404
        );
      }

      // ✅ Check if enough stock
      if (variant.stock < orderItem.quantity) {
        throw new HttpException(
          `Insufficient stock for ${shortProduct.name} (${orderItem.variant.size}-${orderItem.variant.color})`,
          400
        );
      }

      // Deduct from variant stock
      variant.stock = (variant.stock || 0) - orderItem.quantity;

      // Recalculate total stock
      shortProduct.stock = shortProduct.variants?.reduce(
        (sum: number, v: any) => sum + (v.stock || 0), 
        0
      ) || 0;

      // Save MongoDB
      await shortProduct.save();

      // ✅ Update MeiliSearch
      await this.milieSeach.update(shortProduct._id.toString(), {
        stock: shortProduct.stock,
      });

      this.logger.log(
        `✅ Stock deducted: ${shortProduct.name} - New stock: ${shortProduct.stock}`
      );
    }
  }

  // ✅ CANCELLED: Add stock back ONLY if order was previously CONFIRMED
  if (newStatus === OrderStatus.CANCELLED && previousStatus === OrderStatus.CONFIRMED) {
    for (const orderItem of sell.products) {
      const shortProduct = await ShortProductModel.findOne({ slug: orderItem.slug });
      if (!shortProduct) {
        this.logger.warn(`Product not found during cancellation: ${orderItem.slug}`);
        continue; // Skip this product but continue with others
      }

      // Find the specific variant
      const variant = this.findVariant(
        shortProduct.variants, 
        orderItem.variant.size, 
        orderItem.variant.color
      );
      if (!variant) {
        this.logger.warn(
          `Variant not found during stock restoration: ${orderItem.variant.size}-${orderItem.variant.color}`
        );
        continue;
      }

      // ✅ Add stock back to variant
      variant.stock = (variant.stock || 0) + orderItem.quantity;

      // Recalculate total stock
      shortProduct.stock = shortProduct.variants?.reduce(
        (sum: number, v: any) => sum + (v.stock || 0), 
        0
      ) || 0;

      // Save MongoDB
      await shortProduct.save();

      // ✅ Update MeiliSearch
      await this.milieSeach.update(shortProduct._id.toString(), {
        stock: shortProduct.stock,
      });

      this.logger.log(
        `✅ Stock restored: ${shortProduct.name} - New stock: ${shortProduct.stock}`
      );
    }
  }

  await sell.save();
  
  return { 
    message: `Order status updated to ${newStatus}`, 
    data: sell,
    previousStatus, // Include for debugging
  };
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
  async getAllOrders( dto: GetOrdersDto) {
    const SellModel = this.sellModel();
    const filter: any = {};
    if(dto?.orderStatus){
      filter.orderStatus = dto.orderStatus
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
  async getAdminOrder( dto: GetOrdersDto) {
    const SellModel = this.sellModel();
    const filter: any = {isAdmin:true};
    if(dto?.orderStatus){
      filter.orderStatus = dto.orderStatus
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
