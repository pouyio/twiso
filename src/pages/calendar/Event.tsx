import React from 'react';
import { Event as ICalendarEvent, EventProps } from 'react-big-calendar';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'state/store';

export const Event: React.FC<EventProps<ICalendarEvent>> = ({
  title,
  event,
}) => {
  const item = useAppSelector((state) => {
    if (event.resource.type === 'movie') {
      return (
        state.movies.watched.find(
          (m) => m.movie.ids.trakt === event.resource.movie.ids.trakt
        ) ||
        state.movies.watchlist.find(
          (m) => m.movie.ids.trakt === event.resource.movie.ids.trakt
        )
      );
    }
    return (
      state.shows.watched.find(
        (s) => s.show.ids.trakt === event.resource.show.ids.trakt
      ) ||
      state.shows.watchlist.find(
        (s) => s.show.ids.trakt === event.resource.show.ids.trakt
      )
    );
  });
  return (
    <Link
      to={{
        pathname: `/${event.resource.type}/${
          event.resource[event.resource.type].ids.trakt
        }`,
        search:
          event.resource.type === 'show'
            ? `?season=${event.resource.episode.season}`
            : '',
        state:
          event.resource.type === 'movie' ? item?.['movie'] : item?.['show'],
      }}
    >
      <article className="text-xs lg:text-sm">{title}</article>
    </Link>
  );
};
