import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';
import request from 'supertest';
import { authenticateAdmin } from 'test/utils/auth-admin';
import { DeliveryManPresenter } from '../presenters/deliveryman-presenter';

describe('Delete Deliveryman (E2E)', () => {
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

  test('[DELETE] /deliveryman/:cpf', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const deliveryman = await deliveryManFactory.makePrismaDeliveryMan();

    await request(app.getHttpServer())
      .post('/deliveryman')
      .set('Authorization', `Bearer ${token}`)
      .send(DeliveryManPresenter.toHTTP(deliveryman));

    const response = await request(app.getHttpServer())
      .delete(`/deliveryman/${deliveryman.cpf}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
