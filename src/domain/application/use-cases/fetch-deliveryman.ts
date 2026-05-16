import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { DeliveryManRepository } from '../repositories/deliveryman-repository';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';
import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';

interface FetchDeliverymanUseCaseRequest {
  cpf: string;
}

type FetchDeliverymanUseCaseResponse = Either<
  DeliverymanNotFoundError,
  {
    deliveryman: DeliveryMan;
  }
>;

@Injectable()
export class FetchDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliveryManRepository) {}

  async execute({
    cpf,
  }: FetchDeliverymanUseCaseRequest): Promise<FetchDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCPF(cpf);

    if (!deliveryman) return left(new DeliverymanNotFoundError());

    return right({
      deliveryman,
    });
  }
}
