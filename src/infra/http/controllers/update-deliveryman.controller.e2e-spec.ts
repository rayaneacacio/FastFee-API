import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';
import request from 'supertest';
import { authenticateAdmin } from 'test/utils/auth-admin';

describe('Update Deliveryman (E2E)', () => {
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

  test('[PUT] /deliveryman/:cpf', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);
    const { cpf } = await deliveryManFactory.makePrismaDeliveryMan({
      name: 'Nome Original',
    });

    const response = await request(app.getHttpServer())
      .put(`/deliveryman/${cpf}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nome Atualizado Pelo E2E',
      });

    expect(response.statusCode).toBe(204);

    const fetchDeliveryman = await request(app.getHttpServer())
      .get(`/deliveryman/details/${cpf}`)
      .set('Authorization', `Bearer ${token}`);

    expect(fetchDeliveryman.statusCode).toBe(200);

    expect(fetchDeliveryman.body.deliveryman).toEqual(
      expect.objectContaining({
        props: expect.objectContaining({
          name: 'Nome Atualizado Pelo E2E',
        }),
      }),
    );
  });
});
