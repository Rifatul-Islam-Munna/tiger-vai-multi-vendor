// src/product/dto/create-product.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  id: string;
}

class ProductCategoryDto {
  @ApiProperty()
  @IsString()
  main: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  semiSub?: string;

  @ApiProperty()
  @IsString()
  category: string;
}

class ColorImageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  images: string[];
}

class FeatureDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

// ✅ NEW BRAND DTO
class BrandInfoDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  stock: number;

  @ApiProperty({ type: [ColorImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorImageDto)
  colorsImage: ColorImageDto[];

  @ApiProperty({ type: [FeatureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[];

  @ApiProperty({ type: ProductImageDto })
  @ValidateNested()
  @Type(() => ProductImageDto)
  thumbnail: ProductImageDto;

  @ApiProperty({ type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @ApiProperty({ type: ProductCategoryDto })
  @ValidateNested()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;

  @ApiProperty({ type: BrandInfoDto })
  @ValidateNested()
  @Type(() => BrandInfoDto)
  brand: BrandInfoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  main?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  semiSub?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  height?: string;

  @ApiProperty({ required: false })
  @IsOptional()
   @Transform(({ value }) => Number(value))
  @IsNumber()
  width?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  colors?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  warrantyPeriod?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasOffer?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  offerPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  offerExpiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  specifications?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shippingTime?: string;

  @ApiProperty({ required: false })
   @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  shippingCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  certifications?: string[];
  @ApiProperty({type:Boolean})
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  isAdminCreated: boolean;
}


