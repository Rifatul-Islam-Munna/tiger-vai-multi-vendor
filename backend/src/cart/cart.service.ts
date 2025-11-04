import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalCart, globalProducts } from 'lib/global-db/globaldb';
import { Cart, CartDocument, CartSchema } from './entities/cart.entity';
import { Types } from 'mongoose';
import { ShortProduct, ShortProductDocument, ShortProductSchema } from 'src/product/entities/short-product.schema';

@Injectable()
export class CartService {
  constructor(private tenantConnectionService: TenantConnectionService) {}

  private getCartModel() {
    return this.tenantConnectionService.getModel<CartDocument>(
      globalCart,
      Cart.name,
      CartSchema,
    );
  }
  private getShortProductModel() {
    return this.tenantConnectionService.getModel<ShortProductDocument>(
      globalProducts,
      ShortProduct.name,
      ShortProductSchema,
    );
  }
  async create(userId: string, createCartDto: CreateCartDto) {
     const { productId, quantity } = createCartDto;
     const cartModel = this.getCartModel();
     let cart = await cartModel.findOne({ userId });

    // ✅ CART DOES NOT EXIST → CREATE IT
    if (!cart) {
      cart = await cartModel.create({
        userId,
        cartProducts: [{ productId, quantity }],
      });
      return cart;
    }

    // ✅ CART EXISTS → Update or Push product
    const existingProduct = cart.cartProducts.find(
      (p) => p.productId.toString() === productId,
    );

    if (existingProduct) {
      existingProduct.quantity = quantity; // update quantity
    } else {
      cart.cartProducts.push({
        productId: new Types.ObjectId(productId),
        quantity,
      });
    }

    return await cart.save();
    
  }
  async removeFromCart(userId: string, productId: string) {
      const cartModel = this.getCartModel();
    const cart = await cartModel.findOne({ userId });

    if (!cart) throw new NotFoundException('Cart not found');

    cart.cartProducts = cart.cartProducts.filter(
      (p) => p.productId.toString() !== productId,
    );

    return cart.save();
  }
    async getCart(userId: string) {
         const cartModel = this.getCartModel();
         const shortProductModel = this.getShortProductModel()
    const cart = await cartModel
      .findOne({ userId })
      .populate({ path: 'cartProducts.productId' ,model:shortProductModel});

    if (!cart) {
      return {
        userId,
        cartProducts: [],
      };
    }

    return cart;
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
