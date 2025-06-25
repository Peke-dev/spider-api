import { Test, TestingModule } from '@nestjs/testing';
import { TokenAuthGuard } from '@modules/auth/infrastructure';

describe('TokenAuthGuard', () => {
  let guard: TokenAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenAuthGuard],
    }).compile();

    guard = module.get<TokenAuthGuard>(TokenAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
