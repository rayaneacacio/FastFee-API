import { UseCaseError } from '@/core/errors/use-case-error';

export class DeliverymanNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`No deliveryman with that CPF found.`);
  }
}
