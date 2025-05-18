import { WebSocketGateway, WebSocketServer, OnGatewayInit} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: true }) 
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  emitTransactionCreated(data: {
  portfolioId: string;
  asset: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  usdPrice: number;
  usdValue: number;
  createdAt: Date;
}) {
  if (!this.server) {
    this.logger.error('WebSocket server not ready');
    return;
  }

  this.server.emit('transaction_created', {
    event: 'transaction_created',
    data,
  });

  this.logger.log('transaction_created emitido:', JSON.stringify(data));
}
}
