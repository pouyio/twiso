import React, { useContext } from 'react';
import Emoji from '../Emoji';
import { EpisodesPlaceholder } from './EpisodesPlaceholder';
import { useAppSelector } from 'state/store';
import { Icon } from 'components/Icon';
import { useTranslate } from '../../hooks/useTranslate';
import { Episode, SeasonEpisode } from '../../models/Show';
import { EpisodeStatus } from 'models/Api';
import { AuthContext } from 'contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

interface ISeasonsProps {
  episodesProgress: EpisodeStatus[];
  addEpisodeWatched: (episode: SeasonEpisode) => void;
  removeEpisodeWatched: (episode: SeasonEpisode) => void;
  addSeasonWatched: () => void;
  removeSeasonWatched: () => void;
  episodes?: SeasonEpisode[];
  episodesDates?: Episode[];
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
  const { session } = useContext(AuthContext);
  const watched = useAppSelector((state) => state.shows.pending.watched);
  const language = useAppSelector((state) => state.config.language);
  const { t } = useTranslate();

  const isEpisodeWatched = (episodeNumber: number) => {
    if (!episodesProgress.length) {
      return false;
    }
    return episodesProgress.find((e) => e.episode_number === episodeNumber);
  };

  const isSeasonWatched = () => {
    if (!episodesProgress) {
      return false;
    }
    const episodesAvailable = episodesDates.filter(
      (e) => new Date(e.first_aired) < new Date()
    );
    return episodesProgress.length === episodesAvailable.length;
  };

  const toggleEpisode = (episode: SeasonEpisode) => {
    if (isEpisodeWatched(episode.number)) {
      removeEpisodeWatched(episode);
    } else {
      addEpisodeWatched(episode);
    }
  };

  const getTranslated = (
    string: 'title' | 'overview',
    episode: SeasonEpisode
  ) => {
    if (episode.translations.length) {
      return episode.translations[0][string] ?? '';
    }
    return string === 'title' ? episode.title : '';
  };

  const isEpisodeAvailable = (number: number) => {
    if (!session) {
      return false;
    }
    const foundEpisode = episodesDates.find((e) => e.number === number);
    if (!foundEpisode) {
      return false;
    }
    return (
      foundEpisode.first_aired &&
      new Date(foundEpisode.first_aired) < new Date()
    );
  };

  const getFormattedDate = (date: string, size: 'long' | 'short') => {
    return date
      ? new Date(date).toLocaleDateString(language, {
          year: 'numeric',
          month: size,
          day: 'numeric',
        })
      : '-';
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
      <ul>
        {!episodes.length ? (
          <EpisodesPlaceholder />
        ) : (
          episodes.map((e) => (
            <AnimatePresence key={e.ids.imdb || e.number}>
              <motion.li
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="py-3 text-sm leading-tight"
                key={e.ids.imdb || e.number}
              >
                <div className="flex items-center">
                  <span className="text-gray-600 text-xs font-bold mr-1">
                    {e.number}
                  </span>
                  {isEpisodeAvailable(e.number) ? (
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
                          episodesDates.find((ed) => ed.number === e.number)
                            ?.first_aired ?? '',
                          'long'
                        )}\n${getTranslated('overview', e)}`,
                      })
                    }
                    className={`grow flex flex-col ${
                      isEpisodeWatched(e.number) ? 'text-gray-600' : ''
                    }`}
                  >
                    <span>{getTranslated('title', e)}</span>
                    <span className="text-xs">
                      {getFormattedDate(
                        episodesDates.find((ed) => ed.number === e.number)
                          ?.first_aired ?? '',
                        'short'
                      )}
                    </span>
                  </div>
                  {isEpisodeAvailable(e.number) &&
                    (watched.find(
                      (w) =>
                        w.episode === e.number &&
                        w.season === e.season &&
                        w.showId === showId
                    ) ? (
                      <Emoji
                        emoji="⏳"
                        rotating={true}
                        className="w-10 text-center"
                      />
                    ) : (
                      <button
                        className="w-10 flex"
                        onClick={() => toggleEpisode(e)}
                      >
                        <Icon name="play" className="h-8 m-auto" />
                      </button>
                    ))}
                </div>
              </motion.li>
            </AnimatePresence>
          ))
        )}
      </ul>
      {!onlyView && (
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
