import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, GetProductDTo } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateShortProductDto } from './entities/update-short-product.dto';
import { SearchProductDto } from './entities/search-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserRole } from 'src/user/entities/user.schema';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';


@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ Admin or Vendor create product
  @Post('create')
  @ApiOperation({ summary: 'Create a new product (Admin or Vendor)' })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  async create(@Body() dto: CreateProductDto, @Req() req: ExpressRequest) {
    return this.productService.createProduct(dto, req?.user?.id, req?.user?.role as UserRole);
  }

  // ✅ Admin update product
  @Patch('admin-update/:id')
  @ApiOperation({ summary: 'Update a product as Admin' })
  async adminUpdate(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.adminUpdateProduct(id, dto);
  }

  // ✅ Vendor update product (self-owned)
  @Patch('vendor-update/:id')
  @ApiOperation({ summary: 'Update a product as Vendor (self-owned)' })
  async vendorUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.vendorUpdateProduct(id, req.user.id, dto);
  }

  // ✅ Delete product (Admin only)
  @Delete(':id')
   @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  async delete(@Param('id') id: string, @Req()  req: ExpressRequest) {
    return this.productService.deleteProduct(id, req?.user?.role as UserRole);
  }

  // ✅ Create Review
  @Post('review')
  @ApiOperation({ summary: 'Add a review to a product' })
  async createReview(@Body() dto: CreateReviewDto) {
    return this.productService.createReview(dto);
  }

  // ✅ Update ShortProduct Flags (hotDeals, hotOffer, productOfTheDay)
  @Patch('update-flags/:slug')
  @ApiOperation({ summary: 'Update short product flags' })
  async updateShortProductFlags(
    @Param('slug') slug: string,
    @Body() dto: UpdateShortProductDto,
  ) {
    return this.productService.updateShortProductFlags(slug, dto);
  }

  // ✅ Search Products with filters & pagination (ShortProduct)
  @Get('search')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  async searchProducts(@Query() query: SearchProductDto) {
    return this.productService.searchProducts(query);
  }
  @Get('get-product')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  async getOneProduct(@Query() query: GetProductDTo) {
    return this.productService.getProduct(query.slug);
  }
}
