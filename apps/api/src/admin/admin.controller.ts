import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AdminApplicationQueryDto } from './dto/admin-application-query.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('brands')
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.adminService.createBrand(createBrandDto);
  }

  @Put('brands/:id')
  async updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto
  ) {
    return this.adminService.updateBrand(id, updateBrandDto);
  }

  @Delete('brands/:id')
  async deleteBrand(@Param('id') id: string) {
    return this.adminService.deleteBrand(id);
  }

  @Get('applications')
  async findAllApplications(@Query() query: AdminApplicationQueryDto) {
    return this.adminService.findAllApplications(query);
  }

  @Patch('applications/:id/status')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: any
  ) {
    return this.adminService.updateApplicationStatus(
      id,
      dto.status,
      dto.adminNotes,
      user.id
    );
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }
}
