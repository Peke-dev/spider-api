import { League } from '@modules/leagues/domain/entities';
import {
  LeagueStatusEnum,
  LeagueTypeEnum,
} from '@modules/leagues/domain/enums';
import { createMockCountry, mockCountry } from './country.mock';
import { createMockSeasons, mockSeason } from './season.mock';

export interface LeagueMockData {
  id?: string;
  name?: string;
  country?: any;
  seasons?: any[];
  type?: LeagueTypeEnum;
  logo?: string | null;
  status?: LeagueStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createMockLeague = (data: LeagueMockData = {}): League => {
  return new League({
    name: data.name ?? 'Premier League',
    country: data.country ?? mockCountry,
    seasons: data.seasons ?? [mockSeason],
    type: data.type ?? LeagueTypeEnum.LEAGUE,
    logo: data.logo ?? 'https://example.com/logo.png',
    status: data.status ?? LeagueStatusEnum.ENABLED,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
    ...data,
  });
};

export const mockLeague = createMockLeague();

export const createMockLeagues = (count: number): League[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockLeague({
      id: `league-${index + 1}`,
      name: `League ${index + 1}`,
      country: createMockCountry({ name: `Country ${index + 1}` }),
      seasons: createMockSeasons(2),
      logo: `https://example.com/logo${index + 1}.png`,
      status:
        index % 2 === 0 ? LeagueStatusEnum.ENABLED : LeagueStatusEnum.DISABLED,
      type: index % 2 === 0 ? LeagueTypeEnum.LEAGUE : LeagueTypeEnum.CUP,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  );
};
