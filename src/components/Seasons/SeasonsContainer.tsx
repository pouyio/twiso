import React, { useContext, useEffect, useState } from 'react';
import {
  addEpisodeWatched,
  addSeasonWatched,
  removeEpisodeWatched,
  removeSeasonWatched,
} from 'state/slices/shows/thunks';
import { useAppDispatch, useAppSelector } from 'state/store';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import {
  addWatchedApi,
  addWatchedApis,
  addWatchedEpisodesApi,
  getProgressApi,
  getSeasonEpisodesApi,
  getSeasonsApi,
  removeWatchedApi,
  removeWatchedEpisodesApi,
  removeWatchedSeasonsApi,
} from '../../utils/api';
import Episodes from './Episodes';
import SeasonSelector from './SeasonSelector';
import {
  Episode,
  Season,
  SeasonEpisode,
  Show,
  ShowProgress,
  ShowSeason,
  ShowWatched,
} from '../../models/Show';
import { useSearchParams } from 'react-router';
import { StatusShow } from 'models/Api';
import { firstLoad } from 'state/firstLoadAction';

interface ISeasonsContainerProps {
  show: Show;
  status?: StatusShow;
  showId: string;
}

const SeasonsContainer: React.FC<ISeasonsContainerProps> = ({
  show,
  showId,
  status,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSeason = !searchParams.get('season')
    ? undefined
    : +searchParams.get('season')!;
  const [unTrackedProgress, setUnTrackedProgress] = useState<ShowProgress>();
  const [unTrackedSeasons, setUnTrackedSeasons] = useState<Season[]>([]);
  const [episodesDates, setEpisodesDates] = useState<Episode[][]>([]);
  const { session } = useContext(AuthContext);
  const isLogged = !!session;
  const { toggle } = useContext(ModalContext);
  const dispatch = useAppDispatch();
  const watchedShow = useAppSelector(
    (state) => state.shows.shows[+showId]
  ) as ShowWatched;
  const language = useAppSelector((state) => state.config.language);

  // useEffect(() => {
  //   if (watchedShow) {
  //     return;
  //   }
  //   getSeasonsApi(showId, language).then(({ data }) =>
  //     setUnTrackedSeasons(data)
  //   );
  //   if (isLogged) {
  //     getProgressApi(showId).then(({ data }) => setUnTrackedProgress(data));
  //   }
  // }, [isLogged, showId, watchedShow, language]);

  useEffect(() => {
    if (selectedSeason === undefined) {
      return;
    }
    if (selectedSeason !== undefined && episodesDates[selectedSeason]) {
      return;
    }
    getSeasonEpisodesApi(showId, selectedSeason, language).then(({ data }) => {
      setEpisodesDates((e) => {
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

  const addEpisode = async (episode: SeasonEpisode) => {
    dispatch(addEpisodeWatched({ showIds: show.ids, episodes: [episode] }));
  };

  const removeEpisode = async (episode: SeasonEpisode) => {
    dispatch(
      removeEpisodeWatched({
        showIds: show.ids,
        episodes: [episode.ids],
      })
    );
  };

  const addSeason = async () => {
    if (!selectedSeason) {
      return;
    }
    const episodesToWawtch = episodesDates[selectedSeason].filter(
      (e) => new Date(e.first_aired) < new Date()
    );
    const { data } = await addWatchedEpisodesApi(show.ids, episodesToWawtch);
    firstLoad();
    // if (watchedShow) {
    //   dispatch(
    //     addSeasonWatched({
    //       show: watchedShow,
    //       season: getFullSeason(selectedSeason)!,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     addSeasonWatched({
    //       show: {
    //         show,
    //         progress: unTrackedProgress,
    //         fullSeasons: unTrackedSeasons,
    //       } as unknown as ShowWatched,
    //       season: getFullSeason(selectedSeason)!,
    //     })
    //   );
    // }
  };

  const removeSeason = async () => {
    if (!selectedSeason) {
      return;
    }
    const episodesToWawtch = episodesDates[selectedSeason].filter(
      (e) => new Date(e.first_aired) < new Date()
    );
    const { data } = await removeWatchedEpisodesApi(
      show.ids,
      episodesToWawtch.map((e) => e.ids)
    );
    firstLoad();

    // dispatch(
    //   removeSeasonWatched({
    //     show: watchedShow!,
    //     season: getFullSeason(selectedSeason)!,
    //   })
    // );
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
    return show?.all_seasons?.find((s) => s.number === season);
  };

  return (
    <>
      <SeasonSelector
        seasons={show.all_seasons}
        progress={status}
        selectedSeason={getFullSeason(selectedSeason)}
        setSelectedSeason={(s) =>
          setSearchParams(s !== undefined ? { season: `${s}` } : {}, {
            replace: true,
          })
        }
      />
      {selectedSeason !== undefined && (
        <Episodes
          seasonId={
            show.all_seasons.find((s) => s.number === selectedSeason)?.ids.trakt
          }
          episodesProgress={
            status?.episodes?.filter(
              (e) => e.season_number === selectedSeason
            ) ?? []
          }
          addEpisodeWatched={addEpisode}
          removeEpisodeWatched={removeEpisode}
          addSeasonWatched={addSeason}
          removeSeasonWatched={removeSeason}
          episodes={
            show.all_seasons.find((s) => s.number === selectedSeason)?.episodes
          }
          episodesDates={episodesDates[selectedSeason]}
          showModal={showModal}
          onlyView={!isLogged}
        />
      )}
    </>
  );
};

export default SeasonsContainer;
