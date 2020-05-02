import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import {
  EnteringBottom,
  EnteringTop,
} from '../../components/Animated/Entering';
import CollapsableText from '../../components/CollapsableText';
import Emoji from '../../components/Emoji';
import Genres from '../../components/Genres';
import Image from '../../components/Image';
import People from '../../components/People';
import Rating from '../../components/Rating';
import Related from '../../components/Related';
import WatchButton from '../../components/WatchButton';
import { AlertContext } from '../../contexts';
import {
  findFirstValid,
  useDeleteQueryData,
  useIsWatch,
  useShare,
  useTranslate,
} from '../../hooks';
import { Movie, People as IPeople, Ratings, SearchMovie } from '../../models';
import { useGlobalState } from '../../state/store';
import {
  getApi,
  getImgsApi,
  getPeopleApi,
  getRatingsApi,
} from '../../utils/api';

interface IMovieProps {
  id: string;
  initialItem?: Movie;
  initialImgUrl: string;
}

const MoviePage: React.FC<IMovieProps> = ({
  id,
  initialItem,
  initialImgUrl,
}) => {
  const [item, setItem] = useState<Movie | undefined>(initialItem);
  const [showOriginalTitle, setShowOriginalTitle] = useState(false);
  const [people, setPeople] = useState<IPeople>();
  const [ratings, setRatings] = useState<Ratings>();
  const {
    state: { language },
  } = useGlobalState();
  const { title = '', overview = '' } = useTranslate('movie', item);

  const { showAlert } = useContext(AlertContext);
  const { share } = useShare();

  const { isWatchlist, isWatched } = useIsWatch();

  useDeleteQueryData('movie');

  useEffect(() => {
    if (!initialItem) {
      getApi<SearchMovie>(+id, 'movie').then(({ data }) => {
        const item = data[0];
        setItem(item.movie);
      });
      return;
    }
  }, [initialItem, id]);

  useEffect(() => {
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
    share(item!.title).then((action) => {
      if (action === 'copied') {
        showAlert(`Enlace a "${item!.title}" copiado`);
      }
    });
  };

  return item ? (
    <div className={getBgClassName()}>
      <Head>
        <title>{title}</title>
        <meta property="og:site_name" content="Twiso" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:title" content={initialItem?.title} />
        <meta property="og:description" content={initialItem?.overview} />
        <meta property="og:image" content={initialImgUrl} />
      </Head>
      <div className="lg:max-w-5xl lg:mx-auto">
        <EnteringTop
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
        </EnteringTop>
        <EnteringBottom
          className="relative p-4 z-10 lg:p-8 bg-white rounded-t-lg lg:rounded-none"
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
            key: `movie/${params!.id}`,
          },
        };
      }
    }
  } catch (error) {
    console.error(error);
  }

  const searchResponses = await getApi<SearchMovie>(+params!.id, 'movie');

  const imgResponse = await getImgsApi(
    searchResponses.data[0].movie.ids.tmdb,
    'movie',
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
      initialItem: searchResponses.data[0].movie,
      id: params!.id,
      initialImgUrl,
      key: `movie/${params!.id}`,
    },
  };
};

export default MoviePage;
