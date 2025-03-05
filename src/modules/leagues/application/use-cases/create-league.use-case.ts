import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { RepositoryInterface } from '@modules/database';
import { League } from '../../domain/entities';
import { LEAGUES_COLLECTION } from '../../constants';
import { v4 as uuidv4 } from 'uuid';

interface CreateLeagueDTO {
  name: string;
  country: string;
  logo: string;
  type: string;
  round: string;
  seasons: {
    year: number;
    start: string;
    end: string;
    current: boolean;
  }[];
}

@Injectable()
export class CreateLeagueUseCase {
  constructor(
    @Inject(LEAGUES_COLLECTION)
    private readonly repository: RepositoryInterface<League>,
  ) {}

  async execute(data: CreateLeagueDTO): Promise<string> {
    const league = new League({
      id: uuidv4(),
      name: data.name,
      country: {
        name: data.country,
        code: null,
        flag: null,
      },
      logo: data.logo,
      type: data.type,
      round: data.round,
      seasons: data.seasons,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.create(league);
  }
}
