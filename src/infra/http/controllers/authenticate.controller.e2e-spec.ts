import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import request from 'supertest';
import generateCPF from 'test/utils/generate-CPF';
import { faker } from '@faker-js/faker';

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
    const cpf = generateCPF();
    const password = faker.internet.password();

    await adminFactory.makePrismaAdmin({
      cpf,
      password: await hash(password, 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf,
      password,
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
