import React, { useEffect, useState, useContext } from 'react';
import WatchButton from '../components/WatchButton';
import { getApi, getPeopleApi, getRatingsApi } from '../utils/api';
import Image from '../components/Image';
import { useTranslate, useIsWatch, useShare } from '../hooks';
import Emoji from '../components/Emoji';
import Related from '../components/Related';
import Genres from '../components/Genres';
import People from '../components/People';
import CollapsableText from '../components/CollapsableText';
import { SearchMovie, Movie, People as IPeople, Ratings } from '../models';
import { useLocation, useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useGlobalState } from '../state/store';
import Rating from 'components/Rating';
import { AlertContext } from '../contexts';

export default function MovieDetail() {
  const [item, setItem] = useState<Movie>();
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const {
    state: { language },
  } = useGlobalState();
  const { title = '', overview = '' } = useTranslate('movie', item);
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();

  const { isWatchlist, isWatched } = useIsWatch();

  useEffect(() => {
    if (!state) {
      getApi<SearchMovie>(+id, 'movie').then(({ data }) => {
        const item = data[0];
        setItem(item.movie);
      });
      return;
    }
    setItem(state);
    window.scrollTo(0, 0);
  }, [state, id]);

  useEffect(() => {
    setPeople(undefined);
    setRatings(undefined);
    getPeopleApi(+id, 'movie').then(({ data }) => {
      setPeople(data);
    });
    getRatingsApi(+id, 'movie').then(({ data }) => {
      setRatings(data);
    });
  }, [id]);

  const getBgClassName = () => {
    if (!item) {
      return;
    }
    if (isWatched(+id, 'movie')) {
      return 'bg-green-400';
    }
    if (isWatchlist(+id, 'movie')) {
      return 'bg-blue-400';
    }
    return 'bg-gray-300';
  };

  const toggleShowOriginalTitle = () => {
    setShowOriginalTitle(!showOriginalTitle);
  };

  const onShare = () => {
    share(item!.title).then(action => {
      if (action === 'copied') {
        showAlert(`Enlace a "${item!.title}" copiado`);
      }
    });
  };

  return item ? (
    <div className={getBgClassName()}>
      <Helmet>
        <title>{title}</title>
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
              <h1
                onClick={toggleShowOriginalTitle}
                className="text-4xl leading-none text-center"
              >
                {showOriginalTitle ? item.title : title}
              </h1>
              <h1 className="text-xl leading-none text-center mb-4 text-gray-300">
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
            <p>Resumen:</p>
            <CollapsableText className="leading-tight font-light">
              {overview || 'Sin descripción'}
            </CollapsableText>
          </div>

          <div className="my-4">
            <p>Géneros:</p>
            <Genres genres={item.genres} />
          </div>

          <div className="my-4">
            <People people={people} type="movie" />
          </div>

          <div className="my-4">
            <p>Relacionados:</p>
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
