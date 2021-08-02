import React, { useState, useEffect, useContext } from 'react';
import {
  getSeasonsApi,
  getSeasonEpisodesApi,
  getProgressApi,
} from '../../utils/api';
import { ModalContext } from '../../contexts';
import { Show, ShowProgress, Season, Episode, ShowWatched } from '../../models';
import { useDispatch } from 'react-redux';
import {
  addEpisodeWatched,
  removeEpisodeWatched,
  addSeasonWatched,
  removeSeasonWatched,
} from 'state/slices/shows/thunks';
import SeasonSelector from './SeasonSelector';
import Episodes from './Episodes';
import { useQueryParam, withDefault, NumberParam } from 'use-query-params';
import { AuthService } from 'utils/AuthService';
import { useAppSelector } from 'state/store';

interface ISeasonsContainerProps {
  show: Show;
  showId: number;
}

const authService = AuthService.getInstance();

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
  const isLogged = authService.isLoggedIn();
  const { toggle } = useContext(ModalContext);
  const dispatch = useDispatch();
  const watchedShow = useAppSelector((state) =>
    state.shows.watched.find((w) => w.show.ids.trakt === +showId)
  );
  const language = useAppSelector((state) => state.config.language);

  useEffect(() => {
    if (watchedShow) {
      return;
    }
    getSeasonsApi(showId, language).then(({ data }) =>
      setUnTrackedSeasons(data)
    );
    if (isLogged) {
      getProgressApi(showId).then(({ data }) => setUnTrackedProgress(data));
    }
  }, [isLogged, showId, watchedShow, language]);

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
    // eslint-disable-next-line
  }, [selectedSeason, showId, language]);

  const watchedShowFullSeasonsRef = watchedShow?.fullSeasons;
  const watchedShowNextEpisodeRef = watchedShow?.progress?.next_episode;
  useEffect(() => {
    if (
      !watchedShowFullSeasonsRef ||
      !watchedShowNextEpisodeRef ||
      selectedSeason !== undefined
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
    dispatch(addEpisodeWatched({ show: generatedShow, episode }));
  };

  const removeEpisode = (episode: Episode) => {
    dispatch(
      removeEpisodeWatched({
        show: watchedShow!,
        episode,
      })
    );
  };

  const addSeason = () => {
    if (watchedShow) {
      dispatch(
        addSeasonWatched({
          show: watchedShow,
          season: getFullSeason(selectedSeason)!,
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
        })
      );
    }
  };

  const removeSeason = () => {
    dispatch(
      removeSeasonWatched({
        show: watchedShow!,
        season: getFullSeason(selectedSeason)!,
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
          seasonId={
            (watchedShow?.fullSeasons ?? unTrackedSeasons).find(
              (s) => s.number === selectedSeason
            )?.ids.trakt
          }
          seasonProgress={(
            watchedShow?.progress ?? unTrackedProgress
          )?.seasons.find((s) => s.number === selectedSeason)}
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
