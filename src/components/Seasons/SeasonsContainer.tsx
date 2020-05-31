import React, { useState, useEffect, useContext } from 'react';
import {
  getSeasonsApi,
  getSeasonEpisodesApi,
  getProgressApi,
} from '../../utils/api';
import Seasons from './Seasons';
import { ModalContext, AuthContext } from '../../contexts';
import { Show, ShowProgress, Season, Episode, ShowWatched } from '../../models';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEpisodeWatched as addEpisodeWatchedAction,
  removeEpisodeWatched as removeEpisodeWatchedAction,
  addSeasonWatched as addSeasonWatchedAction,
  removeSeasonWatched as removeSeasonWatchedAction,
} from '../../state/slices/showsSlice';
import { IState } from 'state/state';

interface ISeasonsContainerProps {
  show: Show;
  showId: number;
}

const SeasonsContainer: React.FC<ISeasonsContainerProps> = ({
  show,
  showId,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season>();
  const [unTrackedProgress, setUnTrackedProgress] = useState<ShowProgress>();
  const [unTrackedSeasons, setUnTrackedSeasons] = useState<Season[]>([]);
  const [localShow, setLocalShow] = useState<ShowWatched>();
  const [fullShow, setFullShow] = useState<ShowWatched>();
  const { session } = useContext(AuthContext);
  const { toggle } = useContext(ModalContext);
  const dispatch = useDispatch();
  const watched = useSelector((state: IState) => state.shows.watched);

  useEffect(() => {
    setFullShow(watched.find((w) => w.show.ids.trakt === +showId));
  }, [setFullShow, watched, showId]);

  useEffect(() => {
    setLocalShow(fullShow);
    setSelectedSeason(undefined);
  }, [fullShow, showId, watched]);

  useEffect(() => {
    if (fullShow) {
      return;
    }
    getSeasonsApi(showId).then(({ data }) => setUnTrackedSeasons(data));
    if (session) {
      getProgressApi(session, showId).then(({ data }) =>
        setUnTrackedProgress(data)
      );
    }
  }, [session, showId, fullShow]);

  useEffect(() => {
    if (!selectedSeason) {
      return;
    }
    if (selectedSeason && selectedSeason.episodes) {
      return;
    }
    getSeasonEpisodesApi(showId, selectedSeason.number).then(({ data }) => {
      if (!localShow) {
        setUnTrackedSeasons((us) => {
          const i = us.findIndex((s) => s.number === selectedSeason.number);
          us[i].episodes = data;
          return [...us];
        });
      } else {
        setLocalShow((ls) => {
          if (!ls) {
            return;
          }
          const i = ls!.fullSeasons!.findIndex(
            (s) => s.number === selectedSeason.number
          );
          const copy = JSON.parse(JSON.stringify(ls));
          copy.fullSeasons![i].episodes = data;
          return copy;
        });
      }
    });
  }, [selectedSeason, showId, localShow]);

  const localShowFullSeasonsRef = localShow?.fullSeasons;
  const localShowNextEpisodeRef = localShow?.progress?.next_episode;
  useEffect(() => {
    if (!localShowFullSeasonsRef || !localShowNextEpisodeRef) {
      return;
    }
    setSelectedSeason(
      localShowFullSeasonsRef.find(
        (s) => s.number === localShowNextEpisodeRef.season
      )
    );
  }, [localShowFullSeasonsRef, localShowNextEpisodeRef]);

  const addEpisodeWatched = (episode: Episode) => {
    if (fullShow) {
      dispatch(
        addEpisodeWatchedAction({ show: fullShow, episode, session: session! })
      );
    } else {
      // fix for watching first episode and no ShowWatched is present yet
      dispatch(
        addEpisodeWatchedAction({
          show: ({
            show,
            progress: unTrackedSeasons,
            fullSeasons: unTrackedSeasons,
          } as unknown) as ShowWatched,
          episode,
          session: session!,
        })
      );
    }
  };

  const removeEpisodeWatched = (episode: Episode) => {
    dispatch(
      removeEpisodeWatchedAction({
        show: fullShow!,
        episode,
        session: session!,
      })
    );
  };

  const addSeasonWatched = (season: Season) => {
    if (fullShow) {
      dispatch(
        addSeasonWatchedAction({ show: fullShow, season, session: session! })
      );
    } else {
      dispatch(
        addSeasonWatchedAction({
          show: ({
            show,
            progress: unTrackedProgress,
            fullSeasons: unTrackedSeasons,
          } as unknown) as ShowWatched,
          season,
          session: session!,
        })
      );
    }
  };
  const removeSeasonWatched = (season: Season) => {
    const fullShow = watched.find((w) => w.show.ids.trakt === show.ids.trakt);
    dispatch(
      removeSeasonWatchedAction({ show: fullShow!, season, session: session! })
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
      seasons={fullShow?.fullSeasons ?? unTrackedSeasons}
      progress={fullShow?.progress ?? unTrackedProgress}
      addEpisodeWatched={addEpisodeWatched}
      removeEpisodeWatched={removeEpisodeWatched}
      addSeasonWatched={addSeasonWatched}
      removeSeasonWatched={removeSeasonWatched}
      selectedSeason={selectedSeason}
      setSelectedSeason={selectSeason}
      showModal={showModal}
      onlyView={!session}
    />
  );
};

export default SeasonsContainer;
