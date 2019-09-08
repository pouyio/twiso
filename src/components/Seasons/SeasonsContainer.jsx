import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  getSeasonsApi,
  addWatchedApi,
  removeWatchedApi,
  getProgressApi,
  getSeasonApi,
  getEpisodeTranslationApi,
} from '../../utils/api';
import AuthContext from '../../utils/AuthContext';
import Seasons from './Seasons';
import UserContext from '../../utils/UserContext';
import ModalContext from '../../utils/ModalContext';

const SeasonsContainer = ({ show, showId }) => {
  const [selectedSeason, setSelectedSeason] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState([]);
  const [progress, setProgress] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const { session } = useContext(AuthContext);
  const { removeWatchlistLocal } = useContext(UserContext);
  const { toggle } = useContext(ModalContext);

  useEffect(() => {
    getProgressApi(session, showId).then(({ data }) => setProgress(data));
  }, [session, showId]);

  useEffect(() => {
    getSeasonsApi(show.ids.trakt).then(({ data }) => setSeasons(data));
  }, [show.ids.trakt]);

  useEffect(() => {
    if (
      progress.next_episode &&
      progress.next_episode.season &&
      progress.next_episode.season !== 1 &&
      progress.next_episode.episode !== 1
    ) {
      setSelectedSeason(
        seasons.find(s => s.number === progress.next_episode.season),
      );
    }
  }, [progress.next_episode, seasons]);

  const updateEpisode = (episode, completed) => {
    const seasonIndex = progress.seasons.findIndex(
      s => s.number === episode.season,
    );
    const episodeIndex = progress.seasons[seasonIndex].episodes.findIndex(
      e => e.number === episode.number,
    );
    setProgress(prev => {
      prev.seasons[seasonIndex].episodes[episodeIndex].completed = completed;
      prev.seasons[seasonIndex].completed =
        prev.seasons[seasonIndex].completed + (completed ? 1 : -1);
      return { ...prev };
    });
  };

  const updateSeason = (season, completed) => {
    const seasonIndex = progress.seasons.findIndex(
      s => s.number === season.number,
    );
    setProgress(prev => {
      prev.seasons[seasonIndex].episodes = prev.seasons[
        seasonIndex
      ].episodes.map(e => ({ ...e, completed }));
      prev.seasons[seasonIndex].completed =
        prev.seasons[seasonIndex].episodes.length;
      return { ...prev };
    });
  };

  const addEpisodeWatched = episode => {
    addWatchedApi(episode, session, 'episode').then(() => {
      updateEpisode(episode, true);
      removeWatchlistLocal([{ show: { ...show } }], 'show');
    });
  };

  const removeEpisodeWatched = episode => {
    removeWatchedApi(episode, session, 'episode').then(() =>
      updateEpisode(episode, false),
    );
  };

  const addSeasonWatched = season => {
    addWatchedApi(season, session, 'season').then(() => {
      updateSeason(season, true);
      removeWatchlistLocal([{ show: { ...show } }], 'show');
    });
  };
  const removeSeasonWatched = season => {
    removeWatchedApi(season, session, 'season').then(() =>
      updateSeason(season, false),
    );
  };

  const getEpisodeDescription = episode => {
    return (seasonDetails.find(s => s.number === episode) || {}).overview;
  };

  const showModal = episode => {
    let title = episode.title;
    let text = getEpisodeDescription(episode.number);
    toggle({ title, text });
    getEpisodeTranslationApi(showId, episode.season, episode.number).then(
      ({ data }) => {
        if (data[0]) {
          title = data[0].title || title;
          text = data[0].overview || text;
          toggle({ title, text });
        }
      },
    );
  };

  const selectSeason = useCallback(
    season => {
      setSeasonDetails([]);
      if (!season) {
        return;
      }
      if (!selectedSeason) {
        setSelectedSeason(season);
        getSeasonApi(showId, season.number).then(({ data }) => {
          setSeasonDetails(data);
        });
        return;
      }
      if (selectedSeason.ids.trakt === season.ids.trakt) {
        setSelectedSeason(false);
        return;
      }
      setSelectedSeason(season);
      getSeasonApi(showId, season.number).then(({ data }) => {
        setSeasonDetails(data);
      });
    },
    [selectedSeason, showId],
  );

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
