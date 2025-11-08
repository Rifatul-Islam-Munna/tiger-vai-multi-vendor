import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  Req, 
  UseGuards
} from '@nestjs/common';
import { SellProductItemService } from './sell-product-item.service';
import { CreateSellProductItemDto, GetOrdersDto } from './dto/create-sell-product-item.dto';
import { OrderStatus } from './entities/sell-product-item.entity';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('sell-product-item')
export class SellProductItemController {
  constructor(private readonly sellProductItemService: SellProductItemService) {}

  /**
   * Create sell(s) (grouped by vendor)
   */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() dto: CreateSellProductItemDto,@Req() req:ExpressRequest) {
    return this.sellProductItemService.createSell(dto,req?.user?.id);
  }

  /**
   * Update order status (Vendor/Admin)
   */
  @Patch('status/:shortSellId')
  async updateStatus(
    @Param('shortSellId') shortSellId: string,
    @Body('newStatus') newStatus: OrderStatus,
    @Body('isVendor') isVendor: boolean,
  ) {
    return this.sellProductItemService.updateOrderStatus(shortSellId, newStatus);
  }

  /**
   * Get orders with pagination and sorting
   */
  @Get()
  async getOrders(@Req() req, @Query() query: GetOrdersDto) {
    const userId = req.user.id;
    const role = req.user.role;
    return this.sellProductItemService.getOrders(userId, role, query);
  }

  /**
   * Delete sell (both long & short)
   */
  @Delete(':longSellId')
  async deleteSell(@Param('longSellId') longSellId: string) {
    return this.sellProductItemService.deleteSell(longSellId);
  }
}
