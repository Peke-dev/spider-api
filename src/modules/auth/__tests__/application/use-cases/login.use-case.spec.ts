import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto, LoginUseCase } from '@modules/auth/application';
import { AccountRepository } from '@modules/auth/infrastructure';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const mockAccountRepository = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: AccountRepository,
          useValue: mockAccountRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when execute methods id called', () => {
    const mockLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAccount = {
      id: 'account123',
      email: 'test@example.com',
      password: 'hashedPassword123',
    };

    const mockToken = 'jwt.token.here';

    it('should successfully login and return access token', async () => {
      mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await useCase.execute(mockLoginDto);

      expect(result).toEqual({ access_token: mockToken });

      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockAccount.password,
      );

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockAccount.id,
        email: mockAccount.email,
      });
    });

    it('should throw UnauthorizedException when account not found', async () => {
      mockAccountRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockAccountRepository.findByEmail.mockResolvedValue(mockAccount);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(useCase.execute(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAccountRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockLoginDto.password,
        mockAccount.password,
      );

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
