import {Controller ,Post ,Get ,Body ,Param,Req ,UseGuards,} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from 'src/auth/dto/create-transaction.dto';
import {ApiTags, ApiOperation, ApiBearerAuth,ApiBody, ApiParam, ApiResponse,} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción para un portafolio' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada exitosamente',
    schema: {
      example: {
        message: 'Transacción creada exitosamente',
        transaction: {
          id: '9939b2ab-97de-4dbc-b288-592e1856482d',
          portfolioId: 'f6eec703-833c-4fae-9275-84b2d6344f95',
          asset: 'ethereum',
          amount: 0.5,
          type: 'deposit',
          usdValue: 1240.23,
          createdAt: '2025-05-18T04:18:24.241Z',
        },
        usdPrice: 2480.45,
      },
    },
  })
  async create(@Req() req: Request, @Body() body: CreateTransactionDto) {
    return this.transactionsService.create(req.user['userId'], body);
  }

  @Get(':portfolioId')
  @ApiOperation({
    summary: 'Listar transacciones de un portafolio con valor actual en USD',
  })
  @ApiParam({
    name: 'portfolioId',
    description: 'UUID del portafolio',
    example: 'f6eec703-833c-4fae-9275-84b2d6344f95',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones con valor actualizado en USD',
    schema: {
      example: [
        {
          id: '1234abcd',
          asset: 'bitcoin',
          amount: 0.01,
          type: 'deposit',
          usdValue: 300,
          createdAt: '2025-05-18T02:00:00.000Z',
          portfolioId: 'f6eec703-833c-4fae-9275-84b2d6344f95',
          currentUsdValue: 310.45,
        },
        {
          id: '5678efgh',
          asset: 'ethereum',
          amount: 0.5,
          type: 'withdrawal',
          usdValue: 1100,
          createdAt: '2025-05-18T03:00:00.000Z',
          portfolioId: 'f6eec703-833c-4fae-9275-84b2d6344f95',
          currentUsdValue: 1200.78,
        },
      ],
    },
  })
  async findByPortfolio(
    @Param('portfolioId') id: string,
    @Req() req: Request,
  ) {
    return this.transactionsService.findByPortfolio(id, req.user['userId']);
  }
}
