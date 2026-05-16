import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin-repository';
import { Either, left, right } from '@/core/either';
import { AdminNotFoundError } from './errors/admin-not-found-error';

interface DeleteAdminUseCaseRequest {
  cpf: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DeleteAdminUseCaseResponse = Either<AdminNotFoundError, {}>;

@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    cpf,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByCPF(cpf);

    if (!admin) return left(new AdminNotFoundError());

    await this.adminRepository.delete(admin.cpf);

    return right({});
  }
}
