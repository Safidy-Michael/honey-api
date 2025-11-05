import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const total = await Promise.all(
      dto.items.map(async (item: CreateOrderItemDto) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error('Product not found');
        return product.price * item.quantity;
      }),
    );
    const orderTotal = total.reduce((a, b) => a + b, 0);
  
    return this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId: dto.userId,
          total: orderTotal,
          status: 'pending',
          address: dto.address,
          phone: dto.phone,
          note: dto.note,
        },
      });
  
      for (const item of dto.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
  
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
  
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for product ${product.name}`);
        }
  
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
  
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        });
      }
  
      return prisma.order.findUnique({
        where: { id: order.id },
        include: { orderItems: true },
      });
    });
  }

  findAll() {
    return this.prisma.order.findMany({ include: { orderItems: true } });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
  }
  findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }

  async patchUpdate(id: string, dto: Partial<CreateOrderDto> & { status?: string }) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new Error('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.address ? { address: dto.address } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.note ? { note: dto.note } : {}),
      },
      include: { orderItems: true },
    });
  }
}
