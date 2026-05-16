import { User as PrismaUser, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Admin } from '@/domain/enterprise/entitites/admin';

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        role: 'ADMIN',
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf,
      password: admin.password,
      role: 'ADMIN',
    };
  }
}
