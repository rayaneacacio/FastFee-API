import { User as PrismaUser, Prisma } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';

export class PrismaDeliveryManMapper {
  static toDomain(raw: PrismaUser): DeliveryMan {
    return DeliveryMan.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        role: 'DELIVERYMAN',
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(deliveryMan: DeliveryMan): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryMan.id.toString(),
      name: deliveryMan.name,
      cpf: deliveryMan.cpf,
      password: deliveryMan.password,
      role: 'DELIVERYMAN',
    };
  }
}
