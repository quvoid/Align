import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AdminApplicationQueryDto } from './dto/admin-application-query.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createBrand(dto: CreateBrandDto) {
    let slug = this.generateSlug(dto.name);
    
    // Check if slug exists, append random if needed
    const existing = await this.prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    return this.prisma.brand.create({
      data: {
        ...dto,
        requirements: dto.requirements || {},
        slug,
      },
    });
  }

  async updateBrand(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    let slug = brand.slug;
    if (dto.name && dto.name !== brand.name) {
      slug = this.generateSlug(dto.name);
      const existing = await this.prisma.brand.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
  }

  async deleteBrand(id: string) {
    return this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findAllApplications(query: AdminApplicationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.brandId) {
      where.brandId = query.brandId;
    }

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        include: {
          brand: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              creatorProfile: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus, adminNotes?: string, reviewedBy?: string) {
    return this.prisma.application.update({
      where: { id },
      data: {
        status,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date(),
      },
    });
  }

  async getStats() {
    const [
      totalBrands,
      activeBrands,
      totalCreators,
      applicationsByStatus,
    ] = await Promise.all([
      this.prisma.brand.count(),
      this.prisma.brand.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'CREATOR' } }),
      this.prisma.application.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),
    ]);

    const formattedApplicationsStats = applicationsByStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      brands: {
        total: totalBrands,
        active: activeBrands,
      },
      creators: {
        total: totalCreators,
      },
      applications: formattedApplicationsStats,
    };
  }
}
