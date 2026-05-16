import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcryptjs';
import generateCPF from './generate-CPF';
import { AdminFactory } from 'test/factories/make-admin';
import { Admin } from '@/domain/enterprise/entitites/admin';

interface AuthenticateAdminResponse {
  token: string;
  admin: Admin;
}

export async function authenticateAdmin(
  app: INestApplication,
  adminFactory: AdminFactory,
): Promise<AuthenticateAdminResponse> {
  const adminCPF = generateCPF();
  const rawPassword = '123456';

  const admin = await adminFactory.makePrismaAdmin({
    cpf: adminCPF,
    password: await hash(rawPassword, 8),
  });

  const authResponse = await request(app.getHttpServer())
    .post('/sessions')
    .send({
      cpf: adminCPF,
      password: rawPassword,
    });

  const token = authResponse.body.access_token;

  return {
    token,
    admin,
  };
}
