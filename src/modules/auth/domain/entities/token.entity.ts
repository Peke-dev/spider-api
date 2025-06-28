import { Scopes } from '../enums';

export class Token {
  constructor(
    public readonly id: string,
    public readonly accountName: string,
    public readonly isValid: boolean,
    public readonly scopes: Scopes[],
    public readonly createdAt: Date,
  ) {}
}
