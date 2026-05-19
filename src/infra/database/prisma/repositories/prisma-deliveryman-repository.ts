import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DeliveryManRepository } from '@/domain/application/repositories/deliveryman-repository';
import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';
import { PrismaDeliveryManMapper } from '../mappers/delivery-man-mapper';

@Injectable()
export class PrismaDeliveryManRepository implements DeliveryManRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);

    await this.prisma.user.create({
      data: {
        ...data,
        role: 'DELIVERYMAN',
      },
    });
  }

  async findByCPF(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if (!deliveryMan) return null;

    return PrismaDeliveryManMapper.toDomain(deliveryMan);
  }

  async delete(cpf: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        cpf,
      },
    });
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async changePassword(cpf: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        cpf,
      },
      data: {
        password,
      },
    });
  }
}
