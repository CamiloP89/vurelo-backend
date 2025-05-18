import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Server } from 'socket.io';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateTransactionDto } from '../auth/dto/create-transaction.dto';


let io: Server; // WebSocket Server
@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Inyectar instancia de socket.io manualmente
  static setSocketServer(server: Server) {
    io = server;
  }

  @Post()
  @ApiOperation({ summary: 'Crear una transacción' })
  @ApiBearerAuth() 
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Body() body: CreateTransactionDto,
  ) {
    return this.transactionsService.create(req.user['userId'], body);
  }

  @Get(':portfolioId')
  @ApiOperation({ summary: 'Listar transacciones de un portafolio con su valor actualizado en USD' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'portfolioId',
    description: 'UUID del portafolio del usuario',
    example: 'f6eec703-833c-4fae-9275-84b2d6344f95',
  })
  @UseGuards(JwtAuthGuard)
  async findByPortfolio(
    @Param('portfolioId') id: string,
    @Req() req: Request,
  ) {
    return this.transactionsService.findByPortfolio(id, req.user['userId']);
  }
}
