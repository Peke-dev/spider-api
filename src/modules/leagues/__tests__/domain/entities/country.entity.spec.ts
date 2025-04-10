import { Country } from '../../../domain/entities/country.entity';

describe('Country Entity', () => {
  it('should create a country with all properties', () => {
    const country = new Country({
      name: 'England',
      code: 'GB',
      flag: 'https://media.api-sports.io/flags/gb.svg',
    });

    expect(country.name).toBe('England');
    expect(country.code).toBe('GB');
    expect(country.flag).toBe('https://media.api-sports.io/flags/gb.svg');
  });

  it('should create a country with only required properties', () => {
    const country = new Country({
      name: 'England',
    });

    expect(country.name).toBe('England');
    expect(country.code).toBeNull();
    expect(country.flag).toBeNull();
  });

  it('should throw an error when name is not provided', () => {
    expect(() => new Country({})).toThrow('Name is required');
  });

  it('should return correct JSON representation', () => {
    const country = new Country({
      name: 'England',
      code: 'GB',
      flag: 'https://media.api-sports.io/flags/gb.svg',
    });

    expect(country.toJSON()).toEqual({
      name: 'England',
      code: 'GB',
      flag: 'https://media.api-sports.io/flags/gb.svg',
    });
  });
});
