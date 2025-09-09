import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const total = await Promise.all(dto.items.map(async item => {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error('Product not found');
      return product.price * item.quantity;
    }));
    const orderTotal = total.reduce((a, b) => a + b, 0);

    const order = await this.prisma.order.create({
      data: {
        userId: dto.userId,
        total: orderTotal,
        items: {
          create: dto.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: 0, // store price at the moment
          })),
        },
      },
      include: { items: true },
    });
    return order;
  }

  findAll() {
    return this.prisma.order.findMany({ include: { items: true } });
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
  }
}
