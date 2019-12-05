import React, { useState, useEffect, useContext } from 'react';
import {
  getSeasonsApi,
  getSeasonEpisodesApi,
  getProgressApi,
} from '../../utils/api';
import AuthContext from '../../utils/AuthContext';
import Seasons from './Seasons';
import ModalContext from '../../utils/ModalContext';
import { Show, ShowProgress, Season, Episode } from '../../models';
import { useGlobalState } from '../../state/store';

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
  const { toggle } = useContext(ModalContext);
  const {
    state: {
      userInfo: {
        shows: { watched },
      },
    },
    actions: {
      addEpisodeWatched: addEpisodeWatchedAction,
      removeEpisodeWatched: removeEpisodeWatchedAction,
      addSeasonWatched: addSeasonWatchedAction,
      removeSeasonWatched: removeSeasonWatchedAction,
    },
  } = useGlobalState();

  useEffect(() => {
    const fullShow = watched.find(w => w.show.ids.trakt === +showId);
    if (fullShow && fullShow.progress) {
      setProgress(fullShow.progress);
      if (fullShow && fullShow.fullSeasons) {
        setSeasons(fullShow.fullSeasons);
      } else {
        getSeasonsApi(showId).then(({ data }) => setSeasons(data));
      }
    } else {
      getProgressApi(session!, showId).then(({ data }) => {
        setProgress(data);
      });
      getSeasonsApi(showId).then(({ data }) => setSeasons(data));
    }
  }, [session, showId, watched]);

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
  }, [progress, seasons]);

  const addEpisodeWatched = (episode: Episode) => {
    const fullShow = watched.find(w => w.show.ids.trakt === show.ids.trakt);
    if (fullShow) {
      addEpisodeWatchedAction(fullShow, episode, session!);
    } else {
      addEpisodeWatchedAction(
        // TODO temporary fix when watching first episode
        { show, progress, fullSeasons: seasons } as any,
        episode,
        session!,
      );
    }
  };

  const removeEpisodeWatched = (episode: Episode) => {
    const fullShow = watched.find(w => w.show.ids.trakt === show.ids.trakt);
    removeEpisodeWatchedAction(fullShow!, episode, session!);
  };

  const addSeasonWatched = (season: Season) => {
    const fullShow = watched.find(w => w.show.ids.trakt === show.ids.trakt);
    if (fullShow) {
      addSeasonWatchedAction(fullShow, season, session!);
    } else {
      addSeasonWatchedAction(
        { show, progress, fullSeasons: seasons } as any,
        season,
        session!,
      );
    }
  };
  const removeSeasonWatched = (season: Season) => {
    const fullShow = watched.find(w => w.show.ids.trakt === show.ids.trakt);
    removeSeasonWatchedAction(fullShow!, season, session!);
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
