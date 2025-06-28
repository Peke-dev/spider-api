import { Injectable } from '@nestjs/common';
import { TokenRepository } from '../../domain/repositories';
import { Token } from '../../domain/entities';

@Injectable()
export class GetAllTokensUseCase {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(): Promise<Token[]> {
    return this.tokenRepository.findAll();
  }
}
