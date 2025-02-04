import React from 'react';
import { Event as ICalendarEvent, EventProps } from 'react-big-calendar';
import { Link } from 'react-router';
import { useAppSelector } from 'state/store';

export const Event: React.FC<EventProps<ICalendarEvent>> = ({
  title,
  event,
}) => {
  const item = useAppSelector((state) => {
    if (event.resource.type === 'movie') {
      return state.movies.movies[event.resource.movie.ids.trakt];
    }
    return state.shows.shows[event.resource.show.ids.trakt];
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
      }}
      state={event.resource.type === 'movie' ? item?.['movie'] : item?.['show']}
    >
      <article className="text-xs lg:text-sm">{title}</article>
    </Link>
  );
};
