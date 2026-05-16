import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RegisterDeliveryManUseCase } from '@/domain/application/use-cases/register-deliveryman';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { StorageModule } from './storage/storage.module';
import { RegisterDeliveryManController } from './controllers/register-deliveryman.controller';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { RegisterAdminUseCase } from '@/domain/application/use-cases/register-admin';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/application/use-cases/authenticate';
import { FetchAdminController } from './controllers/fetch-admin.controller';
import { FetchAdminUseCase } from '@/domain/application/use-cases/fetch-admin';
import { DeleteAdminController } from './controllers/delete-admin.controller';
import { DeleteAdminUseCase } from '@/domain/application/use-cases/delete-admin';
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller';
import { DeleteDeliverymanUseCase } from '@/domain/application/use-cases/delete-deliveryman';
import { FetchDeliverymanController } from './controllers/fetch-deliveryman.controller';
import { FetchDeliverymanUseCase } from '@/domain/application/use-cases/fetch-deliveryman';
import { UpdateDeliverymanController } from './controllers/update-deliveryman.controller';
import { UpdateDeliverymanUseCase } from '@/domain/application/use-cases/update-deliveryman';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterAdminController,
    RegisterDeliveryManController,
    AuthenticateController,
    FetchAdminController,
    FetchDeliverymanController,
    DeleteAdminController,
    DeleteDeliverymanController,
    UpdateDeliverymanController,
  ],
  providers: [
    RegisterAdminUseCase,
    RegisterDeliveryManUseCase,
    AuthenticateUseCase,
    FetchAdminUseCase,
    FetchDeliverymanUseCase,
    DeleteAdminUseCase,
    DeleteDeliverymanUseCase,
    UpdateDeliverymanUseCase,
  ],
})
export class HttpModule {}
