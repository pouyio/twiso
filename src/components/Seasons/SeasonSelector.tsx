import { useTranslate, useWindowSize } from 'hooks';
import React, { useEffect, useRef } from 'react';
import { Season, ShowProgress } from '../../models';
import { motion } from 'framer-motion';

interface ISeasonsProps {
  progress?: ShowProgress;
  seasons: Season[];
  selectedSeason?: Season;
  setSelectedSeason: (season?: number) => void;
}

const Underline: React.FC = () => {
  const { width } = useWindowSize();
  return (
    <motion.div
      layoutId="underline-season"
      className="bg-gray-200 mt-2"
      initial={false}
      style={{
        bottom:
          width < 1024 ? `calc(env(safe-area-inset-bottom) + 4px)` : '4px',
        height: '4px',
      }}
    />
  );
};

const SELECTED_CLASS = 'bg-white text-gray-600';

const SeasonSelector: React.FC<ISeasonsProps> = ({
  progress,
  seasons,
  selectedSeason,
  setSelectedSeason,
}) => {
  const ref = useRef<HTMLUListElement>(null);
  const { t } = useTranslate();

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
      return 'border-b-2';
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
      className="flex overflow-x-auto my-4 -mx-3 relative border-b"
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
            'whitespace-pre mx-1 text-sm px-3 pt-2 cursor-pointer border-gray-200 ' +
            SELECTED_CLASS
          }
        >
          {s.number ? `${t('season')} ${s.number}` : t('specials')}
          {isSeasonWatched(s.number) ? (
            <span className="ml-2 text-gray-600 pb-2">✓</span>
          ) : (
            ''
          )}
          {s.ids.trakt === selectedSeason?.ids.trakt && <Underline />}
        </li>
      ))}
    </ul>
  );
};

export default SeasonSelector;
