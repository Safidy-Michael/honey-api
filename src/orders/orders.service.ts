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

        if (!product) throw new Error('Produit introuvable');
        if (product.stock <= 0)
          throw new Error(`Le produit ${product.name} est en rupture de stock`);
        if (item.quantity > product.stock)
          throw new Error(
            `Stock insuffisant pour ${product.name}. Disponible : ${product.stock}`,
          );

        return product.price * item.quantity;
      }),
    );

    const orderTotal = total.reduce((a, b) => a + b, 0);

    const order = await this.prisma.order.create({
      data: {
        userId: dto.userId,
        total: orderTotal,
        status: 'pending',
        address: dto.address,
        phone: dto.phone,
        note: dto.note,
      },
    });

    await Promise.all(
      dto.items.map(async (item: CreateOrderItemDto) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error('Produit introuvable');

        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });

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

  async patchUpdate(
    id: string,
    dto: Partial<CreateOrderDto> & { status?: string },
  ) {
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
