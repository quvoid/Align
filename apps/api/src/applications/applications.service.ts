import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateApplicationDto) {
    // Check for duplicate application
    const existing = await this.prisma.application.findFirst({
      where: {
        creatorId: userId,
        brandId: dto.brandId,
        status: { not: 'WITHDRAWN' },
      },
    });

    if (existing) {
      throw new ConflictException('You have already applied for this brand');
    }

    // Get creator's profile snapshot if available
    const profile = await this.prisma.creatorProfile.findUnique({
      where: { userId },
    });

    const application = await this.prisma.application.create({
      data: {
        creatorId: userId,
        brandId: dto.brandId,
        proposal: dto.proposal,
        expectedRate: dto.expectedRate,
        deliverables: dto.deliverables,
        status: 'PENDING',
        metricsSnapshot: (profile as any) || {},
      },
    });

    this.eventEmitter.emit('application.submitted', application);

    return application;
  }

  async findByUser(userId: string, query: { page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.application.findMany({
        where: { creatorId: userId },
        skip,
        take: limit,
        include: { brand: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.application.count({ where: { creatorId: userId } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, userId: string) {
    const application = await this.prisma.application.findFirst({
      where: { id, creatorId: userId },
      include: { brand: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async withdraw(id: string, userId: string) {
    const application = await this.findById(id, userId);

    return this.prisma.application.update({
      where: { id: application.id },
      data: { status: 'WITHDRAWN' },
    });
  }
}
