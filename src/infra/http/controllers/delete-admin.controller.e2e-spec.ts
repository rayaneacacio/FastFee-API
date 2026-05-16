import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import request from 'supertest';
import { authenticateAdmin } from 'test/utils/auth-admin';

describe('Delete Admin (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    adminFactory = moduleRef.get(AdminFactory);

    await app.init();
  });

  test('[DELETE] /admin/:cpf', async () => {
    const { admin, token } = await authenticateAdmin(app, adminFactory);
    const { cpf } = admin;

    const response = await request(app.getHttpServer())
      .delete(`/admin/${cpf}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
