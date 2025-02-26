import { Test, TestingModule } from '@nestjs/testing';

import { Match, MATCHES_COLLECTION } from '@modules/matches';
import { repositoryMock } from '@modules/database/__TEST__/__MOCK__';

import { FindAllMatchesService } from '../../services';

describe('FindAllMatchesService', () => {
  let service: FindAllMatchesService;

  const matchRepositoryMock = repositoryMock;

  const mockMatches = [
    {
      id: '1',
    },
    {
      id: '2',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllMatchesService,
        {
          provide: MATCHES_COLLECTION,
          useValue: matchRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(FindAllMatchesService);
  });

  describe('When run method is called', () => {
    let result: Match[];

    beforeAll(async () => {
      matchRepositoryMock.findAll.mockResolvedValueOnce(mockMatches);
      result = await service.run();
    });

    it('should return a match when found', () => {
      expect(result).toEqual(mockMatches);
    });

    it('should call the repository', () => {
      expect(matchRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('When run method is called without any matches', () => {
    it('should return an empty array', async () => {
      matchRepositoryMock.findAll.mockResolvedValueOnce([]);

      const result = await service.run();

      expect(result.length).toBe(0);
    });
  });
});
