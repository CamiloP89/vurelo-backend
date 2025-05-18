import { IsUUID, IsNumber, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID del portafolio al que pertenece la transacción',
    example: 'f6eec703-833c-4fae-9275-84b2d6344f95',
  })
  @IsUUID()
  portfolioId: string;

  @ApiProperty({
    description: 'Símbolo del activo cripto (según CoinGecko)',
    example: 'bitcoin',
  })
  @IsString()
  @IsNotEmpty()
  asset: string;

  @ApiProperty({
    description: 'Cantidad del activo',
    example: 0.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Tipo de transacción',
    example: 'deposit',
    enum: ['deposit', 'withdrawal'],
  })
  @IsIn(['deposit', 'withdrawal'])
  type: 'deposit' | 'withdrawal';
}
