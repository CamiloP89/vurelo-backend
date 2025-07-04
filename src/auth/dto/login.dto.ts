import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'camilopinzon2018@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Cp1032797983' })
  @IsString()
  @MinLength(6)
  password: string;
}
