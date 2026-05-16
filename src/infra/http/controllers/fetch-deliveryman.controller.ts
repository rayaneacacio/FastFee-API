import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { FetchDeliverymanUseCase } from '@/domain/application/use-cases/fetch-deliveryman';
import { DeliveryManAlreadyExistsError } from '@/domain/application/use-cases/errors/delivery-man-already-exists';

@Controller('/deliveryman/details')
export class FetchDeliverymanController {
  constructor(private fetchDeliveryman: FetchDeliverymanUseCase) {}

  @Get(':cpf')
  @HttpCode(200)
  @Roles('ADMIN')
  async handle(@Param('cpf') cpf: string) {
    const result = await this.fetchDeliveryman.execute({ cpf });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeliveryManAlreadyExistsError:
          throw new NotFoundException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const { deliveryman } = result.value;

    return {
      deliveryman,
    };
  }
}
