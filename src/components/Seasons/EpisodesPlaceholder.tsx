import React from 'react';

const Li: React.FC = () => (
  <li className="py-3 text-sm leading-tight border-b">
    <div className="flex items-center">
      <span className="w-4 mr-1 bg-gray-200 rounded-full from-gray-300 bg-gradient-to-r animate-pulse h-4 mb-1"></span>
      <span className="mx-2 w-1"></span>
      <div className="flex-grow flex flex-col">
        <span className="w-32 bg-gray-200 rounded-full from-gray-300 bg-gradient-to-r animate-pulse h-3 mb-1"></span>
        <span className="w-16 bg-gray-200 rounded-full from-gray-300 bg-gradient-to-r animate-pulse h-3 mb-1"></span>
      </div>
    </div>
  </li>
);
export const EpisodesPlaceholder = () => {
  return (
    <>
      <Li />
      <Li />
      <Li />
      <Li />
      <Li />
      <Li />
      <Li />
      <Li />
      <Li />
      <Li />
    </>
  );
};
