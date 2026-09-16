import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../state/store';
import { fillDetail, setHiddenShow } from '../state/slices/shows/thunks';
import Collapsable from '../components/Collapsable/Collapsable';
import Emoji from '../components/Emoji';
import Genres from '../components/Genres';
import Image from '../components/Image';
import People from '../components/People';
import Rating from '../components/Rating';
import Related from '../components/Related';
import { SeasonRatingsGrid } from '../components/SeasonRatingsGrid/SeasonRatingsGrid';
import SeasonsContainer from '../components/Seasons/SeasonsContainer';
import ShowWatchButton from '../components/ShowWatchButton';
import { AnimatePresence } from 'framer-motion';
import { AlertContext } from '../contexts/AlertContext';
import { AuthContext } from '../contexts/AuthContext';
import { People as IPeople } from '../models/People';
import {
  getPeopleApi,
  getShowRatingsApi,
  getShowSeasonRatingsApi,
  getStudiosApi,
} from '../utils/api';
import { Icon } from '../components/Icon';
import { useShare } from '../hooks/useShare';
import { useTranslate } from '../hooks/useTranslate';
import { SeasonRating, ShowRating, Studio } from '../models/Api';
import db, { DETAIL_SHOWS_TABLE, USER_SHOWS_TABLE } from '../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useImage } from '../hooks/useImage';
import { getMedianRuntime } from '../utils/showRuntime';
import Studios from '../components/Studios';
import { Error } from './Error';

