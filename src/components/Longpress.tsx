import React from 'react';
import LongPressable from 'react-longpressable';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/slices/root';
import { useTranslate } from 'hooks';
import { Icon } from './Icon';

const LongPress: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  const dispatch = useDispatch();
  return (
    <div role="button" onClick={() => navigate('/search')}>
      <LongPressable
        onShortPress={() => navigate('/search')}
        onLongPress={() => dispatch(setGlobalSearch(true))}
        longPressTime={500}
      >
        <div className="flex items-center cursor-pointer">
          <Icon name="search" className="h-8" />
          <span className="ml-2 text-base hidden lg:inline capitalize">
            {t('search')}
          </span>
        </div>
      </LongPressable>
    </div>
  );
};

export default LongPress;
