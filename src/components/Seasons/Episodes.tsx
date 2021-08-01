import React from 'react';
import Emoji from '../Emoji';
import { Episode, Season } from '../../models';
import { EpisodesPlaceholder } from './EpisodesPlaceholder';
import { useAppSelector } from 'state/store';

interface ISeasonsProps {
  seasonProgress?: Season;
  addEpisodeWatched: (episode: Episode) => void;
  removeEpisodeWatched: (episode: Episode) => void;
  addSeasonWatched: () => void;
  removeSeasonWatched: () => void;
  episodes?: Episode[];
  showModal: (data: { title: string; overview: string }) => void;
  onlyView: boolean;
  seasonId?: number;
}

const Episodes: React.FC<ISeasonsProps> = ({
  seasonProgress,
  addEpisodeWatched,
  removeEpisodeWatched,
  addSeasonWatched,
  removeSeasonWatched,
  episodes = [],
  showModal,
  onlyView,
  seasonId = 0,
}) => {
  const watched = useAppSelector((state) => state.shows.pending.watched);
  const pendings = useAppSelector((state) => state.shows.pending.seasons);

  const isEpisodeWatched = (episodeNumber: number) => {
    if (!seasonProgress) {
      return false;
    }
    return (
      seasonProgress.episodes.find((e) => e.number === episodeNumber) || {}
    ).completed;
  };

  const isSeasonWatched = () => {
    if (!seasonProgress) {
      return false;
    }
    return seasonProgress.completed === seasonProgress.episodes.length;
  };

  const toggleEpisode = (episode: Episode) => {
    if (isEpisodeWatched(episode.number)) {
      removeEpisodeWatched(episode);
    } else {
      addEpisodeWatched(episode);
    }
  };

  const getTranslated = (string: 'title' | 'overview', episode: Episode) => {
    if (episode.translations.length) {
      return episode.translations[0][string] ?? '';
    }
    return string === 'title' ? episode.title : '';
  };

  const isEpisodeAvailable = (episode: Episode) => {
    if (!seasonProgress) {
      return false;
    }

    return seasonProgress.episodes.some((e) => e.number === episode.number);
  };

  const getFormattedDate = (date: string, size: 'long' | 'short') => {
    return date
      ? new Date(date).toLocaleDateString('es', {
          year: 'numeric',
          month: size,
          day: 'numeric',
        })
      : '-';
  };

  return (
    <>
      <ul className="my-4">
        {!episodes.length ? (
          <EpisodesPlaceholder />
        ) : (
          episodes.map((e) => (
            <li
              className="py-3 text-sm leading-tight border-b"
              key={e.ids.trakt}
            >
              <div className="flex items-center">
                <span className="text-gray-600 text-xs font-bold mr-1">
                  {e.number}
                </span>
                {isEpisodeAvailable(e) ? (
                  <>
                    {isEpisodeWatched(e.number) ? (
                      <span className="text-gray-600 mr-2 ml-1">✓</span>
                    ) : (
                      <span className="text-blue-400 mx-2">•</span>
                    )}
                  </>
                ) : (
                  <span className="text-blue-400 mx-2 opacity-0	">•</span>
                )}
                <div
                  onClick={() =>
                    showModal({
                      title: getTranslated('title', e),
                      overview: `${getFormattedDate(
                        e.first_aired,
                        'long'
                      )}\n${getTranslated('overview', e)}`,
                    })
                  }
                  className={`flex-grow flex flex-col ${
                    isEpisodeWatched(e.number) ? 'text-gray-600' : ''
                  }`}
                >
                  <span>{getTranslated('title', e)}</span>
                  <span className="text-xs">
                    {getFormattedDate(e.first_aired, 'short')}
                  </span>
                </div>
                {isEpisodeAvailable(e) &&
                  (watched.includes(e.ids.trakt) ? (
                    <Emoji
                      emoji="⏳"
                      rotating={true}
                      className="px-5 text-right"
                    />
                  ) : (
                    <button
                      className="px-5 text-right"
                      onClick={() => toggleEpisode(e)}
                    >
                      <Emoji emoji="▶️" className="text-xl" />
                    </button>
                  ))}
              </div>
            </li>
          ))
        )}
      </ul>
      {!onlyView && (
        <div className="flex justify-center">
          {isSeasonWatched() ? (
            <button
              className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200"
              onClick={() => removeSeasonWatched()}
            >
              Marcar todo como no vistos{' '}
              {pendings.includes(seasonId) && (
                <Emoji
                  emoji="⏳"
                  rotating={true}
                  className="inline-flex ml-2"
                />
              )}
            </button>
          ) : (
            <button
              className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200"
              onClick={() => addSeasonWatched()}
            >
              Marcar todo como vistos
              {pendings.includes(seasonId) && (
                <Emoji
                  emoji="⏳"
                  rotating={true}
                  className="inline-flex ml-2"
                />
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Episodes;
