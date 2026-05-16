import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Admin, AdminProps } from '@/domain/enterprise/entitites/admin';
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/admin-mapper';

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      cpf: faker.internet.displayName(),
      password: faker.internet.password(),
      role: 'ADMIN',
      ...override,
    },
    id,
  );

  return admin;
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data);

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    });

    return admin;
  }
}
