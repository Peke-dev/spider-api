import { validate } from 'class-validator';
import { League } from '@modules/leagues/domain/entities';
import {
  LeagueStatusEnum,
  LeagueTypeEnum,
} from '@modules/leagues/domain/enums';
import { createMockLeague, mockLeague } from '../../__mocks__/league.mock';

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
      };
      const newLeague = createMockLeague(mockData);

      expect(newLeague.name).toBe(mockData.name);
      expect(newLeague.type).toBe(mockData.type);
      expect(newLeague.status).toBe(mockData.status);
      expect(newLeague.logo).toBe(mockData.logo);
    });
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const errors = await validate(league);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when name is empty', async () => {
      const invalidLeague = createMockLeague({ name: '' });
      const errors = await validate(invalidLeague);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('name');
    });

    it('should fail validation when type is invalid', async () => {
      const invalidLeague = createMockLeague({
        type: 'INVALID_TYPE' as LeagueTypeEnum,
      });
      const errors = await validate(invalidLeague);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('type');
    });

    it('should fail validation when status is invalid', async () => {
      const invalidLeague = createMockLeague({
        status: 'INVALID_STATUS' as LeagueStatusEnum,
      });
      const errors = await validate(invalidLeague);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('status');
    });

    it('should fail validation when country is missing', async () => {
      const invalidLeague = createMockLeague({ country: undefined });
      const errors = await validate(invalidLeague);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('country');
    });

    it('should fail validation when seasons array is empty', async () => {
      const invalidLeague = createMockLeague({ seasons: [] });
      const errors = await validate(invalidLeague);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('seasons');
    });
  });

  describe('default values', () => {
    it('should set default status to ENABLED when not provided', () => {
      const newLeague = createMockLeague({ status: undefined });
      expect(newLeague.status).toBe(LeagueStatusEnum.ENABLED);
    });

    it('should set default logo to null when not provided', () => {
      const newLeague = createMockLeague({ logo: undefined });
      expect(newLeague.logo).toBeNull();
    });
  });
});
