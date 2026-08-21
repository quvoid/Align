import { Controller, Get, Param, Query } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandQueryDto } from './dto/brand-query.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(@Query() query: BrandQueryDto) {
    return this.brandsService.findAll(query);
  }

  @Get('featured')
  async findFeatured() {
    return this.brandsService.findFeatured();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.brandsService.findBySlug(slug);
  }
}
