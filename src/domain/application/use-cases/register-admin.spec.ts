import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { RegisterAdminUseCase } from './register-admin';
import { AdminAlreadyExistsError } from './errors/admin-already-exists';

let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;

let sut: RegisterAdminUseCase;

describe('Register Admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterAdminUseCase(inMemoryAdminRepository, fakeHasher);
  });

  it('should be able to register admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '99999999999',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryAdminRepository.items).toHaveLength(1);

    expect(inMemoryAdminRepository.items[0]).toMatchObject({
      name: 'John Doe',
      cpf: '99999999999',
    });
  });

  it('should hash admin password on register', async () => {
    await sut.execute({
      name: 'John Doe',
      cpf: '99999999999',
      password: '123456',
    });

    const admin = inMemoryAdminRepository.items[0];

    expect(admin.password).toEqual(await fakeHasher.hash('123456'));
  });

  it('should not be able to register admin with same cpf', async () => {
    const admin = makeAdmin({
      cpf: '99999999999',
    });

    inMemoryAdminRepository.items.push(admin);

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '99999999999',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError);
  });
});
