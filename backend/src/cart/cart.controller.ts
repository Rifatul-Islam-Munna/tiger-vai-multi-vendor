import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, RemoveFromCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create("6909e2cd02bf722ca6fcefae",createCartDto);
  }

    @Get(':userId')

  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  

    @Delete(':userId/remove')
  
  removeFromCart(
    @Param('userId') userId: string,
    @Body() dto: RemoveFromCartDto,
  ) {
    return this.cartService.removeFromCart(userId, dto.productId);
  }
}
