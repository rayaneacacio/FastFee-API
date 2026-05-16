import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DeliveryManRepository } from '../repositories/deliveryman-repository';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';

interface DeleteDeliverymanUseCaseRequest {
  cpf: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DeleteDeliverymanUseCaseResponse = Either<DeliverymanNotFoundError, {}>;

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliveryManRepository) {}

  async execute({
    cpf,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCPF(cpf);

    if (!deliveryman) return left(new DeliverymanNotFoundError());

    await this.deliverymanRepository.delete(deliveryman.cpf);

    return right({});
  }
}
