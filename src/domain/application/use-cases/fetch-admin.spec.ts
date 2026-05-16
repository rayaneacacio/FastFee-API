import { FetchAdminUseCase } from './fetch-admin';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { AdminNotFoundError } from './errors/admin-not-found-error';

let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: FetchAdminUseCase;

describe('Fetch Admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();

    sut = new FetchAdminUseCase(inMemoryAdminRepository);
  });

  it('should be able to fetch an admin by cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminRepository.create(admin);

    const result = await sut.execute({
      cpf: admin.cpf,
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      admin: expect.objectContaining({
        cpf: admin.cpf,
      }),
    });
  });

  it('should not be able to fetch an admin that does not exist', async () => {
    const result = await sut.execute({
      cpf: '99999999999',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(AdminNotFoundError);
  });
});
