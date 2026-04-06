import React from 'react';
import Emoji from '../Emoji';
import { EmptySeason } from './EmptySeason';
import { Episode } from './Episode';
import { useAppSelector } from '../../state/store';
import { useTranslate } from '../../hooks/useTranslate';
import { SeasonEpisode, Episode as EpisodeModel } from '../../models/Show';
import { EpisodeStatus } from '../../models/Api';
import { AnimatePresence, motion } from 'framer-motion';

interface ISeasonsProps {
  episodesProgress: EpisodeStatus[];
  addEpisodeWatched: (episode: SeasonEpisode) => void;
  removeEpisodeWatched: (episode: SeasonEpisode) => void;
  addSeasonWatched: () => void;
  removeSeasonWatched: () => void;
  episodes: SeasonEpisode[];
  episodesDates?: EpisodeModel[];
  showModal: (data: { title: string; overview: string }) => void;
  onlyView: boolean;
  showId: string;
}

const Episodes: React.FC<ISeasonsProps> = ({
  episodesProgress,
  addEpisodeWatched,
  removeEpisodeWatched,
  addSeasonWatched,
  removeSeasonWatched,
  episodes = [],
  episodesDates = [],
  showModal,
  onlyView,
  showId,
}) => {
  const watched = useAppSelector((state) => state.shows.pending.watched);
  const { t } = useTranslate();

  const watchedEpisodeNumbers = new Set(
    episodesProgress.map((e) => e.episode_number)
  );

  const isSeasonWatched = () => {
    if (!episodesProgress) {
      return false;
    }
    const episodesAvailable = episodesDates.filter(
      (e) => new Date(e.first_aired) < new Date()
    );
    return episodesProgress.length === episodesAvailable.length;
  };

  const pendingSeason = !!(
    watched.length &&
    watched.some((w) =>
      episodes.find(
        (e) =>
          showId === w.showId && e.number === w.episode && w.season === e.season
      )
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <AnimatePresence key={showId}>
        <ul>
          {!episodes.length ? (
            <EmptySeason />
          ) : (
            episodes.map((e) => {
              const isPending = watched.some(
                (w) =>
                  w.episode === e.number &&
                  w.season === e.season &&
                  w.showId === showId
              );
              return (
                <Episode
                  key={`${e.season}_${e.number}`}
                  episode={e}
                  episodeDate={episodesDates.find(
                    (ed) => ed.number === e.number
                  )}
                  watchedEpisodeNumbers={watchedEpisodeNumbers}
                  isPending={isPending}
                  addEpisodeWatched={addEpisodeWatched}
                  removeEpisodeWatched={removeEpisodeWatched}
                  showModal={showModal}
                />
              );
            })
          )}
        </ul>
      </AnimatePresence>
      {!onlyView && !!episodes.length && (
        <div className="flex justify-center">
          {isSeasonWatched() ? (
            <button
              disabled={pendingSeason}
              className={`disabled:opacity-50 mx-1 rounded-full text-sm px-3 py-2 bg-gray-200`}
              onClick={() => removeSeasonWatched()}
            >
              {t('mark_not_watched')}
              <Emoji
                emoji="⏳"
                rotating={true}
                className={`${pendingSeason ? 'inline-flex' : 'hidden'} ml-2`}
              />
            </button>
          ) : (
            <button
              disabled={pendingSeason}
              className="disabled:opacity-50 mx-1 rounded-full text-sm px-3 py-2 bg-gray-200"
              onClick={() => addSeasonWatched()}
            >
              {t('mark_watched')}
              <Emoji
                emoji="⏳"
                rotating={true}
                className={`${pendingSeason ? 'inline-flex' : 'hidden'} ml-2`}
              />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Episodes;
