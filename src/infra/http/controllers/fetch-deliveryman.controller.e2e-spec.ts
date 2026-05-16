import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';
import request from 'supertest';
import { authenticateAdmin } from 'test/utils/auth-admin';

describe('Fetch Deliveryman (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let deliveryManFactory: DeliveryManFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminFactory = moduleRef.get(AdminFactory);
    deliveryManFactory = moduleRef.get(DeliveryManFactory);

    await app.init();
  });

  test('[GET] /deliveryman/details/:cpf', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const deliveryman = await deliveryManFactory.makePrismaDeliveryMan();
    const { cpf } = deliveryman;

    const response = await request(app.getHttpServer())
      .get(`/deliveryman/details/${cpf}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.deliveryman).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({ cpf }),
      }),
    );
  });
});
