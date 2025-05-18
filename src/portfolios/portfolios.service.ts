import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from 'src/auth/dto/create-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

 async create(userId: string, data: CreatePortfolioDto) {
  return this.prisma.portfolio.create({
    data: {
      name: data.name,
      userId: userId,
    },
  });
  }

  async findAllByUser(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      include: { transactions: true },
    });
  }

  async getValue(portfolioId: string, userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { transactions: true },
    });

    if (!portfolio) throw new NotFoundException('Portafolio no encontrado');
    if (portfolio.userId !== userId) throw new ForbiddenException('Acceso denegado');

    const totalUsd = portfolio.transactions.reduce((acc, tx) => acc + tx.usdValue, 0);
    return { portfolioId, totalUsd };
  }
}
