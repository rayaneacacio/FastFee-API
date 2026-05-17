import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { DeleteRecipientUseCase } from '@/domain/application/use-cases/delete-recipient';

@Controller('/recipient')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete(':email')
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(@Param('email') email: string) {
    const result = await this.deleteRecipient.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    return {};
  }
}
