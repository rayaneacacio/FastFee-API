import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { DeleteAdminUseCase } from '@/domain/application/use-cases/delete-admin';

@Controller('/admin')
export class DeleteAdminController {
  constructor(private deleteAdmin: DeleteAdminUseCase) {}

  @Delete(':cpf')
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(@Param('cpf') cpf: string) {
    const result = await this.deleteAdmin.execute({ cpf });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    return {};
  }
}
