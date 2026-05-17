import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { authenticateAdmin } from 'test/utils/auth-admin';
import { RecipientFactory } from 'test/factories/make-recipient';
import request from 'supertest';
import { faker } from '@faker-js/faker';

describe('Update Deliveryman (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let recipientFactory: RecipientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    recipientFactory = moduleRef.get(RecipientFactory);

    await app.init();
  });

  test('[PUT] /recipient/:id', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const email = faker.internet.email();

    const { id } = await recipientFactory.makePrismaRecipient({
      email,
    });

    const newEmail = faker.internet.email();

    const response = await request(app.getHttpServer())
      .put(`/recipient/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: newEmail,
      });

    expect(response.statusCode).toBe(204);

    const fetchDeliverymanByNewEmail = await request(app.getHttpServer())
      .get(`/recipient/details/${newEmail}`)
      .set('Authorization', `Bearer ${token}`);

    expect(fetchDeliverymanByNewEmail.statusCode).toBe(200);

    const fetchDeliverymanByOldEmail = await request(app.getHttpServer())
      .get(`/recipient/details/${email}`)
      .set('Authorization', `Bearer ${token}`);

    expect(fetchDeliverymanByOldEmail.statusCode).toBe(404);
  });
});
