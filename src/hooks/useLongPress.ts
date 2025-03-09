import { useState, useRef, useEffect } from 'react';

type LongPressHandlers = {
  onClick: () => void;
  onLongClick: () => void;
};

export const useLongPress = (handlers: LongPressHandlers) => {
  const [action, setAction] = useState<string>('');

  const timerRef = useRef<any>(null);
  const isLongPress = useRef<any>(null);

  const startPressTimer = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction('longpress');
    }, 500);
  };

  const handleOnClick = () => {
    if (isLongPress.current) {
      return;
    }
    setAction('click');
  };

  const handleOnMouseDown = () => {
    startPressTimer();
  };

  const handleOnTouchStart = () => {
    startPressTimer();
  };

  const handleOnMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  const handleOnTouchEnd = () => {
    if (action === 'longpress') return;
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (action === 'click') {
      handlers.onClick();
    } else if (action === 'longpress') {
      handlers.onLongClick();
    }
    setAction('');
  }, [action]);

  return {
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
};
