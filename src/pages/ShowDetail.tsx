import React, { useEffect, useState, useContext } from 'react';
import { getApi, getPeopleApi } from '../utils/api';
import Image from '../components/Image';
import useTranslate from '../utils/useTranslate';
import Emoji from '../components/Emoji';
import Related from '../components/Related';
import SeasonsContainer from '../components/Seasons/SeasonsContainer';
import Genres from '../components/Genres';
import ShowWatchButton from '../components/ShowWatchButton';
import People from '../components/People';
import UserContext from '../utils/UserContext';
import CollapsableText from '../components/CollapsableText';
import { useLocation, useParams } from 'react-router-dom';
import { SearchShow, People as IPeople, Show } from '../models';

enum status {
  'returning series' = 'en antena',
  'in production' = 'en producción',
  planned = 'planeada',
  canceled = 'cancelada',
  ended = 'terminada',
}

export default function ShowDetail() {
  const [item, setItem] = useState<Show>();
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);
  const [people, setPeople] = useState<IPeople>();
  const { isWatched, isWatchlist } = useContext(UserContext)!;
  const { title, overview } = useTranslate('show', item);
  const { state } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    if (!state) {
      getApi<SearchShow>(id, 'show').then(({ data }) => {
        const item = data[0];
        setItem(item.show);
      });
      return;
    }
    setItem(state);
    window.scrollTo(0, 0);
  }, [state, id]);

  useEffect(() => {
    getPeopleApi(id, 'show').then(({ data }) => {
      setPeople(data);
    });
    return;
  }, [id]);

  const getBgClassName = () => {
    if (!item) {
      return;
    }
    if (isWatched(item.ids.trakt, 'show')) {
      return 'bg-green-400';
    }
    if (isWatchlist(item.ids.trakt, 'show')) {
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
          <Image ids={item.ids} text={item.title} type="show" />
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
            <div
              className="hidden lg:block relative pr-4"
              style={{ minWidth: '10em' }}
            >
              <Image ids={item.ids} text={item.title} type="show" />
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

            <div className="w-full max-w-3xl">
              <h1
                onClick={toggleShowOriginalTitle}
                className="text-4xl leading-none text-center mb-4"
              >
                {showOriginalTitle ? item.title : title}
              </h1>

              <div className="flex mb-4 justify-between items-center text-gray-600">
                <h2 className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200 capitalize">
                  {status[item.status]}
                </h2>
                <h2>{item.runtime || '?'} mins</h2>
              </div>

              {!isWatched(item.ids.trakt, 'show') && (
                <div className="my-4">
                  <ShowWatchButton item={item} />
                </div>
              )}
              <div className="my-4">
                <SeasonsContainer show={item} showId={id} />
              </div>
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
            {people && <People people={people} type="show" />}
          </div>

          <div className="my-4">
            <p>Relacionados:</p>
            <Related itemId={item.ids.trakt} type="show" />
          </div>
        </article>
      </div>
    </div>
  ) : (
    <Emoji emoji="⏳" rotating={true} />
  );
}
