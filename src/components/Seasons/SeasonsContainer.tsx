import { useSearchParams } from 'hooks';
import React, { useContext, useEffect, useState } from 'react';
import {
  addEpisodeWatched,
  addSeasonWatched,
  removeEpisodeWatched,
  removeSeasonWatched,
} from 'state/slices/shows/thunks';
import { useAppDispatch, useAppSelector } from 'state/store';
import { AuthContext, ModalContext } from '../../contexts';
import { Episode, Season, Show, ShowProgress, ShowWatched } from '../../models';
import {
  getProgressApi,
  getSeasonEpisodesApi,
  getSeasonsApi,
} from '../../utils/api';
import Episodes from './Episodes';
import SeasonSelector from './SeasonSelector';

interface ISeasonsContainerProps {
  show: Show;
  showId: number;
}

const SeasonsContainer: React.FC<ISeasonsContainerProps> = ({
  show,
  showId,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSeason = !searchParams.get('season')
    ? undefined
    : +searchParams.get('season')!;
  const [unTrackedProgress, setUnTrackedProgress] = useState<ShowProgress>();
  const [unTrackedSeasons, setUnTrackedSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[][]>([]);
  const { session } = useContext(AuthContext);
  const isLogged = !!session;
  const { toggle } = useContext(ModalContext);
  const dispatch = useAppDispatch();
  const watchedShow = useAppSelector(
    (state) => state.shows.shows[+showId]
  ) as ShowWatched;
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
    setSearchParams(
      {
        season:
          '' +
          watchedShowFullSeasonsRef.find(
            (s) => s.number === watchedShowNextEpisodeRef.season
          )?.number,
      },
      { replace: true }
    );
  }, [
    watchedShowFullSeasonsRef,
    watchedShowNextEpisodeRef,
    setSearchParams,
    selectedSeason,
  ]);

  const addEpisode = (episode: Episode) => {
    const generatedShow =
      watchedShow ||
      ({
        show,
        progress: unTrackedSeasons,
        fullSeasons: unTrackedSeasons,
      } as unknown as ShowWatched);
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
          show: {
            show,
            progress: unTrackedProgress,
            fullSeasons: unTrackedSeasons,
          } as unknown as ShowWatched,
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
        setSelectedSeason={(s) =>
          setSearchParams({ season: `${s}` }, { replace: true })
        }
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
