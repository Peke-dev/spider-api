import { Account } from '@modules/accounts';
import { RepositoryInterface } from '@modules/database';

import { AccountRepositoryInterface } from '../../domain/repositories/account.repository.interface';

export class AccountRepository implements AccountRepositoryInterface {
  constructor(private readonly repository: RepositoryInterface<Account>) {}

  findByEmail(email: string): Promise<Account | null> {
    return this.repository.findOneBy('email', email);
  }
}
