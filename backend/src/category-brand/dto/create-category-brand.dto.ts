import { IsString, IsOptional, IsUrl, IsArray, ArrayNotEmpty, isBoolean, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  subCategory: string[];

  @ApiPropertyOptional()
  @IsOptional()
  
  logoUrl?: string;
   @ApiPropertyOptional({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
 
  isTop?: boolean;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  subCategory?: string[];

  @ApiPropertyOptional()
  @IsOptional()

  logoUrl?: string;
   @ApiPropertyOptional({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
   @IsOptional()
 
  isTop?: boolean;
}

// ✅ BRAND DTOS
export class CreateBrandDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
 
  logoUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  categories?: string[];
  @ApiPropertyOptional({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
   @IsOptional()
 
  isTop?: boolean;
}

export class UpdateBrandDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  
  logoUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  categories?: string[];
   @ApiPropertyOptional({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
   @IsOptional()
 
  isTop?: boolean;
}

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
