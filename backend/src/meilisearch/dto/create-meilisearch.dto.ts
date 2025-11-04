

import { IsOptional, IsString, IsBoolean, IsNumberString, IsIn, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  main?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasOffer?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'price' | 'stock' | 'rating';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumberString()
  limit?: number;
}

export class CreateMeilisearchDto {
     @IsString()
  id: string; // must match your Mongo _id as string

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  main?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsBoolean()
  hasOffer?: boolean;

  @IsOptional()
  @IsString()
  createdAt?: string; // store as ISO string for sorting
}
