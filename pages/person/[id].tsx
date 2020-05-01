import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import CollapsableText from '../../components/CollapsableText';
import Emoji from '../../components/Emoji';
import Image from '../../components/Image';
import ImageLink from '../../components/ImageLink';
import { findFirstValid, useDeleteQueryData } from '../../hooks';
import {
  Movie,
  Person as IPerson,
  PersonMovies,
  PersonShows,
  Show,
  SearchPerson,
} from '../../models';
import { useGlobalState } from '../../state/store';
import {
  getApi,
  getImgsApi,
  getPersonApi,
  getPersonItemsApi,
} from '../../utils/api';
import Head from 'next/head';
import {
  EnteringBottom,
  EnteringTop,
} from '../../components/Animated/Entering';

interface IPersonProps {
  id: string;
  initialItem?: IPerson;
  initialImgUrl: string;
}

const Person: React.FC<IPersonProps> = ({ id, initialItem, initialImgUrl }) => {
  const [localState, setLocalState] = useState<IPerson | undefined>(
    initialItem,
  );
  const [movieResults, setMovieResults] = useState<
    { movie: Movie; type: string; title: string }[]
  >([]);
  const [showResults, setShowResults] = useState<
    { show: Show; type: 'show'; title: string }[]
  >([]);

  const {
    state: { language },
  } = useGlobalState();

  useDeleteQueryData('person');

  useEffect(() => {
    getPersonApi(+id).then(({ data }) => setLocalState(data));
    getPersonItemsApi<PersonShows>(id, 'show').then(({ data }) => {
      setShowResults(
        data.cast
          .filter((r) => r.series_regular)
          .filter(
            (r) => !(r.character === 'Himself' || r.character === 'Herself'),
          )
          .map((r) => ({ show: r.show, type: 'show', title: r.character })),
      );
    });
    getPersonItemsApi<PersonMovies>(id, 'movie').then(({ data }) => {
      setMovieResults([
        ...data.cast
          .filter(
            (r) => !(r.character === 'Himself' || r.character === 'Herself'),
          )
          .map((r) => ({
            movie: r.movie,
            type: 'movie',
            title: r.character,
          })),
        ...((data.crew || {}).directing || [])
          .map((r) => ({ movie: r.movie, type: 'movie', title: r.job }))
          .filter((r) => !(r.title === 'Himself' || r.title === 'Herself')),
      ]);
    });
  }, [id, language]);

  return localState ? (
    <div className="bg-gray-300">
      <Head>
        <title>{localState.name}</title>
        <meta property="og:site_name" content="Twiso" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={localState.name} />
        <meta property="og:image" content={initialImgUrl} />
      </Head>
      <div className="lg:max-w-5xl lg:mx-auto">
        <EnteringTop
          className="p-10 pt-5 sticky top-0 z-0 lg:hidden"
          style={{ minHeight: '15em' }}
        >
          {localState && (
            <Image
              ids={localState.ids}
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
              text={localState.name}
              type="person"
              size="big"
            />
          )}
        </EnteringTop>

        <EnteringBottom
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
                        ids={r.movie.ids}
                        text={r.movie.title}
                        item={r.movie}
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
                        ids={r.show.ids}
                        text={r.show.title}
                        item={r.show}
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
        </EnteringBottom>
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
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query: { data },
}) => {
  let initialImgUrl = '';
  try {
    if (data) {
      const parsedData = JSON.parse(data as string);
      if (parsedData) {
        return {
          props: {
            initialItem: parsedData,
            id: params!.id,
            initialImgUrl,
            key: `show/${params!.id}`,
          },
        };
      }
    }
  } catch (error) {
    console.error(error);
  }

  const searchResponses = await getApi<SearchPerson>(+params!.id, 'person');
  const imgResponse = await getImgsApi(
    searchResponses.data[0].person.ids.tmdb,
    'person',
  );

  const poster = findFirstValid(
    (imgResponse.data.posters || imgResponse.data.profiles)!,
    'en',
  );

  initialImgUrl = 'https://via.placeholder.com/185x330';
  if (poster) {
    initialImgUrl = `https://image.tmdb.org/t/p/w185${poster.file_path}`;
  }

  return {
    props: {
      initialItem: searchResponses.data[0].person,
      id: params!.id,
      initialImgUrl,
      key: `person/${params!.id}`,
    },
  };
};

export default Person;
