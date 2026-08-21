import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createApplicationDto: CreateApplicationDto
  ) {
    return this.applicationsService.create(user.id, createApplicationDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.applicationsService.findByUser(user.id, { page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.findById(id, user.id);
  }

  @Patch(':id/withdraw')
  async withdraw(@Param('id') id: string, @CurrentUser() user: any) {
    return this.applicationsService.withdraw(id, user.id);
  }
}
