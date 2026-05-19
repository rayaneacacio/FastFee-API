import { beforeEach, describe, expect, it } from 'vitest';
import { ChangePasswordUseCase } from './change-password';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { hash } from 'bcryptjs';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { makeAdmin } from 'test/factories/make-admin';
import { faker } from '@faker-js/faker';
import generateCPF from 'test/utils/generate-CPF';

let inMemoryAdminRepository: InMemoryAdminRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let sut: ChangePasswordUseCase;

describe('Change Password', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();

    sut = new ChangePasswordUseCase(
      inMemoryDeliveryManRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to change admin password when current password is valid', async () => {
    const password = faker.internet.password();
    const hashedPassword = await hash(password, 8);

    const admin = makeAdmin({
      password: hashedPassword,
    });

    await inMemoryAdminRepository.create(admin);

    const newPassword = faker.internet.password();

    const result = await sut.execute({
      cpf: admin.cpf,
      password: password,
      newPassword: newPassword,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAdminRepository.items[0].password).not.toBe(hashedPassword);
  });

  it('should not be able to change password if user does not exist', async () => {
    const result = await sut.execute({
      cpf: generateCPF(),
      password: faker.internet.password(),
      newPassword: faker.internet.password(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it('should not be able to change password with incorrect current password', async () => {
    const hashedPassword = await hash('correct-password', 8);

    const admin = makeAdmin({
      password: hashedPassword,
    });

    await inMemoryAdminRepository.create(admin);

    const result = await sut.execute({
      cpf: generateCPF(),
      password: 'wrong-password',
      newPassword: faker.internet.password(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
    expect(inMemoryAdminRepository.items[0].password).toBe(hashedPassword);
  });
});
