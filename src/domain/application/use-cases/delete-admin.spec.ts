import { DeleteAdminUseCase } from './delete-admin';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { AdminNotFoundError } from './errors/admin-not-found-error';
import generateCPF from 'test/utils/generate-CPF';

let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: DeleteAdminUseCase;

describe('Delete Admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();

    sut = new DeleteAdminUseCase(inMemoryAdminRepository);
  });

  it('should be able to delete an admin by cpf', async () => {
    const admin = makeAdmin();

    await inMemoryAdminRepository.create(admin);

    expect(inMemoryAdminRepository.items).toHaveLength(1);

    const result = await sut.execute({
      cpf: admin.cpf,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAdminRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an admin that does not exist', async () => {
    const nonExistingCpf = generateCPF();

    const result = await sut.execute({
      cpf: nonExistingCpf,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AdminNotFoundError);
    expect(inMemoryAdminRepository.items).toHaveLength(0);
  });
});
