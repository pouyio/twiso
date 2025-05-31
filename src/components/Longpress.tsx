import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/slices/root';
import { Icon } from './Icon';
import { useTranslate } from '../hooks/useTranslate';
import { useLongPress } from '../hooks/useLongPress';
import { AuthContext } from 'contexts/AuthContext';

const LongPress: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { session } = useContext(AuthContext);
  const { handlers } = useLongPress({
    onClick: () => navigate('/search'),
    onLongClick: () => !!session && dispatch(setGlobalSearch(true)),
  });

  const dispatch = useDispatch();
  return (
    <div role="button" {...handlers}>
      <div className="flex items-center cursor-pointer">
        <Icon name="search" className="h-8" />
        <span className="ml-2 text-base hidden lg:inline capitalize">
          {t('search')}
        </span>
      </div>
    </div>
  );
};

export default LongPress;
