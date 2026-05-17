import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-deliveryman-repository';
import { DeliveryManRepository } from '@/domain/application/repositories/deliveryman-repository';
import { AdminRepository } from '@/domain/application/repositories/admin-repository';
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository';
import { RecipientRepository } from '@/domain/application/repositories/recipient-repository';
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository';

@Module({
  // imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: AdminRepository,
      useClass: PrismaAdminRepository,
    },
    {
      provide: DeliveryManRepository,
      useClass: PrismaDeliveryManRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminRepository,
    DeliveryManRepository,
    RecipientRepository,
  ],
})
export class DatabaseModule {}
