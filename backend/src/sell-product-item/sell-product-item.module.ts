import { Module } from '@nestjs/common';
import { SellProductItemService } from './sell-product-item.service';
import { SellProductItemController } from './sell-product-item.controller';

@Module({
  controllers: [SellProductItemController],
  providers: [SellProductItemService],
})
export class SellProductItemModule {}
