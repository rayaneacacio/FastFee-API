import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '@/infra/database/database.module';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import generateCPF from 'test/utils/generate-CPF';
import { authenticateAdmin } from 'test/utils/auth-admin';

describe('Create DeliveryMan (E2E)', () => {
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

  test('[POST] /deliveryman', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const johnDoeCPF = generateCPF();

    const response = await request(app.getHttpServer())
      .post('/deliveryman')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        cpf: johnDoeCPF,
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: johnDoeCPF,
      },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(userOnDatabase?.role).toBe('DELIVERYMAN');
  });
});
