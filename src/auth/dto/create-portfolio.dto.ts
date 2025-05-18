import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({
    description: 'Nombre del portafolio',
    example: 'Portafolio Cripto Principal',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
