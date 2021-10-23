import React, { useContext, useEffect, useState } from 'react';
import { useAppSelector } from 'state/store';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { AuthService } from 'utils/AuthService';
import { ModalContext } from '../../contexts';
import { Episode, Season, ShowProgress } from '../../models';
import {
  addWatchedApi,
  getSeasonEpisodesApi,
  getSeasonsApi,
  removeWatchedApi,
} from '../../utils/api';
import Episodes from './Episodes';
import SeasonSelector from './SeasonSelector';

interface ISeasonsContainerProps {
  showId: number;
  progress?: ShowProgress;
  onUpdateProgress: () => void;
}

const authService = AuthService.getInstance();

const SeasonsContainer: React.FC<ISeasonsContainerProps> = ({
  showId,
  progress,
  onUpdateProgress,
}) => {
  const [selectedSeason, setSelectedSeason] = useQueryParam(
    'season',
    withDefault(NumberParam, undefined)
  );
  const [unTrackedSeasons, setUnTrackedSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[][]>([]);
  const isLogged = authService.isLoggedIn();
  const { toggle } = useContext(ModalContext);
  const language = useAppSelector((state) => state.config.language);

  useEffect(() => {
    getSeasonsApi(showId, language).then(({ data }) =>
      setUnTrackedSeasons(data)
    );
  }, [isLogged, showId, language]);

  useEffect(() => {
    if (selectedSeason === undefined) {
      return;
    }
    if (selectedSeason !== undefined && episodes[selectedSeason]) {
      return;
    }
    getSeasonEpisodesApi(showId, selectedSeason, language).then(({ data }) => {
      setEpisodes((e) => {
        e[selectedSeason] = data;
        return [...e];
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason, showId, language]);

  useEffect(() => {
    setSelectedSeason(progress?.next_episode?.season, 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const addEpisode = (episode: Episode) => {
    addWatchedApi(episode, 'episode').then(onUpdateProgress);
  };

  const removeEpisode = (episode: Episode) => {
    removeWatchedApi(episode, 'episode').then(onUpdateProgress);
  };

  const addSeason = () => {
    addWatchedApi(getFullSeason(selectedSeason)!, 'season').then(
      onUpdateProgress
    );
  };

  const removeSeason = () => {
    removeWatchedApi(getFullSeason(selectedSeason)!, 'season').then(
      onUpdateProgress
    );
  };

  const showModal = ({
    title,
    overview,
  }: {
    title: string;
    overview: string;
  }) => {
    toggle({ title, text: overview });
  };

  const getFullSeason = (season?: number) => {
    return unTrackedSeasons.find((s) => s.number === season);
  };

  return (
    <>
      <SeasonSelector
        seasons={unTrackedSeasons}
        progress={progress}
        selectedSeason={getFullSeason(selectedSeason)}
        setSelectedSeason={(s) => setSelectedSeason(s, 'replace')}
      />
      {selectedSeason !== undefined && (
        <Episodes
          seasonId={
            unTrackedSeasons.find((s) => s.number === selectedSeason)?.ids.trakt
          }
          seasonProgress={progress?.seasons.find(
            (s) => s.number === selectedSeason
          )}
          addEpisodeWatched={addEpisode}
          removeEpisodeWatched={removeEpisode}
          addSeasonWatched={addSeason}
          removeSeasonWatched={removeSeason}
          episodes={episodes[selectedSeason]}
          showModal={showModal}
          onlyView={!isLogged}
        />
      )}
    </>
  );
};

export default SeasonsContainer;
