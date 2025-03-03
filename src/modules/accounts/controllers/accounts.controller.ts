import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  FindAllAccountsService,
  FindAccountByIdService,
  CreateAccountService,
} from '../services/';
import { Account } from '../entities';
import { CreateAccountDto } from '../dto';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly findAccountByIdService: FindAccountByIdService,
    private readonly findAllAccountsService: FindAllAccountsService,
    private readonly createAccountService: CreateAccountService,
  ) {}

  @Get()
  findAll(): Promise<Account[]> {
    return this.findAllAccountsService.run();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Account> {
    const account = await this.findAccountByIdService.run(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<string> {
    return this.createAccountService.run(createAccountDto);
  }
}
