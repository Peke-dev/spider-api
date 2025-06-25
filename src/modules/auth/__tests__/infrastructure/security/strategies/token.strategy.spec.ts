import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { TokenStrategy } from '@modules/auth/infrastructure';

describe('TokenStrategy', () => {
  let strategy: TokenStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<TokenStrategy>(TokenStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return true when token is valid', () => {
      const validToken = 'valid-token-123';
      const authTokens = 'valid-token-123,another-token,third-token';

      mockConfigService.get.mockReturnValue(authTokens);

      const result = strategy.validate(validToken);

      expect(result).toBe(true);
      expect(configService.get).toHaveBeenCalledWith('AUTH_TOKENS');
    });

    it('should return true when token is valid with semicolon separator', () => {
      const validToken = 'valid-token-123';
      const authTokens = 'valid-token-123;another-token;third-token';

      mockConfigService.get.mockReturnValue(authTokens);

      const result = strategy.validate(validToken);

      expect(result).toBe(true);
      expect(configService.get).toHaveBeenCalledWith('AUTH_TOKENS');
    });

    it('should throw UnauthorizedException when AUTH_TOKENS is not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(() => strategy.validate('any-token')).toThrow(
        UnauthorizedException,
      );
      expect(() => strategy.validate('any-token')).toThrow(
        'AUTH_TOKENS not configured',
      );
    });

    it('should throw UnauthorizedException when AUTH_TOKENS is empty string', () => {
      mockConfigService.get.mockReturnValue('');

      expect(() => strategy.validate('any-token')).toThrow(
        UnauthorizedException,
      );
      expect(() => strategy.validate('any-token')).toThrow(
        'AUTH_TOKENS not configured',
      );
    });

    it('should throw UnauthorizedException when no valid tokens are configured', () => {
      mockConfigService.get.mockReturnValue(',,;  ;');

      expect(() => strategy.validate('any-token')).toThrow(
        UnauthorizedException,
      );
      expect(() => strategy.validate('any-token')).toThrow(
        'No valid tokens configured',
      );
    });

    it('should throw UnauthorizedException when token is not in the list', () => {
      const invalidToken = 'invalid-token';
      const authTokens = 'valid-token-123,another-token,third-token';

      mockConfigService.get.mockReturnValue(authTokens);

      expect(() => strategy.validate(invalidToken)).toThrow(
        UnauthorizedException,
      );
      expect(() => strategy.validate(invalidToken)).toThrow('Invalid token');
    });

    it('should handle tokens with spaces correctly', () => {
      const validToken = 'valid-token-123';
      const authTokens = ' valid-token-123 , another-token , third-token ';

      mockConfigService.get.mockReturnValue(authTokens);

      const result = strategy.validate(validToken);

      expect(result).toBe(true);
    });
  });
});
