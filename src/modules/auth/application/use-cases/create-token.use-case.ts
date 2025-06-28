import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../../domain/repositories';
import { Token } from '../../domain/entities';
import { CreateTokenDto } from '../dtos';

@Injectable()
export class CreateTokenUseCase {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(createTokenDto: CreateTokenDto): Promise<Token> {
    const { accountName, scopes } = createTokenDto;

    const token = await this.tokenRepository.create({
      accountName,
      isValid: true,
      scopes,
      createdAt: new Date(),
    });

    return token;
  }
}
