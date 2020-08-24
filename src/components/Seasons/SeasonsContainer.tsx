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
import { useQueryParam, withDefault, NumberParam } from 'use-query-params';

interface ISeasonsContainerProps {
  show: Show;
  showId: number;
}

const SeasonsContainer: React.FC<ISeasonsContainerProps> = ({
  show,
  showId,
}) => {
  const [selectedSeason, setSelectedSeason] = useQueryParam(
    'season',
    withDefault(NumberParam, undefined)
  );
  const [unTrackedProgress, setUnTrackedProgress] = useState<ShowProgress>();
  const [unTrackedSeasons, setUnTrackedSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[][]>([]);
  const { session } = useContext(AuthContext);
  const { toggle } = useContext(ModalContext);
  const dispatch = useDispatch();
  const watchedShow = useSelector((state: IState) =>
    state.shows.watched.find((w) => w.show.ids.trakt === +showId)
  );

  useEffect(() => {
    if (watchedShow) {
      return;
    }
    getSeasonsApi(showId).then(({ data }) => setUnTrackedSeasons(data));
    if (session) {
      getProgressApi(session, showId).then(({ data }) =>
        setUnTrackedProgress(data)
      );
    }
  }, [session, showId, watchedShow]);

  useEffect(() => {
    if (selectedSeason === undefined) {
      return;
    }
    if (selectedSeason !== undefined && episodes[selectedSeason]) {
      return;
    }
    getSeasonEpisodesApi(showId, selectedSeason).then(({ data }) => {
      setEpisodes((e) => {
        e[selectedSeason] = data;
        return [...e];
      });
    });
    // eslint-disable-next-line
  }, [selectedSeason, showId]);

  const watchedShowFullSeasonsRef = watchedShow?.fullSeasons;
  const watchedShowNextEpisodeRef = watchedShow?.progress?.next_episode;
  useEffect(() => {
    if (
      !watchedShowFullSeasonsRef ||
      !watchedShowNextEpisodeRef ||
      selectedSeason
    ) {
      return;
    }
    setSelectedSeason(
      watchedShowFullSeasonsRef.find(
        (s) => s.number === watchedShowNextEpisodeRef.season
      )?.number,
      'replace'
    );
  }, [
    watchedShowFullSeasonsRef,
    watchedShowNextEpisodeRef,
    setSelectedSeason,
    selectedSeason,
  ]);

  const addEpisode = (episode: Episode) => {
    const generatedShow =
      watchedShow ||
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
        show: watchedShow!,
        episode,
        session: session!,
      })
    );
  };

  const addSeason = () => {
    if (watchedShow) {
      dispatch(
        addSeasonWatched({
          show: watchedShow,
          season: getFullSeason(selectedSeason)!,
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
          season: getFullSeason(selectedSeason)!,
          session: session!,
        })
      );
    }
  };

  const removeSeason = () => {
    dispatch(
      removeSeasonWatched({
        show: watchedShow!,
        season: getFullSeason(selectedSeason)!,
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

  const getFullSeason = (season?: number) => {
    return (watchedShow?.fullSeasons ?? unTrackedSeasons)?.find(
      (s) => s.number === season
    );
  };

  return (
    <>
      <SeasonSelector
        seasons={watchedShow?.fullSeasons ?? unTrackedSeasons}
        progress={watchedShow?.progress ?? unTrackedProgress}
        selectedSeason={getFullSeason(selectedSeason)}
        setSelectedSeason={(s) => setSelectedSeason(s, 'replace')}
      />
      {selectedSeason !== undefined && (
        <Episodes
          seasonProgress={(
            watchedShow?.progress ?? unTrackedProgress
          )?.seasons.find((s) => s.number === selectedSeason)}
          addEpisodeWatched={addEpisode}
          removeEpisodeWatched={removeEpisode}
          addSeasonWatched={addSeason}
          removeSeasonWatched={removeSeason}
          episodes={episodes[selectedSeason]}
          showModal={showModal}
          onlyView={!session}
        />
      )}
    </>
  );
};

export default SeasonsContainer;
