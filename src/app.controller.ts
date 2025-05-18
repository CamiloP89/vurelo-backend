import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('app') // Cambié 'users' por 'app' ya que este controller es general
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint base, retorno de saludo simple' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('websocket-docs')
  @ApiOperation({ summary: 'Documentación del WebSocket (sólo Swagger)' })
  @ApiResponse({
    status: 200,
    description: 'Instrucciones para usar WebSocket y ejemplos de payloads',
    schema: {
      example: {
        websocketUrl: 'wss://vurelo-backend.onrender.com',
        connectionExample: 'wscat -c wss://vurelo-backend.onrender.com',
        event: 'transaction_created',
        payloadExample: {
          portfolioId: 'f6eec703-833c-4fae-9275-84b2d6344f95',
          asset: 'ethereum',
          amount: 0.5,
          type: 'deposit',
          usdPrice: 2480.45,
          usdValue: 1240.23,
          createdAt: '2025-05-18T04:18:24.241Z',
        },
        clientCodeExample: `const socket = io('wss://vurelo-backend.onrender.com');
socket.on('transaction_created', (data) => {
  console.log('Nueva transacción:', data);
});`,
      },
    },
  })
  getWebSocketDocs() {
    return {
      websocketUrl: 'wss://vurelo-backend.onrender.com',
      connectionExample: 'wscat -c wss://vurelo-backend.onrender.com',
      event: 'transaction_created',
      payloadExample: {
        portfolioId: 'f6eec703-833c-4fae-9275-84b2d6344f95',
        asset: 'ethereum',
        amount: 0.5,
        type: 'deposit',
        usdPrice: 2480.45,
        usdValue: 1240.23,
        createdAt: '2025-05-18T04:18:24.241Z',
      },
      clientCodeExample: `const socket = io('wss://vurelo-backend.onrender.com');
socket.on('transaction_created', (data) => {
  console.log('Nueva transacción:', data);
});`,
    };
  }
}
