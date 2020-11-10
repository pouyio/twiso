import React, { useEffect, useRef } from 'react';
import { Season, ShowProgress } from '../../models';

interface ISeasonsProps {
  progress?: ShowProgress;
  seasons: Season[];
  selectedSeason?: Season;
  setSelectedSeason: (season?: number) => void;
}

const SELECTED_CLASS = 'bg-white text-gray-600';

const SeasonSelector: React.FC<ISeasonsProps> = ({
  progress,
  seasons,
  selectedSeason,
  setSelectedSeason,
}) => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!ref.current || !ref.current.children) {
      return;
    }
    const seasonTag = Array.from(ref.current.children).find(
      (c) => !c.classList.toString().includes(SELECTED_CLASS)
    ) as HTMLUListElement;
    if (!seasonTag) {
      return;
    }
    const pRect = ref.current.getBoundingClientRect();
    const cRect = seasonTag.getBoundingClientRect();

    if (!cRect) {
      return;
    }

    ref.current.scrollTo({
      left: seasonTag.offsetLeft - pRect.width / 2 + cRect.width / 2,
      behavior: 'smooth',
    });
  }, [selectedSeason, ref]);

  const selectedClass = (season: Season) => {
    if (!selectedSeason) {
      return SELECTED_CLASS;
    }
    if (season.ids.trakt === selectedSeason.ids.trakt) {
      return 'bg-gray-200';
    }
    return SELECTED_CLASS;
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
      className="flex overflow-x-auto my-5 -mx-3 relative"
      style={{ WebkitOverflowScrolling: 'touch' }}
      ref={ref}
    >
      {seasons.map((s) => (
        <li
          role="button"
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
