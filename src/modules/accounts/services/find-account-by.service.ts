import { Inject, Injectable } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';

import { ACCOUNTS_COLLECTION } from '../constants';
import { Account } from '../entities';

@Injectable()
export class FindAccountByService {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  async run(key: string, value: any): Promise<Account | null> {
    return this.accountsRepository.findOneBy(key, value);
  }
}
