import React from 'react';
import { Link } from 'react-router-dom';
import Emoji from './Emoji';
import { IPeople } from '../models/IPeople';

interface IPeopleProps {
  people: IPeople;
  type: 'movie' | 'show';
}

const People: React.FC<IPeopleProps> = ({
  people: { cast = [], crew = {} },
  type,
}) => {
  return (
    <>
      <div className="my-4">
        <p>Reparto:</p>
        <ul
          className="flex overflow-x-auto my-2 -mx-4 lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {cast.length ? (
            cast.map((character, i) => (
              <li key={i} className="my-1">
                <Link
                  to={{
                    pathname: `/person/${character.person.ids.trakt}`,
                    search: `?slug=${character.person.ids.slug}`,
                  }}
                >
                  <div className="bg-gray-200 font-light px-2 py-1 rounded-full mx-1 whitespace-pre flex flex-col text-center">
                    <span>{character.person.name}</span>
                    <small>{character.character}</small>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <span className="bg-gray-200 inline-block my-2 font-light px-2 py-1 rounded-full">
              Ninguno <Emoji emoji="😵" />
            </span>
          )}
        </ul>
      </div>

      {type === 'movie' && (
        <div className="my-4">
          <p>Dirección:</p>
          <ul
            className="flex overflow-x-auto my-2 -mx-4 lg:overflow-auto lg:flex-wrap lg:justify-start"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {(crew.directing || [])
              .filter(crew => crew.job.toLowerCase() === 'director')
              .map((crew, i: number) => (
                <li key={i} className="my-1">
                  <Link
                    to={{
                      pathname: `/person/${crew.person.ids.trakt}`,
                      search: `?slug=${crew.person.ids.slug}`,
                    }}
                  >
                    <div className="bg-gray-200 font-light px-2 py-1 rounded-full mx-1 whitespace-pre">
                      {crew.person.name}
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default People;
