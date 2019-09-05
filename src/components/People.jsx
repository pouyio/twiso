import React from 'react';

const People = ({
    people: { cast = [], crew = {} },
    type
}) => {

    return (
        <>
            <div className="my-4">
                <p>Reparto:</p>
                <ul className="flex overflow-x-auto my-2 -mx-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {cast.map((character, i) => (
                        <li key={i}>
                            <div className="bg-gray-200 font-light px-3 py-2 rounded-full mx-1 whitespace-pre flex flex-col text-center">
                                <span>{character.person.name}</span>
                                <small>{character.character}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {
                type === 'movie' && (
                    <div className="my-4">
                        <p>Dirección:</p>
                        <ul className="flex overflow-x-auto my-2 -mx-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {(crew.directing || [])
                                .filter(crew => crew.job.toLowerCase() === 'director')
                                .map((crew, i) => (
                                    <li key={i}>
                                        <div className="bg-gray-200 font-light px-3 py-2 rounded-full mx-1 whitespace-pre">
                                            {crew.person.name}
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )
            }

        </>


    );
}

export default People;