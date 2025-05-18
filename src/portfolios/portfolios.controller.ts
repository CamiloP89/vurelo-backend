import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePortfolioDto } from '../auth/dto/create-portfolio.dto';

@UseGuards(JwtAuthGuard)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  create(@Req() req, @Body() body: CreatePortfolioDto) {
  return this.portfoliosService.create(req.user.userId, body.name);
}

  @Get()
  findAll(@Req() req) {
    return this.portfoliosService.findAllByUser(req.user.userId);
  }

  @Get(':id/value')
  getValue(@Param('id') id: string, @Req() req) {
    return this.portfoliosService.getValue(id, req.user.userId);
  }
}
