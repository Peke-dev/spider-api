import { Account } from '@modules/accounts';
import { RepositoryInterface } from '@modules/database';

import { AccountRepository } from '@modules/auth/infrastructure';

describe('AccountRepository', () => {
  let repository: AccountRepository;

  const mockFirebaseRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(() => {
    repository = new AccountRepository(
      mockFirebaseRepository as unknown as RepositoryInterface<Account>,
    );
  });

  describe('when findByEmail method is called', () => {
    const mockEmail = 'test@example.com';
    const mockAccount: Account = {
      id: 'account123',
      email: mockEmail,
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return account when found', async () => {
      mockFirebaseRepository.findOneBy.mockResolvedValue(mockAccount);

      const result = await repository.findByEmail(mockEmail);

      expect(result).toEqual(mockAccount);
      expect(mockFirebaseRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        mockEmail,
      );
    });

    it('should return null when account not found', async () => {
      mockFirebaseRepository.findOneBy.mockResolvedValue(null);

      const result = await repository.findByEmail(mockEmail);

      expect(result).toBeNull();
      expect(mockFirebaseRepository.findOneBy).toHaveBeenCalledWith(
        'email',
        mockEmail,
      );
    });
  });
});
