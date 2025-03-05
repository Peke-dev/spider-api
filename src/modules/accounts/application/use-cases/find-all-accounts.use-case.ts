import { Inject, Injectable } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';

import { ACCOUNTS_COLLECTION } from '../../constants';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class FindAllAccountsUseCase {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  async execute(): Promise<Account[]> {
    return this.accountsRepository.findAll();
  }
}
