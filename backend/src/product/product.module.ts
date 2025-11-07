import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MeilisearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [MeilisearchModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
