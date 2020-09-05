import React from 'react';
import LongPressable from 'react-longpressable';
import { useHistory } from 'react-router-dom';
import Emoji from './Emoji';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/store';

const LongPress: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  return (
    <LongPressable
      onShortPress={() => history.push('/search')}
      onLongPress={() => dispatch(setGlobalSearch(true))}
      longPressTime={500}
    >
      <div className="flex items-center cursor-pointer">
        <Emoji emoji="🔍" />
        <span className="ml-2 text-base hidden lg:inline">Buscar</span>
      </div>
    </LongPressable>
  );
};

export default LongPress;
