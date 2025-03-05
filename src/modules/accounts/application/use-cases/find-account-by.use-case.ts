import { Inject, Injectable } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { ACCOUNTS_COLLECTION } from '../../constants';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class FindAccountByUseCase {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  async execute(key: string, value: any): Promise<Account | null> {
    return this.accountsRepository.findOneBy(key, value);
  }
}
