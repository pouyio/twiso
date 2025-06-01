import React, { useContext, useEffect, useState } from 'react';
import Image from '../components/Image';
import ImageLink from '../components/ImageLink';
import Collapsable from '../components/Collapsable/Collapsable';
import { getPersonItemsApi, getPersonApi } from '../utils/api';
import Emoji from '../components/Emoji';
import { useParams } from 'react-router';
import { Person as IPerson } from '../models/Person';
import { placeholders } from '../components/Related';
import { Empty } from '../components/Empty';
import { useAppSelector } from 'state/store';
import { Movie } from '../models/Movie';
import { Show } from '../models/Show';
import { useTranslate } from '../hooks/useTranslate';
import { PersonMovies, PersonShows } from '../models/People';
import { ThemeContext } from 'contexts/ThemeContext';

const Person: React.FC = () => {
  const [localState, setLocalState] = useState<IPerson>();
  const [movieResults, setMovieResults] =
    useState<{ movie: Movie; title: string }[]>();
  const [movieDirectorResults, setMovieDirectorResults] =
    useState<{ movie: Movie; title: string }[]>();
  const [showResults, setShowResults] =
    useState<{ show: Show; title: string }[]>();
  const language = useAppSelector((state) => state.config.language);
  const { contentRef } = useContext(ThemeContext);

  const { id } = useParams<{ id: string }>();
  const { t } = useTranslate();

  useEffect(() => {
    setShowResults(undefined);
    setMovieResults(undefined);
    getPersonApi(id!).then(({ data }) => setLocalState(data));
    getPersonItemsApi<PersonShows>(id!, 'show').then(({ data }) => {
      setShowResults(
        data.cast
          .filter((r) => r.series_regular)
          .filter(
            (r) => !(r.character === 'Himself' || r.character === 'Herself')
          )
          .map((r) => ({ show: r.show, title: r.character }))
      );
    });
    getPersonItemsApi<PersonMovies>(id!, 'movie').then(({ data }) => {
      setMovieResults([
        ...data.cast
          .filter(
            (r) => !(r.character === 'Himself' || r.character === 'Herself')
          )
          .map((r) => ({
            movie: r.movie,
            title: r.character,
          })),
      ]);
      setMovieDirectorResults([
        ...((data.crew || {}).directing || [])
          .map((r) => ({ movie: r.movie, title: r.job }))
          .filter((r) => !(r.title === 'Himself' || r.title === 'Herself')),
      ]);
    });
  }, [id, language]);

  useEffect(() => {
    contentRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  return localState ? (
    <div className="bg-gray-300">
      <title>{localState.name}</title>
      <div className="lg:max-w-5xl lg:mx-auto">
        <div className="p-10 pt-5 sticky top-0 z-0 lg:hidden min-h-131">
          {localState && (
            <Image
              ids={localState.ids}
              className="pt-[env(safe-area-inset-top)]"
              text={localState.name}
              type="person"
              size="big"
            />
          )}
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
              {localState && (
                <Image
                  ids={localState.ids}
                  text={localState.name}
                  type="person"
                  size="small"
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
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                </h2>
                {localState.death && (
                  <h2>
                    {' '}
                    <Emoji emoji="✝️" />{' '}
                    {new Date(localState.death).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h2>
                )}
                {localState.birthplace && <h2>{localState.birthplace}</h2>}
              </div>
            </div>
          </div>

          <div className="my-4 relative">
            <p className="font-medium font-family-text">{t('bio')}:</p>
            <Collapsable heightInRem={7}>
              {localState.biography || 'Sin descripción'}
            </Collapsable>
          </div>

          <h1 className="font-medium font-family-text">{t('movies')} </h1>
          <ul
            className="-mx-2 my-2 flex overflow-x-auto lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {movieResults ? (
              movieResults.length ? (
                movieResults.map((r, i) => (
                  <li
                    key={`${r.movie.ids.imdb}-movie-${i}`}
                    className="p-2 h-full"
                    style={{ flex: '1 0 50%', maxWidth: '10em' }}
                  >
                    <div className="bg-gray-300 rounded-lg">
                      <ImageLink
                        ids={r.movie.ids}
                        text={r.movie.title}
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
                ))
              ) : (
                <Empty />
              )
            ) : (
              placeholders
            )}
          </ul>

          <h1 className="font-medium font-family-text">{t('direction')} </h1>
          <ul
            className="-mx-2 my-2 flex overflow-x-auto lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {movieDirectorResults ? (
              movieDirectorResults.length ? (
                movieDirectorResults.map((r, i) => (
                  <li
                    key={`${r.movie.ids.imdb}-movie-${i}`}
                    className="p-2 h-full"
                    style={{ flex: '1 0 50%', maxWidth: '10em' }}
                  >
                    <div className="bg-gray-300 rounded-lg">
                      <ImageLink
                        ids={r.movie.ids}
                        text={r.movie.title}
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
                ))
              ) : (
                <Empty />
              )
            ) : (
              placeholders
            )}
          </ul>

          <h1 className="font-medium font-family-text">{t('shows')} </h1>
          <ul
            className="-mx-2 my-2 flex overflow-x-auto lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {showResults ? (
              showResults.length ? (
                showResults.map((r, i) => (
                  <li
                    key={`${r.show.ids.imdb}-show-${i}`}
                    className="p-2 h-full"
                    style={{ flex: '1 0 50%', maxWidth: '10em' }}
                  >
                    <div className="bg-gray-300 rounded-lg">
                      <ImageLink
                        ids={r.show.ids}
                        text={r.show.title}
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
                ))
              ) : (
                <Empty />
              )
            ) : (
              placeholders
            )}
          </ul>
        </article>
      </div>
    </div>
  ) : (
    <div className="flex justify-center text-6xl items-center pt-5 mt-[env(safe-area-inset-top)]">
      <Emoji emoji="⏳" rotating={true} />
    </div>
  );
};

export default Person;
