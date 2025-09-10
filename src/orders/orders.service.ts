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

    const orderTotal: number = total.reduce((a: number, b: number) => a + b, 0);

    const order = await this.prisma.order.create({
      data: {
        userId: dto.userId,
        total: orderTotal,
        status: 'pending',
      },
    });

    await Promise.all(
      dto.items.map(async (item: CreateOrderItemDto) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error('Product not found');
        return this.prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        });
      }),
    );

    return this.prisma.order.findUnique({
      where: { id: order.id },
      include: { orderItems: true },
    });
  }

  findAll() {
    return this.prisma.order.findMany({ include: { orderItems: true } });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
