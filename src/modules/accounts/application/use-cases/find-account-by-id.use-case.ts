import { Inject, Injectable } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';

import { ACCOUNTS_COLLECTION } from '../../constants';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class FindAccountByIdUseCase {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  async execute(id: string): Promise<Account | null> {
    return this.accountsRepository.findOneById(id);
  }
}
