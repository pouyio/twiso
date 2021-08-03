import React from 'react';
import LongPressable from 'react-longpressable';
import { useHistory } from 'react-router-dom';
import Emoji from './Emoji';
import { useDispatch } from 'react-redux';
import { setGlobalSearch } from 'state/slices/root';

const LongPress: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  return (
    <div role="button" onClick={() => history.push('/search')}>
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
    </div>
  );
};

export default LongPress;
