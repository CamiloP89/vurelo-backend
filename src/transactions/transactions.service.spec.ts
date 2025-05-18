import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import { EventsGateway } from '../events/events/events.gateway';

// Simular axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService, PrismaService, EventsGateway],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('debería retornar el precio en USD de bitcoin', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        bitcoin: { usd: 12345.67 },
      },
    });

    const price = await service['getAssetPriceUSD']('bitcoin');

    expect(price).toBe(12345.67);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin',
          vs_currencies: 'usd',
        },
      },
    );
  });
});
