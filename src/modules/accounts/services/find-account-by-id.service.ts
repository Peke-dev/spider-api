import { Injectable, Inject } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { Account } from '../entities/account.entity';
import { ACCOUNTS_COLLECTION } from '../constants';

@Injectable()
export class FindAccountByIdService {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  run(id: string): Promise<Account | null> {
    return this.accountsRepository.findOneById(id);
  }
}
