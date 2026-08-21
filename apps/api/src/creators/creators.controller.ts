import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('creators/profile')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Get()
  async getProfile(@CurrentUser() user: any) {
    return this.creatorsService.getProfile(user.id);
  }

  @Put()
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.creatorsService.upsertProfile(user.id, updateProfileDto);
  }
}
