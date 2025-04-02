import { Season } from '@modules/leagues/domain/entities';

export interface SeasonMockData {
  year?: number;
  start?: string;
  end?: string;
  current?: boolean;
}

export const createMockSeason = (data: SeasonMockData = {}): Season => {
  return new Season({
    year: data.year ?? 2024,
    start: data.start ?? '2024-08-01',
    end: data.end ?? '2025-05-31',
    current: data.current ?? true,
  });
};

export const mockSeason = createMockSeason();

export const createMockSeasons = (count: number): Season[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockSeason({
      year: 2024 + index,
      start: `2024-08-${index + 1}`,
      end: `2025-05-${index + 1}`,
      current: index === 0,
    }),
  );
};
