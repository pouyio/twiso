import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'state/store';
import { populateDetail } from 'state/slices/movies/thunks';
import Collapsable from '../components/Collapsable/Collapsable';
import Emoji from '../components/Emoji';
import Genres from '../components/Genres';
import Image from '../components/Image';
import People from '../components/People';
import Rating from '../components/Rating';
import Related from '../components/Related';
import WatchButton from '../components/WatchButton';
import { AlertContext } from '../contexts';
import { useIsWatch, useShare, useTranslate } from '../hooks';
import { Movie, People as IPeople, Ratings } from '../models';
import { getPeopleApi, getRatingsApi } from '../utils/api';
import { Helmet } from 'react-helmet';

export default function MovieDetail() {
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const language = useAppSelector((state) => state.config.language);
  const { state } = useLocation() as { state: Movie };
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();
  const item = useAppSelector((s) => s.movies.detail);
  const dispatch = useAppDispatch();
  const { t } = useTranslate();

  const { isWatchlist, isWatched } = useIsWatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(populateDetail({ id: +id!, movie: state }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, id]);

  useEffect(() => {
    setPeople(undefined);
    setRatings(undefined);
    getPeopleApi(+id!, 'movie').then(({ data }) => {
      setPeople(data);
    });
    getRatingsApi(+id!, 'movie').then(({ data }) => {
      setRatings(data);
    });
  }, [id]);

  const getBgClassName = () => {
    if (!item) {
      return;
    }
    if (isWatched(+id!, 'movie')) {
      return 'bg-green-400';
    }
    if (isWatchlist(+id!, 'movie')) {
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
          <div className="flex items-start">
            <div
              className="hidden lg:block relative pr-4"
              style={{ minWidth: '10em', maxWidth: '10em' }}
            >
              <Image
                ids={item.ids}
                text={item.title}
                type="movie"
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
                <Emoji emoji="📤" className="text-2xl" title="Share" />
              </button>
            </div>

            <div className="w-full">
              <h1 className="text-4xl leading-none text-center">
                {item.title}
              </h1>
              <h1 className="text-xl text-center mb-4 text-gray-300">
                {new Date(item.released).toLocaleDateString(language, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
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
            <p className="font-medium font-family-text">Resumen:</p>
            <Collapsable heightInRem={7}>
              {item.overview || 'Sin descripción'}
            </Collapsable>
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">Géneros:</p>
            <Genres genres={item.genres} />
          </div>

          <div className="my-4">
            <People people={people} type="movie" />
          </div>

          <div className="my-4">
            <p className="font-medium font-family-text">Relacionados:</p>
            <Related itemId={item.ids.trakt} type="movie" />
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
