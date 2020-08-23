import React from 'react';
import { Event as ICalendarEvent, EventProps } from 'react-big-calendar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IState } from '../../state/state';

export const Event: React.FC<EventProps<ICalendarEvent>> = ({
  title,
  event,
}) => {
  const item = useSelector((state: IState) => {
    if (event.resource.type === 'movie') {
      return (
        state.movies.watched.find(
          (m) => m.movie.ids.trakt === event.resource.ids.trakt
        ) ||
        state.movies.watchlist.find(
          (m) => m.movie.ids.trakt === event.resource.ids.trakt
        )
      );
    }
    return (
      state.shows.watched.find(
        (m) => m.show.ids.trakt === event.resource.ids.trakt
      ) ||
      state.shows.watchlist.find(
        (m) => m.show.ids.trakt === event.resource.ids.trakt
      )
    );
  });
  return (
    <Link
      to={{
        pathname: `/${event.resource.type}/${event.resource.ids.trakt}`,
        state:
          event.resource.type === 'movie' ? item?.['movie'] : item?.['show'],
      }}
    >
      <article className="text-xs lg:text-sm">{title}</article>
    </Link>
  );
};
