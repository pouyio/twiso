import React, { useState, useEffect, useContext } from 'react';
import { getSeasons, addWatched, removeWatched, getProgress } from '../../utils/api';
import AuthContext from '../../utils/AuthContext';
import Seasons from './Seasons';

const SeasonsContainer = ({ show, showId }) => {

    const [progress, setProgress] = useState(false);
    const { session } = useContext(AuthContext);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        getProgress(session, showId).then(({ data }) => setProgress(data));
    }, [session, showId]);

    useEffect(() => {
        getSeasons(show.ids.trakt).then(({ data }) => setSeasons(data))
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
        addWatched(episode, session, 'episode').then(() => updateEpisode(episode, true));
    }

    const removeEpisodeWatched = (episode) => {
        removeWatched(episode, session, 'episode').then(() => updateEpisode(episode, false));
    }

    const addSeasonWatched = (season) => {
        addWatched(season, session, 'season').then(() => updateSeason(season, true));
    }
    const removeSeasonWatched = (season) => {
        removeWatched(season, session, 'season').then(() => updateSeason(season, false));
    }

    return (
        <Seasons
            seasons={seasons}
            progress={progress}
            addEpisodeWatched={addEpisodeWatched}
            removeEpisodeWatched={removeEpisodeWatched}
            addSeasonWatched={addSeasonWatched}
            removeSeasonWatched={removeSeasonWatched}
        />
    );
}

export default SeasonsContainer;