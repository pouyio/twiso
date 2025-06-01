import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { fillDetail } from 'state/slices/movies/thunks';
import { useAppDispatch, useAppSelector } from 'state/store';
import Collapsable from '../components/Collapsable/Collapsable';
import Genres from '../components/Genres';
import Image from '../components/Image';
import People from '../components/People';
import Rating from '../components/Rating';
import Related from '../components/Related';
import WatchButton from '../components/WatchButton';
import { AlertContext } from '../contexts/AlertContext';
import { People as IPeople } from '../models/People';
import { getPeopleApi, getRatingsApi } from '../utils/api';
import { Icon } from 'components/Icon';
import { Ratings } from '../models/Api';
import { useShare } from '../hooks/useShare';
import { useTranslate } from '../hooks/useTranslate';
import db, { DETAIL_MOVIES_TABLE, USER_MOVIES_TABLE } from '../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useImage } from 'hooks/useImage';
import { ThemeContext } from 'contexts/ThemeContext';

export default function MovieDetail() {
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const language = useAppSelector((state) => state.config.language);
  const { id = '' } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { contentRef } = useContext(ThemeContext);
  const { share } = useShare();
  const dispatch = useAppDispatch();
  const { t } = useTranslate();
  const [zoom, setZoom] = useState(false);
  const refreshIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-expect-error limitations on Dexie EntityTable
    db[DETAIL_MOVIES_TABLE].get(id).then((movie) => {
      if (!movie) {
        dispatch(fillDetail({ id }));
      }
    });
  }, [id]);

  const item = useLiveQuery(
    () =>
      // @ts-expect-error limitations on Dexie EntityTable
      db[DETAIL_MOVIES_TABLE].get(id),
    [id]
  );
  const { refresh } = useImage('movie', 'big', true, item?.ids.tmdb);

  const liveStatus = useLiveQuery(() => db[USER_MOVIES_TABLE].get(id), [id]);

  useEffect(() => {
    setPeople(undefined);
    setRatings(undefined);
    getPeopleApi(id ?? '', 'movie').then(({ data }) => {
      setPeople(data);
    });
    getRatingsApi(id ?? '', 'movie').then(({ data }) => {
      setRatings(data);
    });
  }, [id]);

  const bgClassName = useMemo(() => {
    if (liveStatus?.status === 'watched') {
      return 'bg-green-400';
    }
    if (liveStatus?.status === 'watchlist') {
      return 'bg-blue-400';
    }
    return 'bg-gray-300';
  }, [liveStatus]);

  const title =
    (language === 'es'
      ? item?.translation?.title || item?.title
      : item?.title) || '';
  const overview =
    (language === 'es'
      ? item?.translation?.overview || item?.overview
      : item?.overview) || '';

  const onShare = () => {
    share(title).then((action) => {
      if (action === 'copied') {
        showAlert(t('link_copied', title));
      }
    });
  };

  useEffect(() => {
    console.log(contentRef);
    contentRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const onRefresh = () => {
    dispatch(fillDetail({ id }));
    refresh();

    const icon = refreshIconRef.current;
    if (!icon) return;

    icon.classList.add('animate-spin');

    setTimeout(() => {
      icon.classList.remove('animate-spin');
    }, 1000);
  };

  return (
    <div className={bgClassName}>
      <title>{title}</title>
      <div className="lg:max-w-5xl lg:mx-auto">
        <div
          onClick={() => setZoom((z) => !z)}
          className={`${
            zoom ? 'pb-10 z-10' : 'p-10 pt-5'
          }  sticky top-0 z-0 lg:hidden transition-[padding]`}
          style={{ minHeight: '15em' }}
        >
          <Image
            ids={item?.ids}
            className={`mt-[env(safe-area-inset-top)] ${
              !item && 'min-h-116 border-2 animate-pulse'
            }`}
            text={title}
            type="movie"
            size="big"
          />
          {!zoom && (
            <>
              {item?.trailer && (
                <a
                  onClick={(e) => e.stopPropagation()}
                  className="absolute"
                  style={{ right: '4em', bottom: '4em' }}
                  href={item.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    name="trailer"
                    className="h-12"
                    title="Youtube trailer"
                  />
                </a>
              )}
              <button
                className="absolute"
                style={{ left: '4em', bottom: '4em' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
              >
                <Icon name="share" className="h-12" title="Share" />
              </button>
            </>
          )}
        </div>
        <article className="relative p-4 lg:p-8 bg-white rounded-t-lg lg:rounded-none">
          <div className="lg:hidden bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
          <div className="flex items-start">
            <div
              className="hidden lg:block relative pr-4"
              style={{ minWidth: '10em', maxWidth: '10em' }}
            >
              <Image ids={item?.ids} text={title} type="movie" size="small" />
              {item?.trailer && (
                <a
                  className="absolute"
                  style={{ right: '15%', bottom: '5%' }}
                  href={item.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    name="trailer"
                    className="h-8"
                    title="Youtube trailer"
                  />
                </a>
              )}
              <button
                className="absolute"
                style={{ left: '10%', bottom: '5%' }}
                onClick={onShare}
              >
                <Icon name="share" className="h-8" title="Share" />
              </button>
            </div>

            <div className="w-full">
              <h1
                className={`text-4xl leading-none text-center ${
                  !item && 'animate-pulse rounded-full bg-gray-200'
                }`}
              >
                {title}{' '}
                <button
                  title={t('refresh')}
                  className="mx-5 cursor-pointer"
                  onClick={() => onRefresh()}
                >
                  <Icon ref={refreshIconRef} name="refresh" className="h-6" />
                </button>
              </h1>
              <h1
                className={`text-xl text-center mb-4 text-gray-300 ${
                  !item && 'animate-pulse bg-gray-200 h-6 rounded-full mt-1'
                }`}
              >
                {item?.released
                  ? new Date(item.released).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : item?.status}
              </h1>
              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2>
                  <Rating
                    rating={ratings?.rating ?? 0}
                    votes={ratings?.votes ?? 0}
                  />
                </h2>
                <h2>{item?.runtime || '?'} mins</h2>
              </div>
              {item ? (
                <WatchButton item={item} />
              ) : (
                <div
                  className={`${
                    !item && 'animate-pulse bg-gray-200 rounded-full h-12 mx-12'
                  }`}
                ></div>
              )}
            </div>
          </div>
          <div className="my-4">
            <p className="font-medium font-family-text">{t('overview')}:</p>
            {item ? (
              <Collapsable heightInRem={7}>{overview}</Collapsable>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
                <div className="animate-pulse h-3 rounded bg-gray-200"></div>
              </div>
            )}
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">{t('genres')}:</p>
            <Genres genres={item?.genres} />
          </div>

          <People people={people} type="movie" />

          <div className="my-4">
            <p className="font-medium font-family-text">{t('extra-scenes')}:</p>

            <div className="my-3">
              <span
                className={`mr-5 ${
                  item?.during_credits ? '' : 'opacity-50 line-through'
                } bg-gray-200 font-light px-2 py-1 rounded-full mx-1 whitespace-pre`}
              >
                {t('during-credits')} {item?.during_credits && '✓'}
              </span>
              <span
                className={`mt-2 ${
                  item?.after_credits ? '' : 'opacity-50 line-through'
                } bg-gray-200 font-light px-2 py-1 rounded-full mx-1 whitespace-pre`}
              >
                {t('post-credits')} {item?.after_credits && '✓'}
              </span>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">{t('related')}:</p>
            {item && <Related itemIds={item.ids} type="movie" />}
          </div>
        </article>
      </div>
    </div>
  );
}
