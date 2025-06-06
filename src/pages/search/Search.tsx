import { SearchFilters, IFilters } from '../../pages/search/SearchFilters';
import React, { useEffect, useState, useCallback } from 'react';
import Emoji from '../../components/Emoji';
import ImageLink from '../../components/ImageLink';
import Popular from '../../components/Popular';
import { searchApi } from '../../utils/api';
import { useSearch } from '../../hooks/useSearch';
import { useFilter } from '../../hooks/useFilter';
import { useDebounce } from '../../hooks/useDebounce';
import { useTranslate } from '../../hooks/useTranslate';
import { SearchMovie, SearchPerson, SearchShow } from '../../models/Movie';

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
      setMovieResults(movies.filter((m) => m.movie.ids.imdb));
      setShowResults(shows.filter((m) => m.show.ids.imdb));
      setPeopleResults(person.filter((m) => m.person.ids.imdb));
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
      <title>Search</title>
      <div className="w-full bg-gray-300 rounded-sm flex items-center my-2 m-auto lg:max-w-lg">
        <input
          className="bg-gray-300 rounded-sm text-black px-2 py-1 outline-hidden grow"
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
                  className="-mx-2 flex flex-col flex-wrap content-start overflow-x-auto gap-2 max-h-120"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {movieResults.map((r) => (
                    <li key={r.movie.ids.slug} className="w-35">
                      <ImageLink
                        ids={r.movie.ids}
                        text={r.movie.title}
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
                  className="-mx-2 flex flex-col flex-wrap content-start overflow-x-auto gap-2 max-h-120"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {showResults.map((r) => (
                    <li key={r.show.ids.slug} className="w-35">
                      <ImageLink
                        ids={r.show.ids}
                        text={r.show.title}
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
