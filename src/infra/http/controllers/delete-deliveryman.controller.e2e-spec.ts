import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AdminFactory } from 'test/factories/make-admin';
import { DeliveryManFactory } from 'test/factories/make-deliveryman';
import request from 'supertest';
import { authenticateAdmin } from 'test/utils/auth-admin';
import generateCPF from 'test/utils/generate-CPF';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Delete Deliveryman (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);

    await app.init();
  });

  test('[DELETE] /deliveryman/:cpf', async () => {
    const { token } = await authenticateAdmin(app, adminFactory);

    const johnDoeCPF = generateCPF();

    await request(app.getHttpServer())
      .post('/deliveryman')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        cpf: johnDoeCPF,
        password: '123456',
      });

    const deliveryman = await prisma.user.findUnique({
      where: {
        cpf: johnDoeCPF,
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/deliveryman/${deliveryman?.cpf}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});
