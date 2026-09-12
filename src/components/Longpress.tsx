import React, { useContext, useRef } from 'react';
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
  const dispatch = useDispatch();
  const suppressClick = useRef(false);
  const handlers = useLongPress(
    () => {
      if (!session) return;
      suppressClick.current = true;
      dispatch(setGlobalSearch(true));
    },
    { threshold: 400 }
  );

  return (
    <button
      {...handlers()}
      className="select-none [-webkit-touch-callout:none]"
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        navigate('/search');
      }}
    >
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
