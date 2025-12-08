import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from '../state/slices/root';
import { Icon } from './Icon';
import { useTranslate } from '../hooks/useTranslate';
import { useLongPress } from 'use-long-press';
import { AuthContext } from '../contexts/AuthContext';

const LongPress: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { session } = useContext(AuthContext);
  const handlers = useLongPress(
    () => !!session && dispatch(setGlobalSearch(true))
  );

  const dispatch = useDispatch();
  return (
    <button {...handlers()} onClick={() => navigate('/search')}>
      <div className="flex items-center cursor-pointer">
        <Icon name="search" className="h-8" />
        <span className="ml-2 text-base hidden lg:inline capitalize">
          {t('search')}
        </span>
      </div>
    </button>
  );
};

export default LongPress;
