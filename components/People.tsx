import Link from 'next/link';
import React from 'react';
import Emoji from './Emoji';
import { People as IPeople } from '../models';

interface IPeopleProps {
  people?: IPeople;
  type: 'movie' | 'show';
}

const placeHolders = [
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
                <li key={i} className="my-1 cursor-pointer">
                  <Link
                    href={{
                      pathname: '/person/[id]',
                      query: {
                        slug: character.person.ids.slug,
                      },
                    }}
                    as={{
                      pathname: `/person/${character.person.ids.trakt}`,
                      query: {
                        slug: character.person.ids.slug,
                      },
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
              <li
                key="none"
                className="bg-gray-200 inline-block my-2 font-light px-2 py-1 rounded-full"
              >
                Ninguno <Emoji emoji="😵" />
              </li>
            )
          ) : (
            placeHolders
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
            {(crew?.directing || [])
              .filter((crew) => crew.job.toLowerCase() === 'director')
              .map((crew, i: number) => (
                <li key={i} className="my-1">
                  <Link
                    href={{
                      pathname: `/person/[id]`,
                      search: `?slug=${crew.person.ids.slug}`,
                    }}
                    as={`/person/${crew.person.ids.trakt}?slug=${crew.person.ids.slug}`}
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
