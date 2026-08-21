import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class CreatorsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.creatorProfile.findUnique({
      where: { userId },
    });

    return profile || null;
  }

  async upsertProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.creatorProfile.upsert({
      where: { userId },
      update: {
        ...dto,
      },
      create: {
        userId,
        ...dto,
      },
    });
  }
}
