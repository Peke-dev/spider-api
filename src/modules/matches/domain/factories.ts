import { Match, MatchLeague } from './entities';

export function createMatchLeagueFromMatchListFactory(matches: Match[]) {
  const leagues: MatchLeague[] = [];

  for (const match of matches) {
    const { league } = match;

    const isLeagueExists = leagues.findIndex((l) => l.id === league.id);

    if (isLeagueExists === -1) {
      leagues.push({
        ...league,
        matches: [match],
      });

      continue;
    }

    leagues[isLeagueExists].matches?.push(match);

    continue;
  }

  return leagues;
}
