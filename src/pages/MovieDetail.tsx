import React, { useEffect, useState, useContext } from 'react';
import WatchButton from '../components/WatchButton';
import { getApi, getPeopleApi } from '../utils/api';
import Image from '../components/Image';
import useTranslate from '../utils/useTranslate';
import Emoji from '../components/Emoji';
import UserContext from '../utils/UserContext';
import Related from '../components/Related';
import Genres from '../components/Genres';
import People from '../components/People';
import CollapsableText from '../components/CollapsableText';
import { SearchMovie, Movie, People as IPeople } from '../models';
import { useLocation, useParams } from 'react-router-dom';

export default function MovieDetail() {
  const [item, setItem] = useState<Movie>();
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);
  const [people, setPeople] = useState<IPeople>();
  const { language, isWatched, isWatchlist } = useContext(UserContext)!;
  const { title = '', overview = '' } = useTranslate('movie', item);
  const { state } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (!state) {
      getApi<SearchMovie>(id, 'movie').then(({ data }) => {
        const item = data[0];
        setItem(item.movie);
      });
      return;
    }
    setItem(state);
    window.scrollTo(0, 0);
  }, [state, id]);
  useEffect(() => {
    getPeopleApi(id, 'movie').then(({ data }) => {
      setPeople(data);
    });
    return;
  }, [id]);
  const getBgClassName = () => {
    if (!item) {
      return;
    }
    if (isWatched(item.ids.trakt, 'movie')) {
      return 'bg-green-400';
    }
    if (isWatchlist(item.ids.trakt, 'movie')) {
      return 'bg-blue-400';
    }
    return 'bg-gray-300';
  };

  const toggleShowOriginalTitle = () => {
    setShowOriginalTitle(!showOriginalTitle);
  };

  return item ? (
    <div className={getBgClassName()}>
      <div className="lg:max-w-5xl lg:mx-auto lg:pt-2">
        <div
          className="p-10 sticky top-0 z-0 lg:hidden"
          style={{ minHeight: '15em' }}
        >
          <Image ids={item.ids} text={item.title} type="movie" />
          {item.trailer && (
            <a
              className="absolute"
              style={{ right: '4em', bottom: '4em' }}
              href={item.trailer}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Emoji emoji="▶️" className="text-4xl" />
            </a>
          )}
        </div>
        <article
          className="relative p-4 lg:p-8 bg-white rounded-t-lg"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
          <div className="flex items-start">
            <div className="hidden lg:block relative pr-4">
              <Image ids={item.ids} text={item.title} type="movie" />
              {item.trailer && (
                <a
                  className="absolute"
                  style={{ right: '4em', bottom: '4em' }}
                  href={item.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Emoji emoji="▶️" className="text-4xl" />
                </a>
              )}
            </div>

            <div className="w-full">
              <h1
                onClick={toggleShowOriginalTitle}
                className="text-4xl leading-none text-center mb-4"
              >
                {showOriginalTitle ? item.title : title}
              </h1>
              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2>
                  {new Date(item.released).toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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
            {people && <People people={people} type="movie" />}
          </div>

          <div className="my-4">
            <p>Relacionados:</p>
            <Related itemId={item.ids.trakt} type="movie" />
          </div>
        </article>
      </div>
    </div>
  ) : (
    <Emoji emoji="⏳" rotating={true} />
  );
}
