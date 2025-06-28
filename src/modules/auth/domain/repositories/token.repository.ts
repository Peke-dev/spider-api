import { Token } from '../entities';

export abstract class TokenRepository {
  abstract findById(id: string): Promise<Token | null>;
  abstract create(token: Omit<Token, 'id'>): Promise<Token>;
  abstract findAll(): Promise<Token[]>;
}
