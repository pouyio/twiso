import React from 'react';
import Emoji from '../Emoji';

const Seasons = ({
  progress,
  seasons,
  addEpisodeWatched,
  removeEpisodeWatched,
  addSeasonWatched,
  removeSeasonWatched,
  selectedSeason,
  setSelectedSeason,
  showModal,
}) => {
  const selectedClass = season => {
    if (!selectedSeason) {
      return 'bg-white text-gray-600';
    }
    if (season.ids.trakt === selectedSeason.ids.trakt) {
      return 'bg-gray-200';
    }
    return 'bg-white text-gray-600';
  };

  const isEpisodeWatched = episodeNumber => {
    if (!progress) {
      return false;
    }
    const foundSeasonProgress = progress.seasons.find(
      s => s.number === selectedSeason.number,
    );
    if (!foundSeasonProgress) {
      return false;
    }
    return (
      foundSeasonProgress.episodes.find(e => e.number === episodeNumber) || {}
    ).completed;
  };

  const isSeasonWatched = seasonNumber => {
    if (!progress) {
      return false;
    }
    const foundSeasonProgress = progress.seasons.find(
      s => s.number === seasonNumber,
    );
    if (!foundSeasonProgress) {
      return false;
    }
    return (
      foundSeasonProgress.completed === foundSeasonProgress.episodes.length
    );
  };

  const toggleEpisode = episode => {
    if (isEpisodeWatched(episode.number)) {
      removeEpisodeWatched(episode);
    } else {
      addEpisodeWatched(episode);
    }
  };

  return (
    <>
      <ul
        className="flex overflow-x-auto my-5 -mr-3"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {seasons
          .filter(s => s.episodes)
          .map(s => (
            <li
              onClick={() => setSelectedSeason(s)}
              key={s.ids.trakt}
              className={
                'whitespace-pre mx-1 rounded-full text-sm px-3 py-2 cursor-pointer ' +
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
      {selectedSeason && (
        <>
          <ul className="my-4">
            {selectedSeason.episodes.map(e => (
              <li
                className="myt-6 mt-3 pb-4 text-sm leading-tight border-b"
                key={e.ids.trakt}
              >
                <div className="mb-2 flex">
                  <span className="text-gray-600 text-xs font-bold mr-1">
                    {e.number}
                  </span>
                  {isEpisodeWatched(e.number) ? (
                    <span className="text-gray-600 mr-2 ml-1">✓</span>
                  ) : (
                    <span className="text-blue-400 mx-2">•</span>
                  )}
                  <span
                    onClick={() => showModal(e)}
                    className={`flex-grow ${
                      isEpisodeWatched(e.number) ? 'text-gray-600' : ''
                    }`}
                  >
                    {e.title}
                  </span>
                  <button
                    className="px-5 text-right"
                    onClick={() => toggleEpisode(e)}
                  >
                    <Emoji emoji="▶️" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
        </>
      )}
    </>
  );
};

export default Seasons;
