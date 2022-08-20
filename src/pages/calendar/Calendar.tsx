import Emoji from 'components/Emoji';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import getYear from 'date-fns/getYear';
import es from 'date-fns/locale/es';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import addDays from 'date-fns/addDays';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import startOfMonth from 'date-fns/startOfMonth';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event as ICalendarEvent,
} from 'react-big-calendar';
import { Helmet } from 'react-helmet';
import { getCalendar } from 'utils/api';
import { Event } from './Event';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';
import { ShowCalendar, MovieCalendar } from 'models';
import { AuthService } from 'utils/AuthService';
import { useAppSelector } from 'state/store';
import { useTranslate } from 'hooks';
import { useSearchParams } from 'hooks';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    es,
  },
});

const getAllDates = (date: Date) => {
  const prevMonthDay = format(addDays(startOfMonth(date), -6), 'yyyy-MM-dd');
  const nextMonthDay = format(startOfMonth(addMonths(date, 1)), 'yyyy-MM-dd');
  const firstDate = format(startOfMonth(date), 'yyyy-MM-dd');
  const daysInMonth = getDaysInMonth(date);

  return { prevMonthDay, nextMonthDay, firstDate, daysInMonth };
};

const mapMovie = (m: MovieCalendar) => ({
  title: m.movie.title,
  start: new Date(m.released),
  end: new Date(m.released),
  resource: { ...m, type: 'movie' },
});

const mapShow = (s: ShowCalendar) => ({
  title: `${s.episode.season}x${s.episode.number} - ${s.show.title}`,
  start: new Date(s.first_aired),
  end: new Date(s.first_aired),
  resource: { ...s, type: 'show' },
});

const authService = AuthService.getInstance();

export default function Calendar() {
  const isLogged = authService.isLoggedIn();
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({
    date: new Date().toISOString(),
  });
  const selectedDate = useMemo<Date>(
    () => new Date(searchParams.get('date') ?? new Date()),
    [searchParams]
  );
  const [only, setOnly] = useState<'movie' | 'show'>();
  const language = useAppSelector((state) => state.config.language);
  const { t } = useTranslate();

  useEffect(() => {
    if (!isLogged) {
      return;
    }

    const { prevMonthDay, nextMonthDay, firstDate, daysInMonth } =
      getAllDates(selectedDate);

    getCalendar<MovieCalendar>('movie', prevMonthDay, 6).then(({ data }) =>
      setEvents((e) => [...e, ...data.map(mapMovie)])
    );
    getCalendar<MovieCalendar>('movie', firstDate, daysInMonth).then(
      ({ data }) => setEvents((e) => [...e, ...data.map(mapMovie)])
    );
    getCalendar<MovieCalendar>('movie', nextMonthDay, 6).then(({ data }) =>
      setEvents((e) => [...e, ...data.map(mapMovie)])
    );
    getCalendar<ShowCalendar>('show', prevMonthDay, 6).then(({ data }) =>
      setEvents((e) => [...e, ...data.map(mapShow)])
    );
    getCalendar<ShowCalendar>(
      'show',
      firstDate,
      getDaysInMonth(selectedDate)
    ).then(({ data }) => setEvents((e) => [...e, ...data.map(mapShow)]));
    getCalendar<ShowCalendar>('show', nextMonthDay, 6).then(({ data }) =>
      setEvents((e) => [...e, ...data.map(mapShow)])
    );
  }, [isLogged, selectedDate]);

  const changeMonth = (direction: number) => {
    setSearchParams({ date: addMonths(selectedDate, direction).toISOString() });
    setEvents([]);
  };

  const filteredEvents = only
    ? events.filter((e) => e.resource.type === only)
    : events;

  return (
    <div className="m-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <div className="lg:max-w-6xl m-auto" style={{ height: '85vh' }}>
        <div className="flex flex-wrap justify-evenly items-center flex-wrap pb-2">
          <div className="flex justify-center text-2xl">
            <button className="mr-10" onClick={() => changeMonth(-1)}>
              <Emoji emoji="⬅️" />
            </button>
            <h1 className="font-light capitalize ">
              {selectedDate.toLocaleDateString(language, {
                month: 'long',
              })}{' '}
              {getYear(selectedDate)}
            </h1>
            <button className="ml-10" onClick={() => changeMonth(1)}>
              <Emoji emoji="➡️" />
            </button>
          </div>
          <div className="flex mt-2 lg:mt-0">
            <button
              onClick={() =>
                setOnly((o) => (o === 'movie' ? undefined : 'movie'))
              }
              className={`${
                only === 'movie' ? 'bg-gray-300' : 'bg-gray-100 opacity-75'
              } px-3 rounded-l`}
            >
              {t('movies')}
            </button>
            <button
              onClick={() =>
                setOnly((o) => (o === 'show' ? undefined : 'show'))
              }
              className={`${
                only === 'show' ? 'bg-gray-300' : 'bg-gray-100 opacity-75'
              } px-3 rounded-r`}
            >
              {t('shows')}
            </button>
          </div>
        </div>
        <BigCalendar
          popup
          toolbar={false}
          drilldownView={null}
          localizer={localizer}
          culture="es"
          events={filteredEvents}
          date={selectedDate}
          onNavigate={() => null}
          components={{
            event: Event,
          }}
        />
      </div>
    </div>
  );
}
