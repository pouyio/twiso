import React, { useState, useEffect, useContext } from 'react';
import { getShowSeasons, addShowEpisodeWatched, removeShowEpisodeWatched, getShowProgress } from '../../utils/api';
import AuthContext from '../../utils/AuthContext';
import Seasons from './Seasons';

const SeasonsContainer = ({ show, showId }) => {

    const [progress, setProgress] = useState(false);
    const { session } = useContext(AuthContext);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        getShowProgress(session, showId).then(({ data }) => setProgress(data));
    }, [session, showId]);

    useEffect(() => {
        getShowSeasons(show.ids.trakt).then(({ data }) => setSeasons(data))
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

    const addEpisodeWatched = (episode) => {
        addShowEpisodeWatched(episode, session).then(() => updateEpisode(episode, true));
    }

    const removeEpisodeWatched = (episode) => {
        removeShowEpisodeWatched(episode, session).then(() => updateEpisode(episode, false));
    }

    return (
        <Seasons
            seasons={seasons}
            progress={progress}
            addEpisodeWatched={addEpisodeWatched}
            removeEpisodeWatched={removeEpisodeWatched}
        />
    );
}

export default SeasonsContainer;