import { Controller, Post, Get, Delete, Param, Body, ParseIntPipe, Put, Req, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
  
   @Put(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: { status?: string },
  @Req() req: import('express').Request
) {
  interface User {
    role: string;
  }
  const user = req.user as User;
  if (user.role !== 'admin') {
    throw new ForbiddenException('Seul l\'admin peut mettre à jour le statut');
  }
  return this.ordersService.update(id, dto);
}

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
