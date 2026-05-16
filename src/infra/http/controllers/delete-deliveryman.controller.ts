import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { DeleteDeliverymanUseCase } from '@/domain/application/use-cases/delete-deliveryman';

@Controller('/deliveryman')
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Delete(':cpf')
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(@Param('cpf') cpf: string) {
    const result = await this.deleteDeliveryman.execute({ cpf });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    return {};
  }
}
