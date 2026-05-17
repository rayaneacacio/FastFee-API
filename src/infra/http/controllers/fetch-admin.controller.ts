import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { FetchAdminUseCase } from '@/domain/application/use-cases/fetch-admin';
import { AdminNotFoundError } from '@/domain/application/use-cases/errors/admin-not-found-error';
import { AdminPresenter } from '../presenters/admin-presenter';

@Controller('/admin/details')
export class FetchAdminController {
  constructor(private fetchAdmin: FetchAdminUseCase) {}

  @Get(':cpf')
  @HttpCode(200)
  @Roles('ADMIN')
  async handle(@Param('cpf') cpf: string) {
    const result = await this.fetchAdmin.execute({ cpf });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AdminNotFoundError:
          throw new NotFoundException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const { admin } = result.value;

    return {
      admin: AdminPresenter.toHTTP(admin),
    };
  }
}