export default function ShowDetail() {
  const [people, setPeople] = useState<IPeople>();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [seasonRatings, setSeasonRatings] = useState<SeasonRating[] | null>();
  const [showRating, setShowRating] = useState<ShowRating>();
  const [showProgressPercentage, setShowProgressPercentage] = useState(false);
  const [ratingsExpanded, setRatingsExpanded] = useState(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const language = useAppSelector((state) => state.config.language);
  const { id = '' } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();
  const dispatch = useAppDispatch();
  const { t } = useTranslate();
  const [zoom, setZoom] = useState(false);
  const refreshIconRef = useRef<HTMLImageElement>(null);
  const { session } = useContext(AuthContext);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;
    // @ts-expect-error limitations on Dexie EntityTable
    db[DETAIL_SHOWS_TABLE].get(Number(id)).then((show) => {
      if (cancelled) return;
      if (show && show.contentLanguage === language) return;
      dispatch(fillDetail({ id: Number(id) }))
        .unwrap()
        .catch(() => setLoadError(true));
    });
    setPeople(undefined);
    getPeopleApi(Number(id), 'show', language).then((data) => {
      if (!cancelled) setPeople(data);
    });
    getStudiosApi(Number(id), 'show').then((data) => {
      if (!cancelled) setStudios(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id, language]);

  const item = useLiveQuery(
    () =>
      // @ts-expect-error limitations on Dexie EntityTable
      db[DETAIL_SHOWS_TABLE].get(Number(id)),
    [id]
  );

  const { refresh } = useImage(item?.ids.tmdb ?? 0, 'show', 'big', true);

  useEffect(() => {
    if (!item?.ids.tmdb) return;
    let cancelled = false;
    Promise.all([
      getShowSeasonRatingsApi(item.ids.tmdb),
      getShowRatingsApi(item.ids.tmdb),
    ])
      .then(([{ data: seasonData }, { data: showData }]) => {
        if (cancelled) return;
        setSeasonRatings(seasonData);
        setShowRating(showData ?? undefined);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [item?.ids.tmdb]);

  const liveStatus = useLiveQuery(() => db[USER_SHOWS_TABLE].get(Number(id)), [id]);

  const nextEpisode = useMemo(() => {
    if (!item) return undefined;
    const watched = new Set(
      (liveStatus?.episodes ?? []).map(
        (e) => `${e.season_number}_${e.episode_number}`
      )
    );
    for (const season of item.all_seasons) {
      if (season.number === 0) continue;
      for (const episode of season.episodes) {
        if (!watched.has(`${season.number}_${episode.number}`)) {
          return { season: season.number, episode: episode.number };
        }
      }
    }
    return null;
  }, [item, liveStatus]);

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

  const showRuntime = useMemo(
    () => getMedianRuntime(item?.all_seasons ?? []),
    [item?.all_seasons]
  );

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
          showId: liveStatus.show_tmdb,
          hidden: !liveStatus.hidden,
        })
      );
    }
  };

  const goToEpisode = (season: number, episode: number) => {
    setSearchParams({ season: `${season}` }, { replace: true });
    setTimeout(() => {
      const element = document.getElementById(`episode-${season}-${episode}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.classList.add('animate-breathe');
      setTimeout(() => element?.classList.remove('animate-breathe'), 1000);
    }, 300);
  };

  if (!item) {
    if (loadError) {
      return (
        <Error
          subtitle={t('no-info-message', t('show'))}
          onRetry={() => {
            setLoadError(false);
            dispatch(fillDetail({ id: Number(id) }))
              .unwrap()
              .catch(() => setLoadError(true));
          }}
        />
      );
    }
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
    language === 'es' ? item.translation?.title || item.title : item.title;
  const overview =
    language === 'es'
      ? item.translation?.overview || item.overview
      : item.overview;

  const totalEpisodes =
    item.all_seasons.reduce((acc, season) => {
      if (season.number > 0) {
        acc += season.episodes.length;
      }
      return acc;
    }, 0) ?? 1;

  const onRefresh = () => {
    dispatch(fillDetail({ id: Number(id) }));
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
      <div className="lg:max-w-6xl m-auto">
        <div
          onClick={() => setZoom((z) => !z)}
          className={`${
            zoom ? 'pb-10 z-10' : 'p-10 pt-5'
          }  sticky top-0 z-0 lg:hidden transition-[padding]`}
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
        <article className="relative p-4 lg:p-8 bg-white rounded-t-lg lg:rounded-none">
          <div className="lg:hidden bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
          <div className="flex items-start justify-around">
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

            <div className="w-full max-w-3xl flex flex-col gap-4 mb-4">
              <h1 className="text-4xl leading-none text-center">
                {title}
                <button
                  title={t('refresh')}
                  className="mx-5 cursor-pointer inline"
                  onClick={() => onRefresh()}
                >
                  <Icon ref={refreshIconRef} name="refresh" className="h-6" />
                </button>
              </h1>

              <div className="flex justify-between items-center text-gray-600">
                <div className="flex justify-start">
                  <h2 className="mx-1 rounded-full text-sm px-3 py-1 bg-gray-100 capitalize">
                    {t(item.status)}
                  </h2>
                </div>
                <div className="flex justify-center items-center gap-1">
                  {liveStatus?.status === 'watched' && (
                    <button onClick={onToggleHidden} className="cursor-pointer">
                      <Icon
                        className="h-10"
                        name={liveStatus?.hidden ? 'no-hidden' : 'hidden'}
                        title="Toggle visibility"
                      />
                    </button>
                  )}
                  {session && liveStatus?.status === 'watched' &&
                    (nextEpisode && (
                      <button
                        onClick={() =>
                          goToEpisode(nextEpisode.season, nextEpisode.episode)
                        }
                        className="mx-1 rounded-full text-sm px-3 py-1 bg-gray-100 flex items-center gap-1 cursor-pointer"
                        title={t('next_to_watch')}
                      >
                        <Icon name="play" className="h-3.5" />
                        {t('season_abbreviation')}
                        {nextEpisode.season} - {t('episode_abbreviation')}
                        {nextEpisode.episode}
                      </button>
                    ))}
                </div>
                <h2 className="flex justify-end">
                  {showRuntime ?? (item.runtime || '?')} mins
                </h2>
              </div>
              <div className="grid grid-cols-[35%_30%_35%] items-center text-gray-600 my-1">
                <div className="flex justify-start">
                  <Rating
                    rating={showRating?.overallAvg ?? 0}
                    votes={showRating?.totalRaters ?? 0}
                    onClick={() => setRatingsExpanded((e) => !e)}
                  />
                </div>
                <div className="flex justify-center">
                  {liveStatus?.status === 'watched' && (
                    <h2
                      className="text-sm cursor-pointer text-center flex-1"
                      style={{ maxWidth: '8rem' }}
                      onClick={() => setShowProgressPercentage((s) => !s)}
                    >
                      {showProgressPercentage
                        ? `${Math.round(
                            ((liveStatus?.episodes.length ?? 0) * 100) /
                              totalEpisodes
                          )}%`
                        : `${liveStatus?.episodes.length}/${totalEpisodes}`}
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
                </div>

                <h2 className="flex justify-end">{item.network}</h2>
              </div>
              <AnimatePresence>
                {ratingsExpanded && seasonRatings && (
                  <SeasonRatingsGrid ratings={seasonRatings} />
                )}
              </AnimatePresence>

              {liveStatus?.status !== 'watched' && (
                <ShowWatchButton item={item} />
              )}
              <SeasonsContainer
                show={item}
                status={liveStatus}
                seasonRatings={seasonRatings}
              />
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
            <p className="font-medium font-family-text">{t('studios')}:</p>
            <Studios studios={studios} />
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
