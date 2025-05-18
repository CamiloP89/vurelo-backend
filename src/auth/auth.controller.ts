import {Controller, Post, Body, UseGuards, Request,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        id: 'a1234567-bc89-1234-d567-8901e23f4567',
        name: 'Camilo Pinzón',
        email: 'camilopinzon@gmail.com',
        createdAt: '2025-05-18T01:23:45.000Z',
      },
    },
  })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Token generado correctamente',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMTIzNDU2Ny1iYzg5LTEyMzQtZDU2Ny04OTAxZTIzZjQ1NjciLCJlbWFpbCI6ImNhbWlsb0BlbWFpbC5jb20iLCJpYXQiOjE2OTU0Nzc2NjMsImV4cCI6MTY5NTU2NDA2M30.yourtokenhere',
      },
    },
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('me')
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    schema: {
      example: {
        id: 'a1234567-bc89-1234-d567-8901e23f4567',
        name: 'Camilo Pinzón',
        email: 'camilopinzon2018@gmail.com',
        createdAt: '2025-05-18T01:23:45.000Z',
      },
    },
  })
  async me(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
