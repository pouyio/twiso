import React, { useContext } from 'react';
import Emoji from '../Emoji';
import './Alert.css';
import AlertContext from 'utils/AlertContext';

export const Alert: React.FC = () => {
  const { text, opened, close } = useContext(AlertContext);

  return (
    <div
      className={`alert-container fixed z-10 text-center bg-gray-300 bg-white rounded-lg leading-tight flex flex-col overflow-hidden shadow-lg ${
        opened ? 'inside' : 'outside'
      }`}
    >
      <div className="flex px-4 py-2 items-center">
        <span>{text}</span>
        <span className="pl-4">
          <Emoji emoji="❌" className="cursor-pointer" onClick={close} />
        </span>
      </div>
      <div
        className={`w-full h-1 bg-gray-800 progress ${
          opened ? 'full' : 'empty'
        }`}
      />
    </div>
  );
};
