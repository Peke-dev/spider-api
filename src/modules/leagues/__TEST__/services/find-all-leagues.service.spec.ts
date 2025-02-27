import { Test, TestingModule } from '@nestjs/testing';

import { League, LEAGUES_COLLECTION } from '@modules/leagues';
import { repositoryMock } from '@modules/database/__TEST__/__MOCK__';

import { FindAllLeaguesService } from '../../services';

describe('FindAllLeaguesService', () => {
  let service: FindAllLeaguesService;

  const leagueRepositoryMock = repositoryMock;

  const mockLeagues = [
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
        FindAllLeaguesService,
        {
          provide: LEAGUES_COLLECTION,
          useValue: leagueRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(FindAllLeaguesService);
  });

  describe('When run method is called', () => {
    let result: League[];

    beforeAll(async () => {
      leagueRepositoryMock.findAll.mockResolvedValueOnce(mockLeagues);
      result = await service.run();
    });

    it('should return a league when found', () => {
      expect(result).toEqual(mockLeagues);
    });

    it('should call the repository', () => {
      expect(leagueRepositoryMock.findAll).toHaveBeenCalled();
    });
  });

  describe('When run method is called without any Leagues', () => {
    it('should return an empty array', async () => {
      leagueRepositoryMock.findAll.mockResolvedValueOnce([]);

      const result = await service.run();

      expect(result.length).toBe(0);
    });
  });
});
