import React, { useState, useEffect, useContext } from 'react';
import { getSeasonsApi, addWatchedApi, removeWatchedApi, getProgressApi, getSeasonApi } from '../../utils/api';
import AuthContext from '../../utils/AuthContext';
import Seasons from './Seasons';

const SeasonsContainer = ({ show, showId }) => {

    const [progress, setProgress] = useState(false);
    const { session } = useContext(AuthContext);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        getProgressApi(session, showId).then(({ data }) => setProgress(data));
    }, [session, showId]);

    useEffect(() => {
        getSeasonsApi(show.ids.trakt).then(({ data }) => setSeasons(data))
    }, [show.ids.trakt]);

    const updateEpisode = (episode, completed) => {
        const seasonIndex = progress.seasons.findIndex(s => s.number === episode.season);
        const episodeIndex = progress.seasons[seasonIndex].episodes.findIndex(e => e.number === episode.number);
        setProgress((prev) => {
            prev.seasons[seasonIndex].episodes[episodeIndex].completed = completed;
            prev.seasons[seasonIndex].completed = prev.seasons[seasonIndex].completed + (completed ? 1 : -1);
            return { ...prev };
        });
    }

    const updateSeason = (season, completed) => {
        const seasonIndex = progress.seasons.findIndex(s => s.number === season.number);
        setProgress((prev) => {
            prev.seasons[seasonIndex].episodes = prev.seasons[seasonIndex].episodes.map(e => ({...e, completed}));
            prev.seasons[seasonIndex].completed = prev.seasons[seasonIndex].episodes.length;
            return { ...prev };
        });
    }

    const addEpisodeWatched = (episode) => {
        addWatchedApi(episode, session, 'episode').then(() => updateEpisode(episode, true));
    }

    const removeEpisodeWatched = (episode) => {
        removeWatchedApi(episode, session, 'episode').then(() => updateEpisode(episode, false));
    }

    const addSeasonWatched = (season) => {
        addWatchedApi(season, session, 'season').then(() => updateSeason(season, true));
    }
    const removeSeasonWatched = (season) => {
        removeWatchedApi(season, session, 'season').then(() => updateSeason(season, false));
    }

    const getSeasonDetails = (season) => {
        return getSeasonApi(showId, season);
    }

    return (
        <Seasons
            seasons={seasons}
            progress={progress}
            getSeasonDetails={getSeasonDetails}
            addEpisodeWatched={addEpisodeWatched}
            removeEpisodeWatched={removeEpisodeWatched}
            addSeasonWatched={addSeasonWatched}
            removeSeasonWatched={removeSeasonWatched}
        />
    );
}

export default SeasonsContainer;