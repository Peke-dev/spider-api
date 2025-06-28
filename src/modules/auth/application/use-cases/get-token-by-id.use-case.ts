import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenRepository } from '../../domain/repositories';
import { Token } from '../../domain/entities';

@Injectable()
export class GetTokenByIdUseCase {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(id: string): Promise<Token> {
    const token = await this.tokenRepository.findById(id);

    if (!token) {
      throw new NotFoundException(`Token with ID ${id} not found`);
    }

    return token;
  }
}
