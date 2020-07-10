import React, { useState, useEffect, useContext } from 'react';
import {
  getSeasonsApi,
  getSeasonEpisodesApi,
  getProgressApi,
} from '../../utils/api';
import { ModalContext, AuthContext } from '../../contexts';
import { Show, ShowProgress, Season, Episode, ShowWatched } from '../../models';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEpisodeWatched,
  removeEpisodeWatched,
  addSeasonWatched,
  removeSeasonWatched,
} from '../../state/slices/showsSlice';
import { IState } from 'state/state';
import SeasonSelector from './SeasonSelector';
import Episodes from './Episodes';

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
  const { session } = useContext(AuthContext);
  const { toggle } = useContext(ModalContext);
  const dispatch = useDispatch();
  const watchedShow = useSelector((state: IState) =>
    state.shows.watched.find((w) => w.show.ids.trakt === +showId)
  );

  useEffect(() => {
    setSelectedSeason(undefined);
    setLocalShow(undefined);
  }, [showId]);

  useEffect(() => {
    if (watchedShow) {
      setLocalShow(watchedShow);
    }
  }, [watchedShow]);

  useEffect(() => {
    if (localShow) {
      return;
    }
    getSeasonsApi(showId).then(({ data }) => setUnTrackedSeasons(data));
    if (session) {
      getProgressApi(session, showId).then(({ data }) =>
        setUnTrackedProgress(data)
      );
    }
  }, [session, showId, localShow]);

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
          copy.fullSeasons[i].episodes = data;
          return copy;
        });
      }
    });
    // eslint-disable-next-line
  }, [selectedSeason, showId]);

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

  const addEpisode = (episode: Episode) => {
    const generatedShow =
      localShow ||
      (({
        show,
        progress: unTrackedSeasons,
        fullSeasons: unTrackedSeasons,
      } as unknown) as ShowWatched);
    dispatch(
      addEpisodeWatched({ show: generatedShow, episode, session: session! })
    );
  };

  const removeEpisode = (episode: Episode) => {
    dispatch(
      removeEpisodeWatched({
        show: localShow!,
        episode,
        session: session!,
      })
    );
  };

  const addSeason = () => {
    if (localShow) {
      dispatch(
        addSeasonWatched({
          show: localShow,
          season: selectedSeason!,
          session: session!,
        })
      );
    } else {
      dispatch(
        addSeasonWatched({
          show: ({
            show,
            progress: unTrackedProgress,
            fullSeasons: unTrackedSeasons,
          } as unknown) as ShowWatched,
          season: selectedSeason!,
          session: session!,
        })
      );
    }
  };
  const removeSeason = () => {
    dispatch(
      removeSeasonWatched({
        show: localShow!,
        season: selectedSeason!,
        session: session!,
      })
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
    <>
      <SeasonSelector
        seasons={localShow?.fullSeasons ?? unTrackedSeasons}
        progress={localShow?.progress ?? unTrackedProgress}
        selectedSeason={selectedSeason}
        setSelectedSeason={selectSeason}
      />
      {selectedSeason && (
        <Episodes
          seasonProgress={(
            localShow?.progress ?? unTrackedProgress
          )?.seasons.find((s) => s.number === selectedSeason.number)}
          addEpisodeWatched={addEpisode}
          removeEpisodeWatched={removeEpisode}
          addSeasonWatched={addSeason}
          removeSeasonWatched={removeSeason}
          episodes={selectedSeason.episodes}
          showModal={showModal}
          onlyView={!session}
        />
      )}
    </>
  );
};

export default SeasonsContainer;
