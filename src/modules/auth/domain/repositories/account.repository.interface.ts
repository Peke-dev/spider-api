import { Account } from '@modules/accounts';

export interface AccountRepositoryInterface {
  findByEmail(email: string): Promise<Account | null>;
}
