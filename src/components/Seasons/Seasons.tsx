import React from 'react';
import Emoji from '../Emoji';
import { Season, Episode, ShowProgress } from '../../models';

interface ISeasonsProps {
  progress?: ShowProgress;
  seasons: Season[];
  addEpisodeWatched: (episode: Episode) => void;
  removeEpisodeWatched: (episode: Episode) => void;
  addSeasonWatched: (season: Season) => void;
  removeSeasonWatched: (season: Season) => void;
  selectedSeason?: Season;
  setSelectedSeason: (season: Season) => void;
  showModal: (data: { title: string; overview: string }) => void;
  onlyView: boolean;
}

const Seasons: React.FC<ISeasonsProps> = ({
  progress,
  seasons,
  addEpisodeWatched,
  removeEpisodeWatched,
  addSeasonWatched,
  removeSeasonWatched,
  selectedSeason,
  setSelectedSeason,
  showModal,
  onlyView,
}) => {
  const selectedClass = (season: Season) => {
    if (!selectedSeason) {
      return 'bg-white text-gray-600';
    }
    if (season.ids.trakt === selectedSeason.ids.trakt) {
      return 'bg-gray-200';
    }
    return 'bg-white text-gray-600';
  };

  const isEpisodeWatched = (episodeNumber: number) => {
    if (!progress) {
      return false;
    }
    const foundSeasonProgress = progress.seasons.find(
      (s) => s.number === selectedSeason!.number,
    );
    if (!foundSeasonProgress) {
      return false;
    }
    return (
      foundSeasonProgress.episodes.find((e) => e.number === episodeNumber) || {}
    ).completed;
  };

  const isSeasonWatched = (seasonNumber: number) => {
    if (!progress) {
      return false;
    }
    const foundSeasonProgress = progress.seasons.find(
      (s) => s.number === seasonNumber,
    );
    if (!foundSeasonProgress) {
      return false;
    }
    return (
      foundSeasonProgress.completed === foundSeasonProgress.episodes.length
    );
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
    const seasonAvailable = progress?.seasons.find(
      (s) => s.number === episode.season,
    );
    if (!seasonAvailable) {
      return false;
    }

    return seasonAvailable.episodes.some((e) => e.number === episode.number);
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
      <ul
        className="flex overflow-x-auto my-5 -mr-3"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {seasons.map((s) => (
          <li
            onClick={() => setSelectedSeason(s)}
            key={s.ids.trakt}
            className={
              'whitespace-pre mx-1 rounded-full text-sm px-3 py-2 cursor-pointer border-gray-200 border ' +
              selectedClass(s)
            }
          >
            {s.number ? `Temporada ${s.number}` : 'Especiales'}
            {isSeasonWatched(s.number) ? (
              <span className="ml-2 text-gray-600">✓</span>
            ) : (
              ''
            )}
          </li>
        ))}
      </ul>
      {selectedSeason && selectedSeason.episodes && (
        <>
          <ul className="my-4">
            {selectedSeason.episodes.map((e) => (
              <li
                className="myt-6 py-3 text-sm leading-tight border-b"
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
                          'long',
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
                  {isEpisodeAvailable(e) && (
                    <button
                      className="px-5 text-right"
                      onClick={() => toggleEpisode(e)}
                    >
                      <Emoji emoji="▶️" className="text-xl" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {!onlyView && (
            <div className="flex justify-center">
              {isSeasonWatched(selectedSeason.number) ? (
                <button
                  className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200"
                  onClick={() => removeSeasonWatched(selectedSeason)}
                >
                  Marcar todo como no vistos
                </button>
              ) : (
                <button
                  className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200"
                  onClick={() => addSeasonWatched(selectedSeason)}
                >
                  Marcar todo como vistos
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Seasons;
