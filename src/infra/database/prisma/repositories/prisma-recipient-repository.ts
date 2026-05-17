import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Recipient } from '@/domain/enterprise/entitites/recipient';
import { RecipientRepository } from '@/domain/application/repositories/recipient-repository';
import { PrismaRecipientMapper } from '../mappers/recipient-mapper';

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { email },
    });

    if (!recipient) return null;

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async delete(email: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: { email },
    });
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    });

    if (!recipient) return null;

    return PrismaRecipientMapper.toDomain(recipient);
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
