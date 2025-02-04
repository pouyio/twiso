import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Emoji from './Emoji';
import { useTranslate } from '../hooks/useTranslate';

export const NewVersion: React.FC = () => {
  const { t } = useTranslate();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registered:');
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="alert-container fixed z-10 text-center bg-gray-300 rounded-lg leading-tight flex flex-col overflow-hidden shadow-lg inside whitespace-nowrap">
      <div className="flex px-4 py-2 items-center">
        <span>
          {t('new_version')}{' '}
          <span
            className="cursor-pointer font-bold underline text-gray-700"
            onClick={() => updateServiceWorker()}
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
