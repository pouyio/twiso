import React, { useState, useEffect, useCallback } from 'react';

const Seasons = ({
    progress,
    seasons,
    addEpisodeWatched,
    removeEpisodeWatched,
    addSeasonWatched,
    removeSeasonWatched
}) => {

    const [currentSeason, setCurrentSeason] = useState(false);

    const selectSeason = useCallback((season) => {
        if (!currentSeason) {
            setCurrentSeason(season);
            return;
        }
        if (currentSeason.ids.trakt === season.ids.trakt) {
            setCurrentSeason(false);
            return;
        }
        setCurrentSeason(season);
    }, [currentSeason]);

    useEffect(() => {
        if (progress.next_episode) {
            selectSeason(seasons.find(s => s.number === progress.next_episode.season));
        }
    }, [progress.next_episode]);

    const selectedClass = (season) => {
        if (!currentSeason) {
            return 'bg-white text-gray-600';
        }
        if (season.ids.trakt === currentSeason.ids.trakt) {
            return 'bg-gray-200';
        }
        return 'bg-white text-gray-600';
    }

    const isEpisodeWatched = (episodeNumber) => {
        const foundSeasonProgress = progress.seasons.find(s => s.number === currentSeason.number);
        if (!foundSeasonProgress) {
            return false;
        }
        return (foundSeasonProgress.episodes.find(e => e.number === episodeNumber) || {}).completed;
    }

    const isSeasonWatched = (seasonNumber) => {
        if (!progress) {
            return false;
        }
        const foundSeasonProgress = progress.seasons.find(s => s.number === seasonNumber);
        if (!foundSeasonProgress) {
            return false;
        }
        return foundSeasonProgress.completed === foundSeasonProgress.episodes.length;
    }

    const toggleEpisode = (episode) => {
        if (isEpisodeWatched(episode.number)) {
            removeEpisodeWatched(episode);
        } else {
            addEpisodeWatched(episode);
        }
    }

    return (
        <>
            <ul className="flex overflow-x-auto my-5 -mr-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                {seasons.filter(s => s.episodes).map(s => (
                    <li onClick={() => selectSeason(s)} key={s.ids.trakt} className={'whitespace-pre mx-1 rounded-full text-sm px-3 py-2 ' + selectedClass(s)}>
                        {s.number ? `Temporada ${s.number}` : 'Especiales'}
                        {isSeasonWatched(s.number) ? <span className="ml-2 text-gray-600">✓</span> : ''}
                    </li>
                ))}
            </ul>
            {currentSeason &&
                <>
                    <ul className="my-4">
                        {currentSeason.episodes.map(e => (
                            <li className="myt-6 mt-3 pb-8 text-sm leading-tight border-b" key={e.ids.trakt} onClick={() => toggleEpisode(e)}>
                                <span className="text-gray-600 text-xs font-bold mr-1">{e.number}</span>
                                {isEpisodeWatched(e.number) ? <span className="text-gray-600 mr-2 ml-1">✓</span> : <span className="text-blue-400 mx-2">•</span>}
                                <span className={isEpisodeWatched(e.number) ? 'text-gray-600' : ''}>{e.title}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center">
                        {
                            isSeasonWatched(currentSeason.number) ?
                                <button className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200" onClick={() => removeSeasonWatched(currentSeason)}>Marcar todo como no vistos</button>
                                : <button className="mx-1 rounded-full text-sm px-3 py-2 bg-gray-200" onClick={() => addSeasonWatched(currentSeason)}>Marcar todo como vistos</button>
                        }
                    </div>
                </>}
        </>
    );
}

export default Seasons;