import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { authenticateAdmin } from 'test/utils/auth-admin';
import { RecipientFactory } from 'test/factories/make-recipient';
import request from 'supertest';

describe('Fetch Recipient (E2E)', () => {
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

  test('[GET] /recipient/details/:email', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const recipient = await recipientFactory.makePrismaRecipient();
    const { email } = recipient;

    const response = await request(app.getHttpServer())
      .get(`/recipient/details/${email}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.recipient).toEqual(
      expect.objectContaining({
        email,
        name: expect.any(String),
        city: expect.any(String),
      }),
    );
  });
});
