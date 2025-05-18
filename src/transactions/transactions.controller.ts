import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Request } from 'express';

let io: Server; // WebSocket Server

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Inyectar instancia de socket.io manualmente
  static setSocketServer(server: Server) {
    io = server;
  }

  @Post()
  async create(@Req() req: Request, @Body() body: {
    portfolioId: string;
    asset: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
  }) {
    return this.transactionsService.create(req.user['userId'], body,);
  }

  @Get(':portfolioId')
  findByPortfolio(@Param('portfolioId') id: string, @Req() req) {
    return this.transactionsService.findByPortfolio(id, req.user.userId);
  }
}
