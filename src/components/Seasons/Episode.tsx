import React, { useContext } from 'react';
import Emoji from '../Emoji';
import { Icon } from '../../components/Icon';
import { SeasonEpisode, Episode as EpisodeModel } from '../../models/Show';
import { motion } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthContext';
import { useAppSelector } from '../../state/store';

interface EpisodeProps {
  episode: SeasonEpisode;
  episodeDate: EpisodeModel | undefined;
  watchedEpisodeNumbers: Set<number>;
  isPending: boolean;
  addEpisodeWatched: (episode: SeasonEpisode) => void;
  removeEpisodeWatched: (episode: SeasonEpisode) => void;
  showModal: (data: { title: string; overview: string }) => void;
}

export const Episode: React.FC<EpisodeProps> = ({
  episode,
  episodeDate,
  watchedEpisodeNumbers,
  isPending,
  addEpisodeWatched,
  removeEpisodeWatched,
  showModal,
}) => {
  const { session } = useContext(AuthContext);
  const language = useAppSelector((state) => state.config.language);
  const isEpisodeWatched = watchedEpisodeNumbers.has(episode.number);

  const getTranslated = (string: 'title' | 'overview') => {
    if (language !== 'es') {
      return string === 'title' ? episode.title : episodeDate?.overview ?? '';
    }

    if (episode.translations?.length) {
      return episode.translations[0][string] ?? '';
    }
    return string === 'title' ? episode.title : episode['overview'] ?? '';
  };

  const isEpisodeAvailable = () => {
    if (!session) {
      return false;
    }
    if (!episodeDate) {
      return false;
    }
    return (
      episodeDate.first_aired && new Date(episodeDate.first_aired) < new Date()
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

  const toggleEpisode = () => {
    if (isEpisodeWatched) {
      removeEpisodeWatched(episode);
    } else {
      addEpisodeWatched(episode);
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 5 }}
      className="py-3 text-sm leading-tight"
      key={`${episode.season}_${episode.number}`}
    >
      <div className="flex items-center">
        <span className="text-gray-600 text-xs font-bold mr-1">
          {episode.number}
        </span>
        {isEpisodeAvailable() ? (
          <>
            {isEpisodeWatched ? (
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
              title: getTranslated('title'),
              overview: `${getFormattedDate(
                episodeDate?.first_aired ?? '',
                'long'
              )}\n${getTranslated('overview')}`,
            })
          }
          className={`grow flex flex-col ${
            isEpisodeWatched ? 'text-gray-600' : ''
          }`}
        >
          <span>{getTranslated('title')}</span>
          <span className="text-xs">
            {getFormattedDate(episodeDate?.first_aired ?? '', 'short')}
          </span>
        </div>
        {isEpisodeAvailable() &&
          (isPending ? (
            <Emoji emoji="⏳" rotating={true} className="w-10 text-center" />
          ) : (
            <button className="w-10 flex" onClick={toggleEpisode}>
              <Icon
                name={isEpisodeWatched ? 'cancel' : 'play'}
                className="h-8 m-auto"
              />
            </button>
          ))}
      </div>
    </motion.li>
  );
};
