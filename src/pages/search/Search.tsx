import { SearchFilters, IFilters } from '../../pages/search/SearchFilters';
import React, { useEffect, useState, useCallback } from 'react';
import Helmet from 'react-helmet';
import Emoji from '../../components/Emoji';
import ImageLink from '../../components/ImageLink';
import Popular from '../../components/Popular';
import { useDebounce, useFilter, useSearch, useTranslate } from '../../hooks';
import { SearchMovie, SearchPerson, SearchShow } from '../../models';
import { searchApi } from '../../utils/api';

export type RemoteFilterTypes = Array<'movie' | 'show' | 'person'>;
type LocalFilterTypes = Array<'movie' | 'show'>;

export default function Search() {
  const { search, setSearch } = useSearch();
  const [loading, setLoading] = useState(false);
  const [movieResults, setMovieResults] = useState<SearchMovie[]>([]);
  const [showResults, setShowResults] = useState<SearchShow[]>([]);
  const [peopleResults, setPeopleResults] = useState<SearchPerson[]>([]);
  const [filters, setFilters] = useState<IFilters>({
    remote: false,
    types: [],
  });
  const { filterBy } = useFilter();
  const debouncedSearch = useDebounce(search, 500);
  const { t } = useTranslate();

  const remoteSearch = (query: string, types: RemoteFilterTypes) => {
    setLoading(true);
    searchApi<SearchMovie & SearchShow & SearchPerson>(
      query,
      types.join(',')
    ).then(({ data }) => {
      const movies: SearchMovie[] = data.filter((r) => r.type === 'movie');
      const shows: SearchShow[] = data.filter((r) => r.type === 'show');
      const person: SearchPerson[] = data.filter((r) => r.type === 'person');
      setMovieResults(movies);
      setShowResults(shows);
      setPeopleResults(person);
      setLoading(false);
    });
  };

  const localSearch = useCallback((query: string, types: LocalFilterTypes) => {
    setMovieResults([]);
    setShowResults([]);
    setPeopleResults([]);

    if (types.includes('movie')) {
      setMovieResults(filterBy(query, 'movie'));
    }
    if (types.includes('show')) {
      setShowResults(filterBy(query, 'show'));
    }
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setMovieResults([]);
      setShowResults([]);
      setPeopleResults([]);
      return;
    }

    if (filters.remote) {
      const fullTypes: RemoteFilterTypes = filters.types.length
        ? filters.types
        : ['movie', 'show', 'person'];
      remoteSearch(debouncedSearch, fullTypes);
      return;
    }

    const fullTypes = filters.types.filter((f) => f !== 'person').length
      ? filters.types.filter((f) => f !== 'person')
      : ['movie', 'show'];
    localSearch(debouncedSearch, fullTypes as LocalFilterTypes);
  }, [filters, debouncedSearch]);

  return (
    <div className="m-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <Helmet>
        <title>Search</title>
      </Helmet>
      <div className="w-full bg-gray-300 rounded flex items-center my-2 m-auto lg:max-w-lg">
        <input
          className="bg-gray-300 rounded text-black px-2 py-1 outline-none grow"
          type="text"
          placeholder={t('search_placeholder')}
          autoFocus={true}
          onChange={(e) => setSearch(e.target.value)}
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

      <SearchFilters onFiltersChange={setFilters} />

      {search ? (
        <>
          {(filters.types.length === 0 || filters.types.includes('movie')) &&
            (movieResults.length ? (
              <>
                <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
                  {t('movies')}
                </h1>
                <ul
                  className="-mx-2 -mt-2 flex flex-col flex-wrap content-start overflow-x-auto"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    maxHeight: '30em',
                  }}
                >
                  {movieResults.map((r) => (
                    <li
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
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h1 className="text-3xl mt-8 text-gray-700">{t('no_movies')}</h1>
            ))}

          {(filters.types.length === 0 || filters.types.includes('show')) &&
            (showResults.length ? (
              <>
                <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
                  {t('shows')}
                </h1>
                <ul
                  className="-mx-2 -mt-2 flex flex-col flex-wrap content-start overflow-x-auto lg:flex-row"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    maxHeight: '30em',
                  }}
                >
                  {showResults.map((r) => (
                    <li
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
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h1 className="text-3xl mt-8 text-gray-700">{t('no_shows')}</h1>
            ))}

          {(filters.types.length === 0 || filters.types.includes('person')) &&
            (peopleResults.length ? (
              <>
                <h1 className="text-2xl justify-center text-gray-700 m-4 mt-8 flex items-baseline">
                  {t('people')}
                </h1>
                <ul
                  className="-mx-2 -mt-2 flex flex-col flex-wrap content-start overflow-x-auto lg:flex-row"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    maxHeight: '30em',
                  }}
                >
                  {peopleResults.map((r) => (
                    <li
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
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h1 className="text-3xl mt-8 text-gray-700">{t('no_people')}</h1>
            ))}
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
