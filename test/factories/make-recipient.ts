import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  Recipient,
  RecipientProps,
} from '@/domain/enterprise/entitites/recipient';
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/recipient-mapper';

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      neighborhood: faker.location.county(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  );

  return recipient;
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data);

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    });

    return recipient;
  }
}
