import { Inject, Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { RepositoryInterface } from '@modules/database';
import { ACCOUNTS_COLLECTION } from '../constants';
import { Account } from '../entities/account.entity';
import { CreateAccountDto } from '../dto';

@Injectable()
export class CreateAccountService {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  async run(account: CreateAccountDto): Promise<string> {
    const existingAccount = await this.accountsRepository.findOneBy(
      'email',
      account.email,
    );

    if (existingAccount) {
      throw new ConflictException(
        `Account with email ${account.email} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);
    return this.accountsRepository.create({
      ...account,
      id: uuidv4(),
      password: hashedPassword,
    });
  }
}
