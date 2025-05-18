import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePortfolioDto } from '../auth/dto/create-portfolio.dto';
import { PortfoliosService } from './portfolios.service';
import { Request } from 'express';

@ApiTags('portfolios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo portafolio' })
  @ApiBody({ type: CreatePortfolioDto })
  @ApiResponse({
    status: 201,
    description: 'Portafolio creado exitosamente',
    schema: {
      example: {
        id: 'f6eec703-833c-4fae-9275-84b2d6344f95',
        name: 'Mi portafolio',
        userId: 'a1234567-bc89-1234-d567-8901e23f4567',
        createdAt: '2025-05-18T03:45:00.000Z',
      },
    },
  })
  async create(@Req() req: Request, @Body() body: CreatePortfolioDto) {
    return this.portfoliosService.create(req.user['userId'], body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los portafolios del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de portafolios con sus transacciones',
    schema: {
      example: [
        {
          id: 'f6eec703-833c-4fae-9275-84b2d6344f95',
          name: 'Mi portafolio',
          createdAt: '2025-05-18T03:45:00.000Z',
          userId: 'a1234567-bc89-1234-d567-8901e23f4567',
          transactions: [
            {
              id: 'tx123',
              asset: 'bitcoin',
              amount: 0.01,
              type: 'deposit',
              usdValue: 300,
              createdAt: '2025-05-18T04:00:00.000Z',
            },
          ],
        },
      ],
    },
  })
  async findAll(@Req() req: Request) {
    return this.portfoliosService.findAllByUser(req.user['userId']);
  }

  @Get(':id/value')
  @ApiOperation({
    summary: 'Obtener el valor total en USD de un portafolio específico',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del portafolio',
    example: 'f6eec703-833c-4fae-9275-84b2d6344f95',
  })
  @ApiResponse({
    status: 200,
    description: 'Valor total calculado a partir de sus transacciones',
    schema: {
      example: {
        portfolioId: 'f6eec703-833c-4fae-9275-84b2d6344f95',
        totalUsd: 1540.75,
      },
    },
  })
  async getValue(@Param('id') id: string, @Req() req: Request) {
    return this.portfoliosService.getValue(id, req.user['userId']);
  }
}
