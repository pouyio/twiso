import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from 'state/store';
import { fillDetail, setHiddenShow } from 'state/slices/shows/thunks';
import Collapsable from '../components/Collapsable/Collapsable';
import Emoji from '../components/Emoji';
import Genres from '../components/Genres';
import Image from '../components/Image';
import People from '../components/People';
import Rating from '../components/Rating';
import Related from '../components/Related';
import SeasonsContainer from '../components/Seasons/SeasonsContainer';
import ShowWatchButton from '../components/ShowWatchButton';
import { AlertContext } from '../contexts/AlertContext';
import { People as IPeople } from '../models/People';
import { getPeopleApi, getRatingsApi } from '../utils/api';
import { Icon } from 'components/Icon';
import { useShare } from '../hooks/useShare';
import { useTranslate } from '../hooks/useTranslate';
import { Ratings } from '../models/Api';
import db, { DETAIL_SHOWS_TABLE, USER_SHOWS_TABLE } from 'utils/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ShowDetail() {
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const [showProgressPercentage, setShowProgressPercentage] = useState(false);
  const language = useAppSelector((state) => state.config.language);
  const { id = '' } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();
  const dispatch = useAppDispatch();
  const { t } = useTranslate();
  const [zoom, setZoom] = useState(false);
  const refreshIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-expect-error limitations on Dexie EntityTable
    db[DETAIL_SHOWS_TABLE].get(id).then((show) => {
      if (!show) {
        dispatch(fillDetail({ id }));
      }
    });
  }, [id]);

  const liveItem = useLiveQuery(
    () =>
      // @ts-expect-error limitations on Dexie EntityTable
      db[DETAIL_SHOWS_TABLE].get(id),
    [id]
  );

  const liveStatus = useLiveQuery(() => db[USER_SHOWS_TABLE].get(id), [id]);

  const item = liveItem;

  useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setPeople(undefined);
    setRatings(undefined);
    getPeopleApi(id, 'show').then(({ data }) => {
      setPeople(data);
    });
    getRatingsApi(id, 'show').then(({ data }) => {
      setRatings(data);
    });
  }, [id]);

  const bgClassName = useMemo(() => {
    if (liveStatus?.hidden) {
      return 'bg-green-800';
    }
    if (liveStatus?.status === 'watched') {
      return 'bg-green-400';
    }
    if (liveStatus?.status === 'watchlist') {
      return 'bg-blue-400';
    }
    return 'bg-gray-300';
  }, [liveStatus]);

  const onShare = () => {
    share(title).then((action) => {
      if (action === 'copied') {
        showAlert(t('link_copied', title));
      }
    });
  };

  const onToggleHidden = () => {
    if (liveStatus) {
      dispatch(
        setHiddenShow({
          showId: liveStatus.show_imdb,
          hidden: !liveStatus.hidden,
        })
      );
    }
  };

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

  const totalEpisodes =
    item.all_seasons.reduce((acc, season) => {
      if (season.number > 0) {
        acc += season.episodes.length;
      }
      return acc;
    }, 0) ?? 1;

  const onRefresh = () => {
    dispatch(fillDetail({ id }));

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
            ids={item.ids}
            className="mt-[env(safe-area-inset-top)]"
            text={title}
            type="show"
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
          <div className="flex items-start justify-center">
            <div
              className="hidden lg:block relative pr-4"
              style={{ minWidth: '10em', maxWidth: '10em' }}
            >
              <Image ids={item.ids} text={title} type="show" size="small" />
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
                <Icon name="share" className="h-8" title="share" />
              </button>
            </div>

            <div className="w-full max-w-3xl">
              <h1 className="text-4xl leading-none text-center mb-4">
                {title}
                <button
                  title={t('refresh')}
                  className="mx-5 cursor-pointer inline"
                  onClick={() => onRefresh()}
                >
                  <Icon ref={refreshIconRef} name="refresh" className="h-6" />
                </button>
              </h1>

              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2 className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-100 capitalize">
                  {t(item.status)}
                </h2>
                {liveStatus?.status === 'watched' && (
                  <button onClick={onToggleHidden}>
                    <Icon
                      className="h-10"
                      name={liveStatus?.hidden ? 'no-hidden' : 'hidden'}
                      title="Toggle visibility"
                    />
                  </button>
                )}
                <h2>{item.runtime || '?'} mins</h2>
              </div>
              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2>
                  <Rating
                    rating={ratings?.rating ?? 0}
                    votes={ratings?.votes ?? 0}
                  />
                </h2>
                {liveStatus?.status === 'watched' && (
                  <h2
                    className="text-sm cursor-pointer text-center"
                    style={{ minWidth: '8rem' }}
                    onClick={() => setShowProgressPercentage((s) => !s)}
                  >
                    <Emoji emoji="✓" />{' '}
                    {showProgressPercentage
                      ? `${Math.round(
                          ((liveStatus?.episodes.length ?? 0) * 100) /
                            totalEpisodes
                        )}% ${t('completed')}`
                      : `${liveStatus?.episodes.length}/${totalEpisodes} ${t(
                          'episodes_small'
                        )}`}
                    <div className="bg-green-100 rounded-sm">
                      <div
                        className="bg-green-400 h-1 rounded-sm text-white text-xs"
                        style={{
                          width: `${
                            ((liveStatus?.episodes.length ?? 0) * 100) /
                            totalEpisodes
                          }%`,
                        }}
                      ></div>
                    </div>
                  </h2>
                )}

                <h2>{item.network}</h2>
              </div>

              {liveStatus?.status !== 'watched' && (
                <div className="my-4">
                  <ShowWatchButton item={item} />
                </div>
              )}
              <div className="my-4">
                <SeasonsContainer show={item} status={liveStatus} showId={id} />
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">{t('overview')}:</p>
            <Collapsable heightInRem={7}>
              {overview || 'Sin descripción'}
            </Collapsable>
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">{t('genres')}:</p>
            <Genres genres={item.genres} />
          </div>

          <div className="my-4">
            <People people={people} type="show" />
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">{t('related')}:</p>
            <Related itemIds={item.ids} type="show" />
          </div>
        </article>
      </div>
    </div>
  );
}
