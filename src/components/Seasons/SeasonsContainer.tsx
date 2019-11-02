import React, { useState, useEffect, useContext } from 'react';
import {
  getSeasonsApi,
  addWatchedApi,
  removeWatchedApi,
  getProgressApi,
  getSeasonEpisodesApi,
} from '../../utils/api';
import AuthContext from '../../utils/AuthContext';
import Seasons from './Seasons';
import UserContext from '../../utils/UserContext';
import ModalContext from '../../utils/ModalContext';
import { Show, ShowProgress, Season, Episode } from '../../models';

interface ISeasonsContainerProps {
  show: Show;
  showId: number;
}

const SeasonsContainer: React.FC<ISeasonsContainerProps> = ({
  show,
  showId,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season>();
  const [progress, setProgress] = useState<ShowProgress>();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const { session } = useContext(AuthContext);
  const { removeWatchlistShow, showUpdated } = useContext(UserContext)!;
  const { toggle } = useContext(ModalContext);

  useEffect(() => {
    getProgressApi(session!, showId).then(({ data }) => setProgress(data));
  }, [session, showId]);

  useEffect(() => {
    getSeasonsApi(show.ids.trakt).then(({ data }) => setSeasons(data));
  }, [show.ids.trakt]);

  useEffect(() => {
    if (!selectedSeason) {
      return;
    }
    if (selectedSeason && selectedSeason.episodes) {
      return;
    }
    getSeasonEpisodesApi(show.ids.trakt, selectedSeason.number).then(
      ({ data }) => {
        setSeasons(seas => {
          const i = seas.findIndex(s => s.number === selectedSeason.number);
          seas[i].episodes = data;
          return [...seas];
        });
      },
    );
  }, [selectedSeason, show.ids.trakt]);

  useEffect(() => {
    setSelectedSeason(undefined);
    if (!progress) {
      return;
    }
    if (
      progress.next_episode &&
      progress.next_episode.season &&
      !(
        progress.next_episode.season === 1 && progress.next_episode.number === 1
      )
    ) {
      setSelectedSeason(
        seasons.find(s => s.number === progress.next_episode.season),
      );
    }
    // eslint-disable-next-line
  }, [progress]);

  const updateEpisode = (episode: Episode, completed: boolean) => {
    if (!progress) {
      return;
    }
    const seasonIndex = progress.seasons.findIndex(
      s => s.number === episode.season,
    );
    const episodeIndex = progress.seasons[seasonIndex].episodes.findIndex(
      e => e.number === episode.number,
    );
    setProgress(prev => {
      if (!prev) {
        return;
      }
      prev.seasons[seasonIndex].episodes[episodeIndex].completed = completed;
      prev.seasons[seasonIndex].completed =
        prev.seasons[seasonIndex].completed + (completed ? 1 : -1);
      return { ...prev };
    });
  };

  const updateSeason = (season: Season, completed: boolean) => {
    const seasonIndex = progress!.seasons.findIndex(
      s => s.number === season.number,
    );
    setProgress(prev => {
      if (!prev) {
        return;
      }
      prev.seasons[seasonIndex].episodes = prev.seasons[
        seasonIndex
      ].episodes.map(e => ({ ...e, completed }));
      prev.seasons[seasonIndex].completed =
        prev.seasons[seasonIndex].episodes.length;
      return { ...prev };
    });
  };

  const addEpisodeWatched = (episode: Episode) => {
    addWatchedApi(episode, session!, 'episode').then(() => {
      updateEpisode(episode, true);
      removeWatchlistShow([show]);
      showUpdated(show);
    });
  };

  const removeEpisodeWatched = (episode: Episode) => {
    removeWatchedApi(episode, session!, 'episode').then(() => {
      updateEpisode(episode, false);
      showUpdated(show);
    });
  };

  const addSeasonWatched = (season: Season) => {
    addWatchedApi(season, session!, 'season').then(() => {
      updateSeason(season, true);
      removeWatchlistShow([show]);
    });
  };
  const removeSeasonWatched = (season: Season) => {
    removeWatchedApi(season, session!, 'season').then(() =>
      updateSeason(season, false),
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

  const selectSeason = (season: Season) => {
    if (!season) {
      return;
    }
    if (!selectedSeason) {
      setSelectedSeason(season);
      return;
    }
    if (selectedSeason.ids.trakt === season.ids.trakt) {
      setSelectedSeason(undefined);
      return;
    }
    setSelectedSeason(season);
  };

  return (
    <Seasons
      seasons={seasons}
      progress={progress}
      addEpisodeWatched={addEpisodeWatched}
      removeEpisodeWatched={removeEpisodeWatched}
      addSeasonWatched={addSeasonWatched}
      removeSeasonWatched={removeSeasonWatched}
      selectedSeason={selectedSeason}
      setSelectedSeason={selectSeason}
      showModal={showModal}
    />
  );
};

export default SeasonsContainer;
