import React, { useEffect, useState, useContext } from 'react';
import Image from './Image';
import ImageLink from './ImageLink';
import CollapsableText from './CollapsableText';
import { getPersonItemsApi, getPersonApi } from '../utils/api';
import UserContext from '../utils/UserContext';
import Emoji from './Emoji';
import { useParams } from 'react-router-dom';
import { IPerson } from '../models/IPerson';

const Person: React.FC = () => {
  const [localState, setLocalState] = useState<IPerson>();
  const [movieResults, setMovieResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<any[]>([]);

  const { language } = useContext(UserContext);

  const { id } = useParams();

  useEffect(() => {
    getPersonApi(id).then(({ data }) => setLocalState(data));
    getPersonItemsApi(id, 'show').then(({ data }) => {
      setShowResults(
        data.cast
          .map((r: any) => ({ show: r.show, type: 'show', title: r.character }))
          .filter(
            (r: any) => !(r.title === 'Himself' || r.title === 'Herself'),
          ),
      );
    });
    getPersonItemsApi(id, 'movie').then(({ data }) => {
      setMovieResults([
        ...data.cast
          .map((r: any) => ({
            movie: r.movie,
            type: 'movie',
            title: r.character,
          }))
          .filter((r: any) => r.title !== 'Himself'),
        ...((data.crew || {}).directing || [])
          .map((r: any) => ({ movie: r.movie, type: 'movie', title: r.job }))
          .filter(
            (r: any) => !(r.title === 'Himself' || r.title === 'Herself'),
          ),
      ]);
    });
  }, [id, language]);

  return localState ? (
    <div className="bg-gray-300">
      <div className="lg:max-w-5xl lg:mx-auto lg:pt-2">
        <div
          className="p-10 sticky top-0 z-0 lg:hidden"
          style={{ minHeight: '15em' }}
        >
          {localState && (
            <Image
              item={{ person: localState, type: 'person' }}
              type="person"
            />
          )}
        </div>

        <article
          className="relative p-4 lg:p-8 bg-white rounded-t-lg"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div className="bg-gray-400 h-1 w-1/4 -mt-1 mb-5 mx-auto rounded-full"></div>
          <div className="flex items-start">
            <div className="hidden lg:block relative pr-4">
              {localState && (
                <Image
                  item={{ person: localState, type: 'person' }}
                  type="person"
                />
              )}
            </div>

            <div className="w-full">
              <h1 className="text-4xl leading-none text-center mb-4">
                {localState.name}
              </h1>
              <div className="flex flex-wrap mb-4 justify-between items-center text-gray-600">
                <h2>
                  {new Date(localState.birthday).toLocaleDateString(language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                </h2>
                {localState.death && (
                  <h2>
                    {' '}
                    <Emoji emoji="✝️" />{' '}
                    {new Date(localState.death).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h2>
                )}
                {localState.birthplace && <h2>{localState.birthplace}</h2>}
              </div>
            </div>
          </div>

          <div className="my-4 relative">
            <p>Biografía:</p>
            <CollapsableText className="leading-tight font-light">
              {localState.biography || 'Sin descripción'}
            </CollapsableText>
          </div>

          {movieResults.length ? (
            <>
              <h1 className="text-3xl mt-3 text-gray-700">Películas </h1>
              <ul
                className="-mx-2 -mt-2 flex overflow-x-auto lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {movieResults.map((r, i) => (
                  <li
                    key={`${r.movie.ids.trakt}-movie-${i}`}
                    className="p-2 h-full"
                    style={{ flex: '1 0 50%', maxWidth: '10em' }}
                  >
                    <div className="bg-gray-300 rounded-lg">
                      <ImageLink
                        item={r}
                        type="movie"
                        style={{ minHeight: '13.5em' }}
                      >
                        {r.title && (
                          <p className="text-sm text-gray-700 text-center py-1">
                            {r.title}
                          </p>
                        )}
                      </ImageLink>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {showResults.length ? (
            <>
              <h1 className="text-3xl mt-3 text-gray-700">Series </h1>
              <ul
                className="-mx-2 -mt-2 flex overflow-x-auto lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {showResults.map((r, i) => (
                  <li
                    key={`${r.show.ids.trakt}-show-${i}`}
                    className="p-2 h-full"
                    style={{ flex: '1 0 50%', maxWidth: '10em' }}
                  >
                    <div className="bg-gray-300 rounded-lg">
                      <ImageLink
                        item={r}
                        type="show"
                        style={{ minHeight: '13.5em' }}
                      >
                        {r.title && (
                          <p className="text-sm text-gray-700 text-center py-1">
                            {r.title}
                          </p>
                        )}
                      </ImageLink>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      </div>
    </div>
  ) : (
    <Emoji emoji="⏳" rotating={true} />
  );
};

export default Person;
