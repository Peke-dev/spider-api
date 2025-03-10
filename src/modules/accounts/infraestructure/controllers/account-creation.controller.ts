import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { CreateAccountDto } from '../../infraestructure/dto';
import { CreateAccountUseCase } from '../../application/use-cases';

@Controller('accounts')
@UseInterceptors(ClassSerializerInterceptor)
export class AccountCreationController {
  constructor(private readonly createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<{ id: string }> {
    const id = await this.createAccountUseCase.execute(createAccountDto);
    return { id };
  }
}
