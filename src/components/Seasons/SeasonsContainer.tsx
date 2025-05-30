import React, { useContext, useEffect, useState } from 'react';
import {
  addEpisodeWatched,
  removeEpisodeWatched,
} from 'state/slices/shows/thunks';
import { useAppDispatch, useAppSelector } from 'state/store';
import { AuthContext } from '../../contexts/AuthContext';
import { ModalContext } from '../../contexts/ModalContext';
import { getSeasonEpisodesApi } from '../../utils/api';
import Episodes from './Episodes';
import SeasonSelector from './SeasonSelector';
import { Episode, SeasonEpisode, Show } from '../../models/Show';
import { useSearchParams } from 'react-router';
import { ShowStatusComplete } from 'models/Api';

interface ISeasonsContainerProps {
  show: Show;
  status?: ShowStatusComplete;
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
  const [episodesDates, setEpisodesDates] = useState<Episode[][]>([]);
  const { session } = useContext(AuthContext);
  const isLogged = !!session;
  const { toggle } = useContext(ModalContext);
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.config.language);

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
    dispatch(
      addEpisodeWatched({ showIds: show.ids, episodes: episodesToWawtch })
    );
  };

  const removeSeason = async () => {
    if (!selectedSeason) {
      return;
    }
    const episodesToWawtch = episodesDates[selectedSeason].filter(
      (e) => new Date(e.first_aired) < new Date()
    );
    dispatch(
      removeEpisodeWatched({
        showIds: show.ids,
        episodes: episodesToWawtch.map((e) => e.ids),
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
