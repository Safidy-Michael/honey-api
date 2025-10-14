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
          where: { id: String(item.productId) },
        });
        if (!product) throw new Error('Product not found');
        return product.price * item.quantity;
      }),
    );

    const orderTotal = total.reduce((a, b) => a + b, 0);

    const order = await this.prisma.order.create({
      data: {
        userId: String(dto.userId),
        total: orderTotal,
        status: 'pending',
      },
    });

    await Promise.all(
      dto.items.map(async (item: CreateOrderItemDto) => {
        const product = await this.prisma.product.findUnique({
          where: { id: String(item.productId) },
        });
        if (!product) throw new Error('Product not found');
        return this.prisma.orderItem.create({
          data: {
            orderId: String(order.id),
            productId: String(item.productId),
            quantity: item.quantity,
            price: product.price,
          },
        });
      }),
    );

    return this.prisma.order.findUnique({
      where: { id: String(order.id) },
      include: { orderItems: true },
    });
  }

  findAll() {
    return this.prisma.order.findMany({ include: { orderItems: true } });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id: String(id) },
      include: { orderItems: true },
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({ where: { id: String(id) } });
  }

  async patchUpdate(id: string, dto: Partial<CreateOrderDto> & { status?: string }) {
    const order = await this.prisma.order.findUnique({ where: { id: String(id) } });
    if (!order) throw new Error('Order not found');

    return this.prisma.order.update({
      where: { id: String(id) },
      data: {
        ...(dto.status ? { status: dto.status } : {}),
      },
      include: { orderItems: true },
    });
  }
}
