import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreatePortfolioDto {
  @ApiProperty({ example: 'Mi portafolio principal' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
