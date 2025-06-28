import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Scopes } from '../../../domain/enums';
import { REQUIRED_SCOPES_KEY } from '../../decorators';

@Injectable()
export class ScopesAuthGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<Scopes[]>(
      REQUIRED_SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no scopes are required, allow access
    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.user?.token;

    if (!token) {
      throw new UnauthorizedException('Token not found in request');
    }

    if (!token.isValid) {
      throw new UnauthorizedException('Token is not valid');
    }

    // Check if token has ALL scope - if so, grant access immediately
    if (token.scopes.includes(Scopes.ALL)) {
      return true;
    }

    // Check if token has all required scopes
    const hasAllRequiredScopes = requiredScopes.every((requiredScope) =>
      token.scopes.includes(requiredScope),
    );

    if (!hasAllRequiredScopes) {
      throw new ForbiddenException(`Insufficient scopes.`);
    }

    return true;
  }
}
