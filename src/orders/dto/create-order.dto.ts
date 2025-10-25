import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  badge?: string;
}

export class CreateOrderItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  userId!: string;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items!: CreateOrderItemDto[];

  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsString()
  note?: string;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}
