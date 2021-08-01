import React, { useContext, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'state/store';
import { populateDetail } from 'state/slices/shows/thunks';
import Collapsable from '../components/Collapsable/Collapsable';
import Emoji from '../components/Emoji';
import Genres from '../components/Genres';
import Image from '../components/Image';
import People from '../components/People';
import Rating from '../components/Rating';
import Related from '../components/Related';
import SeasonsContainer from '../components/Seasons/SeasonsContainer';
import ShowWatchButton from '../components/ShowWatchButton';
import { AlertContext } from '../contexts';
import { useIsWatch, useShare } from '../hooks';
import { People as IPeople, Ratings, Show } from '../models';
import { getPeopleApi, getRatingsApi } from '../utils/api';

enum status {
  'returning series' = 'en antena',
  'in production' = 'en producción',
  planned = 'planeada',
  canceled = 'cancelada',
  ended = 'terminada',
}

export default function ShowDetail() {
  // const [item, setItem] = useState<Show>();
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const [showProgressPercentage, setShowProgressPercentage] = useState(false);
  const { state } = useLocation<Show>();
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();
  const item = useAppSelector((state) => state.shows.detail);
  const progress = useAppSelector(
    (state) =>
      state.shows.watched.find((s) => s.show.ids.trakt === item?.ids.trakt)
        ?.progress
  );
  const dispatch = useAppDispatch();

  const { isWatchlist, isWatched } = useIsWatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(populateDetail({ id: +id, show: state }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, id]);

  useEffect(() => {
    setPeople(undefined);
    setRatings(undefined);
    getPeopleApi(+id, 'show').then(({ data }) => {
      setPeople(data);
    });
    getRatingsApi(+id, 'show').then(({ data }) => {
      setRatings(data);
    });
  }, [id]);

  const getBgClassName = () => {
    if (!item) {
      return;
    }
    if (isWatched(+id, 'show')) {
      return 'bg-green-400';
    }
    if (isWatchlist(+id, 'show')) {
      return 'bg-blue-400';
    }
    return 'bg-gray-300';
  };

  const onShare = () => {
    share(item!.title).then((action) => {
      if (action === 'copied') {
        showAlert(`Enlace a "${item!.title}" copiado`);
      }
    });
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
              <Emoji emoji="▶️" className="text-4xl" title="Youtube trailer" />
            </a>
          )}
          <button
            className="absolute"
            style={{ left: '4em', bottom: '4em' }}
            onClick={onShare}
          >
            <Emoji emoji="📤" className="text-4xl" title="Share" />
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
                  <Emoji
                    emoji="▶️"
                    className="text-2xl"
                    title="Youtube trailer"
                  />
                </a>
              )}
              <button
                className="absolute"
                style={{ left: '10%', bottom: '5%' }}
                onClick={onShare}
              >
                <Emoji emoji="📤" className="text-2xl" title="share" />
              </button>
            </div>

            <div className="w-full max-w-3xl">
              <h1 className="text-4xl leading-none text-center mb-4">
                {item.title}
              </h1>

              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2 className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-100 capitalize">
                  {status[item.status]}
                </h2>
                <h2>{item.runtime || '?'} mins</h2>
              </div>
              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2>
                  <Rating
                    rating={ratings?.rating ?? 0}
                    votes={ratings?.votes ?? 0}
                  />
                </h2>
                {isWatched(+id, 'show') && (
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
                    <div className="bg-green-100 rounded">
                      <div
                        className="bg-green-400 h-1 rounded text-white text-xs"
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

              {!isWatched(+id, 'show') && (
                <div className="my-4">
                  <ShowWatchButton item={item} />
                </div>
              )}
              <div className="my-4">
                <SeasonsContainer show={item} showId={+id} />
              </div>
            </div>
          </div>

          <div className="my-4">
            <p className="font-medium">Resumen:</p>
            <Collapsable heightInRem={7}>
              {item.overview || 'Sin descripción'}
            </Collapsable>
          </div>

          <div className="my-4">
            <p className="font-medium">Géneros:</p>
            <Genres genres={item.genres} />
          </div>

          <div className="my-4">
            <People people={people} type="show" />
          </div>

          <div className="my-4">
            <p className="font-medium">Relacionados:</p>
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
