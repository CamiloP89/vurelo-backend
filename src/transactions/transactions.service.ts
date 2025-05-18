import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { EventsGateway } from '../events/events/events.gateway';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(userId: string, data: {
    portfolioId: string;
    asset: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
  }) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: data.portfolioId },
      include: { user: true },
    });

    if (!portfolio) throw new NotFoundException('Portafolio no encontrado');
    if (portfolio.userId !== userId) throw new ForbiddenException('No autorizado');

    // Obtener precio actual desde CoinGecko
    const usdPrice = await this.getAssetPriceUSD(data.asset);
    const usdValue = data.amount * usdPrice;

    const tx = await this.prisma.transaction.create({
      data: {
        portfolioId: data.portfolioId,
        asset: data.asset,
        amount: data.amount,
        type: data.type,
        usdValue,
      },
    });

    // Emitir evento WebSocket
    this.eventsGateway.emitTransactionCreated({
      portfolioId: data.portfolioId,
      asset: data.asset,
      amount: data.amount,
      type: data.type,
      usdPrice,
      usdValue,
      createdAt: tx.createdAt,
    });

    return {
      message: 'Transacción creada exitosamente',
      transaction: tx,
      usdPrice,
    };
  }

  async findByPortfolio(portfolioId: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { transactions: true },
    });

    if (!portfolio) throw new NotFoundException('Portafolio no encontrado');
    if (portfolio.userId !== userId) throw new ForbiddenException('No autorizado');

    // Obtener los activos únicos de las transacciones
    const uniqueAssets = [
      ...new Set(portfolio.transactions.map((tx) => tx.asset.toLowerCase())),
    ];

    // Consultar precios actualizados desde CoinGecko
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: uniqueAssets.join(','),
        vs_currencies: 'usd',
      },
    });

    // Enriquecer transacciones con el valor actual
    const enrichedTransactions = portfolio.transactions.map((tx) => {
      const currentPrice = data[tx.asset.toLowerCase()]?.usd || 0;
      return {
        ...tx,
        currentUsdValue: +(tx.amount * currentPrice).toFixed(2),
      };
    });

    return enrichedTransactions;
  }

  // Método reutilizable para obtener el precio de una cripto
  private async getAssetPriceUSD(assetSymbol: string): Promise<number> {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: assetSymbol.toLowerCase(),
        vs_currencies: 'usd',
      },
    });

    const price = data[assetSymbol.toLowerCase()]?.usd;
    if (!price) throw new NotFoundException(`Precio no encontrado para ${assetSymbol}`);
    return price;
  }
}
