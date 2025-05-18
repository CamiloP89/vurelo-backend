import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Camilo Pinzón' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'camilopinzon2018@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Cp1032797983' })
  @IsString()
  @MinLength(6)
  password: string;
}
