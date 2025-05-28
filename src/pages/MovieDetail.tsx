import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { fillDetail } from 'state/slices/movies/thunks';
import { useAppDispatch, useAppSelector } from 'state/store';
import Collapsable from '../components/Collapsable/Collapsable';
import Emoji from '../components/Emoji';
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
import { PullToRefresh } from 'components/PullToRefresh';

export default function MovieDetail() {
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const language = useAppSelector((state) => state.config.language);
  const { id = '' } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();
  const dispatch = useAppDispatch();
  const { t } = useTranslate();

  const refresh = () => {
    dispatch(fillDetail({ id }));
  };

  useEffect(() => {
    // @ts-expect-error limitations on Dexie EntityTable
    db[DETAIL_MOVIES_TABLE].get(id).then((movie) => {
      if (!movie) {
        dispatch(fillDetail({ id }));
      }
    });
  }, [id]);

  const liveItem = useLiveQuery(
    () =>
      // @ts-expect-error limitations on Dexie EntityTable
      db[DETAIL_MOVIES_TABLE].get(id),
    [id]
  );

  const liveStatus = useLiveQuery(() => db[USER_MOVIES_TABLE].get(id), [id]);

  const item = liveItem;

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

  if (!item) {
    return (
      <div
        className="flex justify-center text-6xl items-center pt-5"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        <Emoji emoji="⏳" rotating={true} />
      </div>
    );
  }

  const title =
    language === 'es' ? item['translation']?.title || item.title : item.title;
  const overview =
    language === 'es'
      ? item['translation']?.overview || item.overview
      : item.overview;

  const onShare = () => {
    share(title).then((action) => {
      if (action === 'copied') {
        showAlert(t('link_copied', title));
      }
    });
  };

  return (
    <PullToRefresh callback={refresh}>
      <div className={bgClassName}>
        <title>{title}</title>
        <div className="lg:max-w-5xl lg:mx-auto">
          <div
            className="p-10 pt-5 sticky top-0 z-0 lg:hidden"
            style={{ minHeight: '15em' }}
          >
            <Image
              ids={item.ids}
              style={{ marginTop: 'env(safe-area-inset-top)' }}
              text={title}
              type="movie"
              size="big"
            />
            {item.trailer && (
              <a
                className="absolute"
                style={{ right: '4em', bottom: '4em' }}
                href={item.trailer}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="trailer" className="h-12" title="Youtube trailer" />
              </a>
            )}
            <button
              className="absolute"
              style={{ left: '4em', bottom: '4em' }}
              onClick={onShare}
            >
              <Icon name="share" className="h-12" title="Share" />
            </button>
          </div>
          <article
            className="relative p-4 lg:p-8 bg-white rounded-t-lg lg:rounded-none"
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <div className="lg:hidden bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
            <div className="flex items-start">
              <div
                className="hidden lg:block relative pr-4"
                style={{ minWidth: '10em', maxWidth: '10em' }}
              >
                <Image ids={item.ids} text={title} type="movie" size="small" />
                {item.trailer && (
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
                <h1 className="text-4xl leading-none text-center">
                  {title}{' '}
                  <button
                    title={t('refresh')}
                    className="mx-5 cursor-pointer hidden lg:inline"
                    onClick={() => dispatch(fillDetail({ id }))}
                  >
                    <Icon name="refresh" className="h-6" />
                  </button>
                </h1>
                <h1 className="text-xl text-center mb-4 text-gray-300">
                  {item.released
                    ? new Date(item.released).toLocaleDateString(language, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : item.status}
                </h1>
                <div className="flex mb-4 justify-between items-center text-gray-600">
                  <h2>
                    <Rating
                      rating={ratings?.rating ?? 0}
                      votes={ratings?.votes ?? 0}
                    />
                  </h2>
                  <h2>{item.runtime || '?'} mins</h2>
                </div>
                <WatchButton item={item} />
              </div>
            </div>
            <div className="my-4">
              <p className="font-medium font-family-text">{t('overview')}:</p>
              <Collapsable heightInRem={7}>{overview}</Collapsable>
            </div>

            <div className="my-4">
              <p className="font-medium font-family-text">{t('genres')}:</p>
              <Genres genres={item.genres} />
            </div>

            <div className="my-4">
              <People people={people} type="movie" />
            </div>

            <div className="my-4">
              <p className="font-medium font-family-text">{t('related')}:</p>
              <Related itemIds={item.ids} type="movie" />
            </div>
          </article>
        </div>
      </div>
    </PullToRefresh>
  );
}
