import React, { useEffect, useState } from 'react';
import useDebounce from '../utils/debounce';
import ImageLink from '../components/ImageLink';
import { searchApi } from '../utils/api';
import Popular from '../components/Popular';
import useSearch from '../utils/useSearch';
import Emoji from '../components/Emoji';
import { SearchMovie, SearchPerson, SearchShow } from '../models/Item';

export default function Search() {
  const { search, setSearch } = useSearch();
  const [loading, setLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<SearchMovie[]>([]);
  const [showResults, setShowResults] = useState<SearchShow[]>([]);
  const [peopleResults, setPeopleResults] = useState<SearchPerson[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!debouncedSearch) {
      setMovieResults([]);
      setShowResults([]);
      setPeopleResults([]);
      return;
    }

    setLoading(true);
    let isSubscribed = true;
    searchApi(debouncedSearch, 'movie,show,person').then(({ data }) => {
      const movies: SearchMovie[] = data.filter(r => r.type === 'movie');
      const shows: SearchShow[] = data.filter(r => r.type === 'show');
      const person: SearchPerson[] = data.filter(r => r.type === 'person');
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
    <div className="p-4 lg:max-w-5xl lg:mx-auto">
      <div className="w-full bg-gray-300 rounded flex items-center m-auto lg:max-w-lg">
        <input
          className="bg-gray-300 rounded text-black px-2 py-1 outline-none flex-grow text-gray-700 "
          type="text"
          placeholder="🔍 Busca una película, serie o persona"
          autoFocus={true}
          onChange={e => setSearch(e.target.value)}
          value={search}
        />
        <button onClick={() => setSearch('')}>
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
                {movieResults.map(r => (
                  <li
                    key={r.movie.ids.slug}
                    className="p-2"
                    style={{ height: '13.5em', width: '9.5em' }}
                  >
                    <ImageLink
                      item={r}
                      style={{ minHeight: '10em' }}
                      type="movie"
                    />
                  </li>
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
                {showResults.map(r => (
                  <li
                    key={r.show.ids.slug}
                    className="p-2"
                    style={{ height: '13.5em', width: '9.5em' }}
                  >
                    <ImageLink
                      item={r}
                      style={{ minHeight: '10em' }}
                      type="show"
                    />
                  </li>
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
                {peopleResults.map(r => (
                  <li
                    key={r.person.ids.slug}
                    className="p-2"
                    style={{ height: '13.5em', width: '9.5em' }}
                  >
                    <ImageLink
                      item={r}
                      style={{ minHeight: '10em' }}
                      type="person"
                    />
                  </li>
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
