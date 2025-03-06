import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { JwtAuthGuard } from '@modules/auth';

import { Account } from '../../domain/entities';
import { CreateAccountDto } from '../../infraestructure/dto';
import {
  CreateAccountUseCase,
  FindAccountByIdUseCase,
  FindAllAccountsUseCase,
} from '../../application/use-cases';

@Controller('accounts')
@UseInterceptors(ClassSerializerInterceptor)
export class AccountsController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
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

  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<{ id: string }> {
    const id = await this.createAccountUseCase.execute(createAccountDto);
    return { id };
  }
}
