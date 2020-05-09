import React from 'react';
import Emoji from './Emoji';

export const Empty: React.FC = () => {
  return (
    <li className="bg-gray-100 font-light px-2 py-1 rounded-full mx-1 whitespace-pre text-base">
      Ninguno <Emoji emoji="😵" />
    </li>
  );
};
