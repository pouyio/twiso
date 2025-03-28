import {
  addDays,
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  getYear,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale/es';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event as ICalendarEvent,
} from 'react-big-calendar';
import { Helmet } from 'react-helmet';
import { getCalendar } from 'utils/api';
import { Event } from './Event';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { useAppSelector } from 'state/store';
import { Icon } from 'components/Icon';
import { AuthContext } from 'contexts/AuthContext';
import { useSearchParams } from 'react-router';
import { useTranslate } from '../../hooks/useTranslate';
import { MovieCalendar, ShowCalendar } from '../../models/Api';

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

export default function Calendar() {
  const { session } = useContext(AuthContext);
  const isLogged = !!session;
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
    setEvents([]);

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
        <div className="flex justify-evenly items-center flex-wrap pb-2">
          <div className="flex justify-center text-2xl">
            <button className="mr-10" onClick={() => changeMonth(-1)}>
              <Icon name="arrow-left" className="h-8" />
            </button>
            <h1 className="font-light capitalize ">
              {selectedDate.toLocaleDateString(language, {
                month: 'long',
              })}{' '}
              {getYear(selectedDate)}
            </h1>
            <button className="ml-10" onClick={() => changeMonth(1)}>
              <Icon name="arrow-right" className="h-8" />
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
