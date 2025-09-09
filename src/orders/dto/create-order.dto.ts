import { IsInt, IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  productId!: number;

  @IsInt()
  quantity!: number;
}

export class CreateOrderDto {
  @IsInt()
  userId!: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
