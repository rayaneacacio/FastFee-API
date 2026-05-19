import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { DatabaseModule } from '@/infra/database/database.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { authenticateAdmin } from 'test/utils/auth-admin';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';
import { faker } from '@faker-js/faker';

describe('Change Password (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminFactory: AdminFactory;
  let deliverymanFactory: DeliveryManFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    deliverymanFactory = moduleRef.get(DeliveryManFactory);

    await app.init();
  });

  it('[PATCH] /update-password', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const password = faker.internet.password();
    const hashedPassword = await hash(password, 8);

    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan({
      password: hashedPassword,
    });

    const response = await request(app.getHttpServer())
      .patch('/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cpf: deliveryman.cpf,
        password,
        newPassword: faker.internet.password(),
      });

    expect(response.statusCode).toBe(204);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: deliveryman.cpf,
      },
    });

    expect(userOnDatabase?.password).not.toBe(hashedPassword);
  });
});
