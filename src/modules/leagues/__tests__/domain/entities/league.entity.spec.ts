import { League } from '@modules/leagues/domain/entities';
import {
  LeagueStatusEnum,
  LeagueTypeEnum,
} from '@modules/leagues/domain/enums';
import {
  createMockLeague,
  mockLeague,
  createMockLeagues,
} from '../../__mocks__/league.mock';
import { createMockCountry } from '../../__mocks__/country.mock';
import { createMockSeasons } from '../../__mocks__/season.mock';

describe('League Entity', () => {
  let league: League;

  beforeEach(() => {
    league = mockLeague;
  });

  it('should be defined', () => {
    expect(league).toBeDefined();
  });

  describe('constructor', () => {
    it('should create a league with default values when no id is provided', () => {
      const newLeague = createMockLeague();
      expect(newLeague.id).toBeDefined();
      expect(newLeague.status).toBe(LeagueStatusEnum.ENABLED);
    });

    it('should use provided id when available', () => {
      const customId = 'custom-id';
      const newLeague = createMockLeague({ id: customId });
      expect(newLeague.id).toBe(customId);
    });

    it('should set all properties correctly', () => {
      const mockData = {
        name: 'Test League',
        type: LeagueTypeEnum.CUP,
        status: LeagueStatusEnum.DISABLED,
        logo: 'https://test.com/logo.png',
        country: createMockCountry({ name: 'Test Country' }),
        seasons: createMockSeasons(3),
      };
      const newLeague = createMockLeague(mockData);

      expect(newLeague.name).toBe(mockData.name);
      expect(newLeague.type).toBe(mockData.type);
      expect(newLeague.status).toBe(mockData.status);
      expect(newLeague.logo).toBe(mockData.logo);
      expect(newLeague.country).toBe(mockData.country);
      expect(newLeague.seasons).toEqual(mockData.seasons);
    });

    it('should handle multiple leagues with different properties', () => {
      const leagues = createMockLeagues(3);

      expect(leagues).toHaveLength(3);
      expect(leagues[0].status).toBe(LeagueStatusEnum.ENABLED);
      expect(leagues[1].status).toBe(LeagueStatusEnum.DISABLED);
      expect(leagues[2].status).toBe(LeagueStatusEnum.ENABLED);

      expect(leagues[0].type).toBe(LeagueTypeEnum.LEAGUE);
      expect(leagues[1].type).toBe(LeagueTypeEnum.CUP);
      expect(leagues[2].type).toBe(LeagueTypeEnum.LEAGUE);
    });
  });

  describe('required properties', () => {
    it('should have required properties', () => {
      expect(league.name).toBeDefined();
      expect(league.country).toBeDefined();
      expect(league.seasons).toBeDefined();
      expect(league.type).toBeDefined();
    });

    it('should have optional properties', () => {
      expect(league.id).toBeDefined();
      expect(league.logo).toBeDefined();
      expect(league.status).toBeDefined();
      expect(league.createdAt).toBeDefined();
      expect(league.updatedAt).toBeDefined();
    });
  });

  describe('default values', () => {
    it('should set default status to ENABLED', () => {
      const newLeague = new League({
        name: 'Test League',
        country: createMockCountry(),
        seasons: createMockSeasons(1),
        type: LeagueTypeEnum.LEAGUE,
      });
      expect(newLeague.status).toBe(LeagueStatusEnum.ENABLED);
    });

    it('should set default logo to null', () => {
      const newLeague = new League({
        name: 'Test League',
        country: createMockCountry(),
        seasons: createMockSeasons(1),
        type: LeagueTypeEnum.LEAGUE,
      });
      expect(newLeague.logo).toBeNull();
    });
  });

  describe('dates', () => {
    it('should set createdAt and updatedAt when not provided', () => {
      const newLeague = createMockLeague();
      expect(newLeague.createdAt).toBeInstanceOf(Date);
      expect(newLeague.updatedAt).toBeInstanceOf(Date);
    });

    it('should use provided dates when available', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const newLeague = createMockLeague({ createdAt, updatedAt });
      expect(newLeague.createdAt).toBe(createdAt);
      expect(newLeague.updatedAt).toBe(updatedAt);
    });

    it('should set same date for createdAt and updatedAt when not provided', () => {
      const newLeague = createMockLeague();
      expect(newLeague.createdAt).toEqual(newLeague.updatedAt);
    });
  });

  describe('data types', () => {
    it('should have correct data types', () => {
      expect(typeof league.id).toBe('string');
      expect(league.country).toBeInstanceOf(Object);
      expect(Array.isArray(league.seasons)).toBe(true);
      expect(typeof league.name).toBe('string');
      expect(typeof league.logo).toBe('object');
      expect(Object.values(LeagueTypeEnum)).toContain(league.type);
      expect(Object.values(LeagueStatusEnum)).toContain(league.status);
      expect(league.createdAt).toBeInstanceOf(Date);
      expect(league.updatedAt).toBeInstanceOf(Date);
    });
  });
});
