import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '@/infra/database/database.module';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { authenticateAdmin } from 'test/utils/auth-admin';
import { makeRecipient } from 'test/factories/make-recipient';
import { faker } from '@faker-js/faker';
import { RecipientPresenter } from '../presenters/recipient-presenter';

describe('Register Recipient (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);

    await app.init();
  });

  test('[POST] /recipient', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const recipientEmail = faker.internet.email();

    const recipient = makeRecipient({
      email: recipientEmail,
    });

    const response = await request(app.getHttpServer())
      .post('/recipient')
      .set('Authorization', `Bearer ${token}`)
      .send(RecipientPresenter.toHTTP(recipient));

    expect(response.statusCode).toBe(201);

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: recipientEmail,
      },
    });

    expect(recipientOnDatabase).toBeTruthy();
  });
});
