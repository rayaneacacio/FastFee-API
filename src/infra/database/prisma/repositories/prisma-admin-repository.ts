import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Admin } from '@/domain/enterprise/entitites/admin';
import { AdminRepository } from '@/domain/application/repositories/admin-repository';
import { PrismaAdminMapper } from '../mappers/admin-mapper';

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin);

    await this.prisma.user.create({
      data: {
        ...data,
        role: 'ADMIN',
      },
    });
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!admin) return null;

    return PrismaAdminMapper.toDomain(admin);
  }
}
