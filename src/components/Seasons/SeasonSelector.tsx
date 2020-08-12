import React from 'react';
import { Season, ShowProgress } from '../../models';

interface ISeasonsProps {
  progress?: ShowProgress;
  seasons: Season[];
  selectedSeason?: Season;
  setSelectedSeason: (season?: number) => void;
}

const SeasonSelector: React.FC<ISeasonsProps> = ({
  progress,
  seasons,
  selectedSeason,
  setSelectedSeason,
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

  const isSeasonWatched = (seasonNumber: number) => {
    if (!progress) {
      return false;
    }
    const foundSeasonProgress = progress.seasons.find(
      (s) => s.number === seasonNumber
    );
    if (!foundSeasonProgress) {
      return false;
    }
    return (
      foundSeasonProgress.completed === foundSeasonProgress.episodes.length
    );
  };

  return (
    <ul
      className="flex overflow-x-auto my-5 -mx-3"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {seasons.map((s) => (
        <li
          onClick={() =>
            setSelectedSeason(
              selectedSeason?.number === s.number ? undefined : s.number
            )
          }
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
  );
};

export default SeasonSelector;
