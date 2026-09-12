import { Show } from '../models/Show';

export const hasAvailableEpisodes = (
  show: Show,
  watchedEpisodeKeys: Set<string>,
  today = new Date()
): boolean =>
  show.all_seasons
    .filter((season) => season.number > 0)
    .some((season) =>
      season.episodes.some(
        (episode) =>
          (!episode.first_aired ||
            new Date(episode.first_aired).getTime() <= today.getTime()) &&
          !watchedEpisodeKeys.has(`${episode.season}:${episode.number}`)
      )
    );