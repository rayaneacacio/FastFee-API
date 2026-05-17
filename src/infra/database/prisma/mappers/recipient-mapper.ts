import { Recipient as PrismaRecipient } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/enterprise/entitites/recipient';

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        street: raw.street,
        number: raw.number,
        neighborhood: raw.neighborhood,
        city: raw.city,
        state: raw.state,
        zipCode: raw.zipCode,
        latitude: raw.latitude,
        longitude: raw.longitude,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      street: recipient.street,
      number: recipient.number,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
      zipCode: recipient.zipCode,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    };
  }
}
