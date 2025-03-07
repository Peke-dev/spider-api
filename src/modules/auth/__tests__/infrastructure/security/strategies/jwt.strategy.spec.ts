import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '@modules/auth/infrastructure';

import { AccountRepository } from '@modules/auth/infrastructure';
import { AUTH_MODULE_OPTIONS } from '@modules/auth/constants';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockAccountRepository = {
    findByEmail: jest.fn(),
  };

  const mockAuthModuleOptions = {
    secret: 'test-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AccountRepository,
          useValue: mockAccountRepository,
        },
        {
          provide: AUTH_MODULE_OPTIONS,
          useValue: mockAuthModuleOptions,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when validate method is called', () => {
    const mockJwtPayload = {
      sub: 'user123',
      email: 'test@example.com',
    };

    mockAccountRepository.findByEmail.mockResolvedValue({
      id: mockJwtPayload.sub,
      email: mockJwtPayload.email,
    });

    it('should return user data when token is valid', async () => {
      const result = await strategy.validate(mockJwtPayload);

      expect(result).toEqual({
        id: mockJwtPayload.sub,
        email: mockJwtPayload.email,
      });
    });
  });
});
