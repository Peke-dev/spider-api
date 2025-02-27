import { Test, TestingModule } from '@nestjs/testing';

import { League, LEAGUES_COLLECTION } from '@modules/leagues';
import { repositoryMock } from '@modules/database/__TEST__/__MOCK__';

import { FindLeagueByIdService } from '../../services';

describe('FindLeagueByIdService', () => {
  let service: FindLeagueByIdService;

  const leagueRepositoryMock = repositoryMock;

  const mockLeague = {
    id: '1',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindLeagueByIdService,
        {
          provide: LEAGUES_COLLECTION,
          useValue: leagueRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(FindLeagueByIdService);
  });

  describe('When run method is called a valid league id', () => {
    let result: League | null;

    beforeAll(async () => {
      leagueRepositoryMock.findOneById.mockResolvedValueOnce(mockLeague);
      result = await service.run('1');
    });

    it('should return a league when found', () => {
      expect(result).toEqual(mockLeague);
    });

    it('should call the repository with the correct id', () => {
      expect(leagueRepositoryMock.findOneById).toHaveBeenCalledWith('1');
    });
  });

  describe('When run method is called a invalid league id', () => {
    it('should return null when league not found', async () => {
      leagueRepositoryMock.findOneById.mockResolvedValueOnce(null);

      const result = await service.run('1');

      expect(result).toBeNull();
    });
  });
});
