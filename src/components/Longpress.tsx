import React from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/slices/root';
import { Icon } from './Icon';
import { useTranslate } from '../hooks/useTranslate';

const LongPress: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  const dispatch = useDispatch();
  return (
    <div role="button" onClick={() => navigate('/search')}>
      {/* <LongPressable
        onShortPress={() => navigate('/search')}
        onLongPress={() => dispatch(setGlobalSearch(true))}
        longPressTime={500}
      > */}
      <div className="flex items-center cursor-pointer">
        <Icon name="search" className="h-8" />
        <span className="ml-2 text-base hidden lg:inline capitalize">
          {t('search')}
        </span>
      </div>
      {/* </LongPressable> */}
    </div>
  );
};

export default LongPress;
