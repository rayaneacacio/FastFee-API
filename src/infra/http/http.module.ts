import { Module } from '@nestjs/common';

// import { AuthenticateController } from './controllers/authenticate.controller';
import { DatabaseModule } from '../database/database.module';
import { RegisterDeliveryManUseCase } from '@/domain/application/use-cases/register-deliveryman';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from './storage/storage.module';
import { RegisterDeliveryManController } from './controllers/register-deliveryman.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { RegisterAdminUseCase } from '@/domain/application/use-cases/register-admin';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/application/use-cases/authenticate';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterAdminController,
    RegisterDeliveryManController,
    AuthenticateController,
  ],
  providers: [
    RegisterAdminUseCase,
    RegisterDeliveryManUseCase,
    AuthenticateUseCase,
  ],
})
export class HttpModule {}
