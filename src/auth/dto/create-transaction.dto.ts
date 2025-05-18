import { IsUUID, IsNumber, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  portfolioId: string;

  @IsString()
  @IsNotEmpty()
  asset: string;

  @IsNumber()
  amount: number;

  @IsIn(['deposit', 'withdrawal'])
  type: 'deposit' | 'withdrawal';
}
