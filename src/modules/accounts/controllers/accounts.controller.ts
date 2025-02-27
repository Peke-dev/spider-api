import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import { FindAllAccountsService, FindAccountByIdService } from '../services/';
import { Account } from '../entities';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly findAccountByIdService: FindAccountByIdService,
    private readonly findAllAccountsService: FindAllAccountsService,
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
}
