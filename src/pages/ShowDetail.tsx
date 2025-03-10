import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from 'state/store';
import { populateDetail, toggleHidden } from 'state/slices/shows/thunks';
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
import { Helmet } from 'react-helmet';
import { Icon } from 'components/Icon';
import { useShare } from '../hooks/useShare';
import { useTranslate } from '../hooks/useTranslate';
import { useIsWatch } from '../hooks/useIsWatch';
import { Ratings } from '../models/Api';
import { Show, ShowWatched } from '../models/Show';

export default function ShowDetail() {
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const [showProgressPercentage, setShowProgressPercentage] = useState(false);
  const { state } = useLocation() as { state: Show };
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();
  const item = useAppSelector((state) => state.shows.detail);
  const progress = useAppSelector(
    (state) =>
      (state.shows.shows[item?.ids.trakt ?? 0] as ShowWatched)?.progress
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslate();

  const { isWatchlist, isWatched, isHidden } = useIsWatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(populateDetail({ id: +id!, show: state }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, id]);

  useEffect(() => {
    setPeople(undefined);
    setRatings(undefined);
    getPeopleApi(+id!, 'show').then(({ data }) => {
      setPeople(data);
    });
    getRatingsApi(+id!, 'show').then(({ data }) => {
      setRatings(data);
    });
  }, [id]);

  const getBgClassName = () => {
    if (!item) {
      return;
    }
    if (isHidden(+id!)) {
      return 'bg-green-800';
    }
    if (isWatched(+id!, 'show')) {
      return 'bg-green-400';
    }
    if (isWatchlist(+id!, 'show')) {
      return 'bg-blue-400';
    }
    return 'bg-gray-300';
  };

  const onShare = () => {
    share(item!.title).then((action) => {
      if (action === 'copied') {
        showAlert(t('link_copied', item!.title));
      }
    });
  };

  const onToggleHidden = () => {
    if (item) {
      dispatch(toggleHidden(item.ids.trakt));
    }
  };

  return item ? (
    <div className={getBgClassName()}>
      <Helmet>
        <title>{item.title}</title>
      </Helmet>
      <div className="lg:max-w-5xl lg:mx-auto">
        <div
          className="p-10 pt-5 sticky top-0 z-0 lg:hidden"
          style={{ minHeight: '15em' }}
        >
          <Image
            ids={item.ids}
            style={{ marginTop: 'env(safe-area-inset-top)' }}
            text={item.title}
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
              <Image
                ids={item.ids}
                text={item.title}
                type="show"
                size="small"
              />
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
                {item.title}
              </h1>

              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2 className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-100 capitalize">
                  {t(item.status)}
                </h2>
                {isWatched(+id!, 'show') && (
                  <button onClick={onToggleHidden}>
                    <Icon
                      className="h-10"
                      name={isHidden(item.ids.trakt) ? 'no-hidden' : 'hidden'}
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
                {isWatched(+id!, 'show') && (
                  <h2
                    className="text-sm cursor-pointer text-center"
                    style={{ minWidth: '8rem' }}
                    onClick={() => setShowProgressPercentage((s) => !s)}
                  >
                    <Emoji emoji="✓" />{' '}
                    {showProgressPercentage
                      ? `${Math.round(
                          ((progress?.completed ?? 0) * 100) /
                            (progress?.aired ?? 1)
                        )}% completado`
                      : `${progress?.completed}/${progress?.aired} episodios`}
                    <div className="bg-green-100 rounded-sm">
                      <div
                        className="bg-green-400 h-1 rounded-sm text-white text-xs"
                        style={{
                          width: `${
                            ((progress?.completed ?? 0) * 100) /
                            (progress?.aired ?? 1)
                          }%`,
                        }}
                      ></div>
                    </div>
                  </h2>
                )}
                <h2>{item.network}</h2>
              </div>

              {!isWatched(+id!, 'show') && (
                <div className="my-4">
                  <ShowWatchButton item={item} />
                </div>
              )}
              <div className="my-4">
                <SeasonsContainer show={item} showId={+id!} />
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">{t('overview')}:</p>
            <Collapsable heightInRem={7}>
              {item.overview || 'Sin descripción'}
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
            <Related itemId={item.ids.trakt} type="show" />
          </div>
        </article>
      </div>
    </div>
  ) : (
    <div
      className="flex justify-center text-6xl items-center"
      style={{ marginTop: 'env(safe-area-inset-top)' }}
    >
      <Emoji emoji="⏳" rotating={true} />
    </div>
  );
}
