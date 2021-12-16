import { useTranslate } from 'hooks';
import React from 'react';
import Emoji from './Emoji';

interface INewVersionProps {
  update: () => void;
  close: () => void;
}

export const NewVersion: React.FC<INewVersionProps> = ({ update, close }) => {
  const { t } = useTranslate();
  return (
    <div className="alert-container fixed z-10 text-center bg-gray-300 bg-white rounded-lg leading-tight flex flex-col overflow-hidden shadow-lg inside whitespace-nowrap">
      <div className="flex px-4 py-2 items-center">
        <span>
          {t('new_version')}{' '}
          <span
            className="cursor-pointer font-bold font-bold underline text-gray-700"
            onClick={update}
          >
            {t('update')}
          </span>
        </span>
        <span className="pl-4" onClick={close}>
          <Emoji emoji="❌" className="cursor-pointer" />
        </span>
      </div>
    </div>
  );
};
