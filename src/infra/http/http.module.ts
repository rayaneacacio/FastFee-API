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
import { RegisterRecipientController } from './controllers/register-recipient.controller';
import { RegisterRecipientUseCase } from '@/domain/application/use-cases/register-recipient';
import { FetchRecipientController } from './controllers/fetch-recipient.controller';
import { FetchRecipientUseCase } from '@/domain/application/use-cases/fetch-recipient';
import { DeleteRecipientController } from './controllers/delete-recipient.controller';
import { DeleteRecipientUseCase } from '@/domain/application/use-cases/delete-recipient';
import { UpdateRecipientController } from './controllers/update-recipient.controller';
import { UpdateRecipientUseCase } from '@/domain/application/use-cases/update-recipient';
import { ChangePasswordController } from './controllers/change-password.controller';
import { ChangePasswordUseCase } from '@/domain/application/use-cases/change-password';

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
    RegisterRecipientController,
    FetchRecipientController,
    DeleteRecipientController,
    UpdateRecipientController,
    ChangePasswordController,
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
    RegisterRecipientUseCase,
    FetchRecipientUseCase,
    DeleteRecipientUseCase,
    UpdateRecipientUseCase,
    ChangePasswordUseCase,
  ],
})
export class HttpModule {}
