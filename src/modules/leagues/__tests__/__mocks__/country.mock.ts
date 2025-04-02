import { Country } from '@modules/leagues/domain/entities';

export interface CountryMockData {
  name?: string;
  code?: string | null;
  flag?: string | null;
}

export const createMockCountry = (data: CountryMockData = {}): Country => {
  return new Country({
    name: data.name ?? 'England',
    code: data.code ?? 'GB',
    flag: data.flag ?? 'https://example.com/flag.png',
  });
};

export const mockCountry = createMockCountry();

export const createMockCountries = (count: number): Country[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockCountry({
      name: `Country ${index + 1}`,
      code: `C${index + 1}`,
      flag: `https://example.com/flag${index + 1}.png`,
    }),
  );
};
