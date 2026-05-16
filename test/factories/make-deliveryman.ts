import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/enterprise/entitites/deliveryman';
import { PrismaDeliveryManMapper } from '@/infra/database/prisma/mappers/delivery-man-mapper';

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryMan = DeliveryMan.create(
    {
      name: faker.person.fullName(),
      cpf: faker.internet.displayName(),
      password: faker.internet.password(),
      role: 'DELIVERYMAN',
      ...override,
    },
    id,
  );

  return deliveryMan;
}

@Injectable()
export class DeliveryManFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryMan(
    data: Partial<DeliveryManProps> = {},
  ): Promise<DeliveryMan> {
    const deliveryMan = makeDeliveryMan(data);

    await this.prisma.user.create({
      data: PrismaDeliveryManMapper.toPrisma(deliveryMan),
    });

    return deliveryMan;
  }
}
