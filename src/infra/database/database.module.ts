import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-deliveryman-repository';
import { DeliveryManRepository } from '@/domain/application/repositories/deliveryman-repository';
import { AdminRepository } from '@/domain/application/repositories/admin-repository';
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository';

@Module({
  // imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: DeliveryManRepository,
      useClass: PrismaDeliveryManRepository,
    },
    {
      provide: AdminRepository,
      useClass: PrismaAdminRepository,
    },
  ],
  exports: [PrismaService, AdminRepository, DeliveryManRepository],
})
export class DatabaseModule {}
