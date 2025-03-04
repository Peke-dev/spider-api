import { Inject, Injectable } from '@nestjs/common';

import { RepositoryInterface } from '@modules/database';

import { Account } from '../entities/account.entity';
import { ACCOUNTS_COLLECTION } from '../constants';

@Injectable()
export class FindAllAccountsService {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  run(): Promise<Account[]> {
    return this.accountsRepository.findAll();
  }
}
