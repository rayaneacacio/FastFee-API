import { UseCaseError } from '@/core/errors/use-case-error';

export class AdminNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`No administrator with that CPF found..`);
  }
}
