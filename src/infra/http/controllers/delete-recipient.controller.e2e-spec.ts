import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';
import request from 'supertest';
import { authenticateAdmin } from 'test/utils/auth-admin';
import { RecipientFactory } from 'test/factories/make-recipient';
import { RecipientPresenter } from '../presenters/recipient-presenter';

describe('Delete Recipient (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminFactory = moduleRef.get(AdminFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test('[DELETE] /recipient/:email', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const recipient = await recipientFactory.makePrismaRecipient();
    const { email } = recipient;

    await request(app.getHttpServer())
      .post('/recipient')
      .set('Authorization', `Bearer ${token}`)
      .send(RecipientPresenter.toHTTP(recipient));

    const response = await request(app.getHttpServer())
      .delete(`/recipient/${email}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
