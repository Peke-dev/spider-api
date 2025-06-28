import { SetMetadata } from '@nestjs/common';
import { Scopes } from '../../domain/enums';

export const REQUIRED_SCOPES_KEY = 'requiredScopes';
export const RequiredScopes = (...scopes: Scopes[]) =>
  SetMetadata(REQUIRED_SCOPES_KEY, scopes);
