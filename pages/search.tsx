import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Emoji from '../components/Emoji';
import ImageLink from '../components/ImageLink';
import Popular from '../components/Popular';
import { useDebounce } from '../hooks';
import { SearchMovie, SearchPerson, SearchShow } from '../models';
import { searchApi } from '../utils/api';
import { TappableLi } from '../components/Animated/TappableLi';

export default function Search() {
  const {
    replace,
    pathname,
    query: { search },
  } = useRouter();
  const [loading, setLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<SearchMovie[]>([]);
  const [showResults, setShowResults] = useState<SearchShow[]>([]);
  const [peopleResults, setPeopleResults] = useState<SearchPerson[]>([]);
  const debouncedSearch = useDebounce(search as string, 500);

  useEffect(() => {
    if (!debouncedSearch) {
      setMovieResults([]);
      setShowResults([]);
      setPeopleResults([]);
      return;
    }

    setLoading(true);
    let isSubscribed = true;
    searchApi<SearchMovie & SearchShow & SearchPerson>(
      debouncedSearch,
      'movie,show,person',
    ).then(({ data }) => {
      const movies: SearchMovie[] = data.filter((r) => r.type === 'movie');
      const shows: SearchShow[] = data.filter((r) => r.type === 'show');
      const person: SearchPerson[] = data.filter((r) => r.type === 'person');
      if (!isSubscribed) {
        return;
      }
      setMovieResults(movies);
      setShowResults(shows);
      setPeopleResults(person);
      setLoading(false);
    });
    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearch]);

  return (
    <div
      className="m-4 lg:max-w-5xl lg:mx-auto"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <Head>
        <title>Search</title>
      </Head>
      <div className="w-full bg-gray-300 rounded flex items-center m-auto lg:max-w-lg">
        <input
          className="bg-gray-300 rounded text-black px-2 py-1 outline-none flex-grow text-gray-700 "
          type="text"
          placeholder="🔍 Busca una película, serie o persona"
          autoFocus={true}
          onChange={(e) =>
            replace({ pathname, query: { search: e.target.value } })
          }
          value={search}
        />
        <button onClick={() => replace({ pathname, query: { search: '' } })}>
          <Emoji
            className="ml-3 mr-2"
            emoji={loading ? '⏳' : '❌'}
            rotating={loading}
          />
        </button>
      </div>

      {search ? (
        <>
          {movieResults.length ? (
            <>
              <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
                Películas
              </h1>
              <ul
                className="-mx-2 -mt-2 flex flex-col flex-wrap content-start overflow-x-auto"
                style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}
              >
                {movieResults.map((r) => (
                  <TappableLi
                    key={r.movie.ids.slug}
                    className="p-2"
                    style={{ height: '13.5em', width: '9.5em' }}
                  >
                    <ImageLink
                      ids={r.movie.ids}
                      text={r.movie.title}
                      item={r.movie}
                      type="movie"
                    />
                  </TappableLi>
                ))}
              </ul>
            </>
          ) : (
            <h1 className="text-3xl mt-8 text-gray-700">No hay películas</h1>
          )}

          {showResults.length ? (
            <>
              <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
                Series
              </h1>
              <ul
                className="-mx-2 -mt-2 flex flex flex-col flex-wrap content-start overflow-x-auto lg:flex-row"
                style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}
              >
                {showResults.map((r) => (
                  <TappableLi
                    key={r.show.ids.slug}
                    className="p-2"
                    style={{ height: '13.5em', width: '9.5em' }}
                  >
                    <ImageLink
                      ids={r.show.ids}
                      text={r.show.title}
                      item={r.show}
                      type="show"
                    />
                  </TappableLi>
                ))}
              </ul>
            </>
          ) : (
            <h1 className="text-3xl mt-8 text-gray-700">No hay series</h1>
          )}

          {peopleResults.length ? (
            <>
              <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
                Personas
              </h1>
              <ul
                className="-mx-2 -mt-2 flex flex flex-col flex-wrap content-start overflow-x-auto lg:flex-row"
                style={{ WebkitOverflowScrolling: 'touch', maxHeight: '30em' }}
              >
                {peopleResults.map((r) => (
                  <TappableLi
                    key={r.person.ids.slug}
                    className="p-2"
                    style={{ height: '13.5em', width: '9.5em' }}
                  >
                    <ImageLink
                      ids={r.person.ids}
                      text={r.person.name}
                      item={r.person}
                      type="person"
                    />
                  </TappableLi>
                ))}
              </ul>
            </>
          ) : (
            <h1 className="text-3xl mt-8 text-gray-700">No hay personas</h1>
          )}
        </>
      ) : (
        <>
          <Popular type="movie" />
          <Popular type="show" />
        </>
      )}
    </div>
  );
}
