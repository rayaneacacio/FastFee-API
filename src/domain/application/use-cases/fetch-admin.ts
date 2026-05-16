import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin-repository';
import { Admin } from '@/domain/enterprise/entitites/admin';
import { AdminNotFoundError } from './errors/admin-not-found-error';

interface FetchAdminUseCaseRequest {
  cpf: string;
}

type FetchAdminUseCaseResponse = Either<
  AdminNotFoundError,
  {
    admin: Admin;
  }
>;

@Injectable()
export class FetchAdminUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute({
    cpf,
  }: FetchAdminUseCaseRequest): Promise<FetchAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByCPF(cpf);

    if (!admin) return left(new AdminNotFoundError());

    return right({
      admin,
    });
  }
}
