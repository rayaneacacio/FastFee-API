import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { FetchRecipientUseCase } from '@/domain/application/use-cases/fetch-recipient';
import { RecipientNotFoundError } from '@/domain/application/use-cases/errors/recipient-not-found-error';
import { RecipientPresenter } from '../presenters/recipient-presenter';

@Controller('/recipient/details')
export class FetchRecipientController {
  constructor(private fetchRecipient: FetchRecipientUseCase) {}

  @Get(':email')
  @HttpCode(200)
  @Roles('ADMIN')
  async handle(@Param('email') email: string) {
    const result = await this.fetchRecipient.execute({ email });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new NotFoundException(error.message);

        default:
          throw new BadRequestException(error.message);
      }
    }

    const { recipient } = result.value;

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    };
  }
}
