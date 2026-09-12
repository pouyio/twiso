import React, { useState } from 'react';
import ImageLink from '../../components/ImageLink';
import PaginationContainer from '../../components/Pagination/PaginationContainer';
import { usePagination } from '../../hooks/usePagination';
import { EmptyState } from '../../components/EmptyState';
import { NoResults } from '../../components/NoResults';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSearchParams } from 'react-router';
import db, { DETAIL_SHOWS_TABLE, USER_SHOWS_TABLE } from '../../utils/db';
import { Show } from '../../models/Show';
import { hasAvailableEpisodes } from '../../utils/showAvailability';

const ShowsWatched: React.FC = () => {
  const [genres, setGenres] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const [hideFinished, setHideFinished] = useState(
    () => searchParams.get('showFinished') !== '1'
  );

  const orderedUserShows = useLiveQuery(
    () =>
      db[USER_SHOWS_TABLE].where('status')
        .equals('watched')
        .reverse()
        .sortBy('created_at'),
    [],
    []
  );

  const fullShows = useLiveQuery(
    () =>
      db[DETAIL_SHOWS_TABLE].where('ids.tmdb')
        .anyOf(
          orderedUserShows.filter((s) => !s.hidden).map((us) => us.show_tmdb)
        )
        .and((show) => genres.every((g) => show.genres.includes(g)))
        .toArray(),
    [genres, orderedUserShows],
    []
  );

  const orderedShows: Show[] = orderedUserShows
    .map((m) => fullShows.find((fm) => fm.ids.tmdb === m.show_tmdb))
    .filter(Boolean) as Show[];

  const watchedEpisodesByShow = new Map<number, Set<string>>();
  orderedUserShows.forEach((ous) => {
    watchedEpisodesByShow.set(
      ous.show_tmdb,
      new Set(
        ous.episodes?.map((e) => `${e.season_number}:${e.episode_number}`) ?? []
      )
    );
  });

  const hasAvailable = (show: Show) =>
    hasAvailableEpisodes(
      show,
      watchedEpisodesByShow.get(show.ids.tmdb) ?? new Set<string>()
    );

  const visibleShows = hideFinished
    ? orderedShows.filter((s) => hasAvailable(s))
    : orderedShows;

  const { getItemsByPage } = usePagination(visibleShows);

  const isHidden = (id: number) => {
    return orderedUserShows.find((ous) => ous.show_tmdb === id)?.hidden;
  };

  return !genres.length && !hideFinished && !orderedShows.length ? (
    <EmptyState />
  ) : (
    <PaginationContainer
      items={visibleShows}
      onFilter={setGenres}
      onHideFinishedToggle={setHideFinished}
    >
      {!visibleShows.length ? (
        <NoResults />
      ) : (
        <ul className="flex flex-wrap p-2 items-stretch justify-center select-none">
          {getItemsByPage().map((m) => (
            <li
              key={m.ids.tmdb}
              className="p-2"
              style={{ flex: '1 0 50%', maxWidth: '10em' }}
            >
              <ImageLink
                ids={m.ids}
                text={m.title}
                style={{ minHeight: '13.5em' }}
                type="show"
                forceState="watched"
                hidden={isHidden(m.ids.tmdb)}
                dimmed={!hasAvailable(m)}
              />
            </li>
          ))}
        </ul>
      )}
    </PaginationContainer>
  );
};

export default ShowsWatched;
