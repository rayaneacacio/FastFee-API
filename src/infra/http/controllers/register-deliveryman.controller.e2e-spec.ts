import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import request from 'supertest';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';

describe('Create DeliveryMan (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let deliveryman: DeliveryManFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    deliveryman = moduleRef.get(DeliveryManFactory);

    await app.init();
  });

  test('[POST] /deliveryman', async () => {
    await deliveryman.makePrismaDeliveryMan({
      cpf: '99999999999',
      password: await hash('123456', 8),
    });

    const authResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        cpf: '99999999999',
        password: '123456',
      });

    const token = authResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .post('/deliveryman')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe 2',
        cpf: '88888888888',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '88888888888',
      },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(userOnDatabase?.role).toBe('DELIVERYMAN');
  });
});
