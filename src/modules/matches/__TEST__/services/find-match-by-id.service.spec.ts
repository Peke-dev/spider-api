import { Test, TestingModule } from '@nestjs/testing';

import { Match, MATCHES_COLLECTION } from '@modules/matches';
import { repositoryMock } from '@modules/database/__TEST__/__MOCK__';

import { FindMatchByIdService } from '../../services';

describe('FindMatchByIdService', () => {
  let service: FindMatchByIdService;

  const matchRepositoryMock = repositoryMock;

  const mockMatch = {
    id: '1',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMatchByIdService,
        {
          provide: MATCHES_COLLECTION,
          useValue: matchRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(FindMatchByIdService);
  });

  describe('When run method is called a valid match id', () => {
    let result: Match | null;

    beforeAll(async () => {
      matchRepositoryMock.findOneById.mockResolvedValueOnce(mockMatch);
      result = await service.run('1');
    });

    it('should return a match when found', async () => {
      expect(result).toEqual(mockMatch);
    });

    it('should call the repository with the correct id', async () => {
      expect(matchRepositoryMock.findOneById).toHaveBeenCalledWith('1');
    });
  });

  describe('When run method is called a invalid match id', () => {
    it('should return null when match not found', async () => {
      matchRepositoryMock.findOneById.mockResolvedValueOnce(null);

      const result = await service.run('1');

      expect(result).toBeNull();
    });
  });
});
