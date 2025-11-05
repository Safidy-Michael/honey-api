import { 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  ArrayMinSize, 
  IsPhoneNumber, 
  IsUrl, 
  MaxLength, 
  Min, 
  IsUUID, 
  IsInt, 
  ValidateNested, 
  IsEnum 
} from 'class-validator';
import { Type } from 'class-transformer';

// --- PRODUCT DTO ---
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Le nom ne doit pas dépasser 100 caractères.' })
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'La description ne doit pas dépasser 500 caractères.' })
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Le prix doit être supérieur ou égal à 0.' })
  price!: number;

  @IsUrl({}, { message: "L'image doit être une URL valide." })
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0, { message: 'Le stock doit être supérieur ou égal à 0.' })
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  badge?: string;
}

// --- ORDER ITEM DTO ---
export class CreateOrderItemDto {
  @IsUUID('4', { message: 'L’ID du produit doit être un UUID valide.' })
  productId!: string;

  @IsInt({ message: 'La quantité doit être un entier.' })
  @Min(1, { message: 'La quantité doit être au moins égale à 1.' })
  quantity!: number;
}

// --- ORDER DTO ---
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  // 👉 ValidateNested est maintenant bien utilisé ici
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1, { message: 'La commande doit contenir au moins un article.' })
  items!: CreateOrderItemDto[];

  @IsString()
  @IsNotEmpty({ message: "L'adresse de livraison est requise." })
  address!: string;

  @IsPhoneNumber('MG', {
    message: 'Le numéro de téléphone doit être un format malgache valide.',
  })
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsOptional()
  note?: string;
}

// --- ORDER STATUS ENUM ---
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// --- UPDATE ORDER DTO ---
export class UpdateOrderDto {
  @IsEnum(OrderStatus, {
    message: 'Le statut doit être une valeur valide (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED).',
  })
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsPhoneNumber('MG', {
    message: 'Le numéro de téléphone doit être un format malgache valide.',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

// --- UPDATE STATUS DTO ---
export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}
