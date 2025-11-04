import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaymentMethod } from '../entities/sell-product-item.entity';


class SellProductItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  totalPrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainCategory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendorSlug?: string;
}

class ShipmentDetailsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  house: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class CreateSellProductItemDto {
  @ApiProperty({ type: [SellProductItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SellProductItemDto)
  products: SellProductItemDto[];

  @ApiProperty({ type: ShipmentDetailsDto })
  @ValidateNested()
  @Type(() => ShipmentDetailsDto)
  shipment: ShipmentDetailsDto;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsOptional()
  isAdmin: boolean;
}

export class GetOrdersDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Sort order: asc or desc', 
    default: 'desc', 
    enum: ['asc', 'desc'] 
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ 
    description: 'Field to sort by', 
    default: 'createdAt' 
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
}