import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import request from 'supertest';

describe('Authenticate (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: '99999999999',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '99999999999',
      password: '123456',
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
