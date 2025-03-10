import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { JwtAuthGuard } from '@modules/auth/infrastructure';
import { Account } from '../../domain/entities';
import {
  FindAccountByIdUseCase,
  FindAllAccountsUseCase,
} from '../../application/use-cases';

@Controller('accounts')
@UseInterceptors(ClassSerializerInterceptor)
export class AccountQueryController {
  constructor(
    private readonly findAccountByIdUseCase: FindAccountByIdUseCase,
    private readonly findAllAccountsUseCase: FindAllAccountsUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Account[]> {
    return this.findAllAccountsUseCase.execute();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Account> {
    const account = await this.findAccountByIdUseCase.execute(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }
}
