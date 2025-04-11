import { Firestore } from 'firebase-admin/firestore';

import { FirestoreRepository as BaseRepository } from '@infrastructure/repositories';

import { League, Country, Season } from '../../domain/entities';

export class LeagueRepository extends BaseRepository<League> {
  constructor(
    private readonly firestore: Firestore,
    private readonly collection: string,
  ) {
    const collectionRef = firestore.collection(collection);
    super(collectionRef);
  }

  toDomain(league: any): League {
    return new League({
      id: league.id,
      name: league.name,
      logo: league.logo,
      type: league.type,
      country: new Country(league.country),
      seasons: league.seasons.map((season: any) => new Season(season)),
      createdAt: league.createdAt.toDate(),
      updatedAt: league.updatedAt.toDate(),
    });
  }
}
