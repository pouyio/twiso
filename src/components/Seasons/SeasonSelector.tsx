import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTranslate } from '../../hooks/useTranslate';
import { ShowSeason } from '../../models/Show';
import { ShowStatusComplete } from '../../models/Api';

interface ISeasonsProps {
  progress?: ShowStatusComplete;
  seasons: ShowSeason[];
  selectedSeason?: ShowSeason;
  setSelectedSeason: (season?: number) => void;
}

const Underline: React.FC = () => {
  return (
    <motion.div
      layoutId="underline-season"
      className="absolute bottom-0 w-full bg-gray-200 h-1"
      initial={false}
    />
  );
};

const UNSELECTED_CLASS = 'bg-white text-gray-600';

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
      (c) => !c.classList.toString().includes(UNSELECTED_CLASS)
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

  const isSeasonWatched = (seasonNumber: number) => {
    if (!progress) {
      return false;
    }
    const foundSeasonProgress =
      progress.episodes?.filter((e) => e.season_number === seasonNumber) ?? [];
    if (!foundSeasonProgress.length) {
      return false;
    }
    const foundSeasonDetail = seasons.find((s) => s.number === seasonNumber);
    if (!foundSeasonDetail) {
      return false;
    }
    return foundSeasonProgress.length === foundSeasonDetail.episodes.length;
  };

  return (
    <ul
      className="flex gap-1 overflow-x-auto -mx-3 relative border-b"
      style={{ WebkitOverflowScrolling: 'touch' }}
      ref={ref}
    >
      {seasons.map((s) => {
        return (
          <li
            role="button"
            onClick={() =>
              setSelectedSeason(
                selectedSeason?.number === s.number ? undefined : s.number
              )
            }
            key={s.ids.trakt}
            className={
              'whitespace-pre text-sm px-3 cursor-pointer ' +
              (selectedSeason?.number === s.number ? '' : UNSELECTED_CLASS)
            }
          >
            {s.number ? `${t('season')} ${s.number}` : t('specials')}
            {isSeasonWatched(s.number) ? (
              <span className="ml-2 text-gray-600 pb-2">✓</span>
            ) : (
              ''
            )}
            <div className="h-2 relative">
              {s.ids.trakt === selectedSeason?.ids.trakt && <Underline />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SeasonSelector;
