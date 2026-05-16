import { DeleteDeliverymanUseCase } from './delete-deliveryman';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { makeDeliveryMan } from 'test/factories/make-deliveryman';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';
import generateCPF from 'test/utils/generate-CPF';

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let sut: DeleteDeliverymanUseCase;

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();

    sut = new DeleteDeliverymanUseCase(inMemoryDeliveryManRepository);
  });

  it('should be able to delete a deliveryman by cpf', async () => {
    const deliveryman = makeDeliveryMan();

    await inMemoryDeliveryManRepository.create(deliveryman);

    expect(inMemoryDeliveryManRepository.items).toHaveLength(1);

    const result = await sut.execute({
      cpf: deliveryman.cpf,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliveryManRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a deliveryman that does not exist', async () => {
    const nonExistingCpf = generateCPF();

    const result = await sut.execute({
      cpf: nonExistingCpf,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliverymanNotFoundError);
    expect(inMemoryDeliveryManRepository.items).toHaveLength(0);
  });
});
