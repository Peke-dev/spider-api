import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RepositoryInterface } from '@modules/database';

import { ACCOUNTS_COLLECTION } from '../../constants';
import { Account } from '../../domain/entities/account.entity';
import { CreateAccountDto } from '../../infraestructure/dto';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNTS_COLLECTION)
    private readonly accountsRepository: RepositoryInterface<Account>,
  ) {}

  async execute(createAccountDto: CreateAccountDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(createAccountDto.password, 10);

    const account = new Account({
      id: uuidv4(),
      email: createAccountDto.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.accountsRepository.create(account);
  }
}
