import React from 'react';
import { Link } from 'react-router-dom';
import { People as IPeople } from '../models';
import { Empty } from './Empty';

const placeholders = [
  <li
    key="placeholder-1"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-32 h-12"
  ></li>,
  <li
    key="placeholder-2"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-40 h-12"
  ></li>,
  <li
    key="placeholder-3"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-20 h-12"
  ></li>,
  <li
    key="placeholder-4"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-32 h-12"
  ></li>,
  <li
    key="placeholder-5"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-40 h-12"
  ></li>,
  <li
    key="placeholder-6"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-32 h-12"
  ></li>,
  <li
    key="placeholder-7"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-24 h-12"
  ></li>,
  <li
    key="placeholder-8"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-32 h-12"
  ></li>,
  <li
    key="placeholder-9"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-24 h-12"
  ></li>,
  <li
    key="placeholder-10"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-32 h-12"
  ></li>,
  <li
    key="placeholder-11"
    className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-40 h-12"
  ></li>,
];

interface IPeopleProps {
  people?: IPeople;
  type: 'movie' | 'show';
}

const People: React.FC<IPeopleProps> = ({ people, type }) => {
  const cast = people?.cast ?? [];
  const crew = people?.crew;

  return (
    <>
      <div className="my-4">
        <p>Reparto:</p>
        <ul
          className="flex overflow-x-auto my-2 -mx-4 lg:mx-0 lg:overflow-auto lg:flex-wrap lg:justify-start"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {people ? (
            cast.length ? (
              cast.map((character, i) => (
                <li key={i} className="my-1">
                  <Link
                    to={{
                      pathname: `/person/${character.person.ids.trakt}`,
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
              <Empty />
            )
          ) : (
            placeholders
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
            {people ? (
              crew?.directing && crew.directing.length ? (
                crew.directing
                  .filter(crew => crew.job.toLowerCase() === 'director')
                  .map((crew, i: number) => (
                    <li key={i} className="my-1">
                      <Link
                        to={{
                          pathname: `/person/${crew.person.ids.trakt}`,
                        }}
                      >
                        <div className="bg-gray-200 font-light px-2 py-1 rounded-full mx-1 whitespace-pre">
                          {crew.person.name}
                        </div>
                      </Link>
                    </li>
                  ))
              ) : (
                <Empty />
              )
            ) : (
              <li className="my-1">
                <div className="my-1 bg-gray-200 font-light rounded-full mx-1 whitespace-pre flex flex-col flex-shrink-0 text-center w-40 h-10"></div>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default People;
