import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import './collapsable.css';

interface ICollapsableProps {
  heightInRem: number;
  disable?: boolean;
}

const isOverflown = (
  element: HTMLParagraphElement | null,
  heightInRem: number
) => {
  if (!element) {
    return false;
  }

  const isOverflowing =
    element.clientHeight < element.scrollHeight ||
    element.clientHeight > heightInRem * 16;

  return isOverflowing;
};
const Collapsable: React.FC<ICollapsableProps> = ({
  heightInRem,
  children,
  disable,
}) => {
  const [opened, setOpened] = useState(false);
  const [isButtonShown, setIsButtonShown] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setOpened(false);
    setIsButtonShown(isOverflown(ref.current, heightInRem));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return disable ? (
    <>{children}</>
  ) : (
    <div className="flex flex-col">
      <motion.div
        ref={ref}
        className={`leading-tight font-light overflow-hidden relative ${
          isButtonShown && !opened ? 'collapsable' : ''
        }`}
        initial={false}
        {...(isButtonShown
          ? { animate: { height: opened ? 'auto' : `${heightInRem}rem` } }
          : {})}
      >
        {children}
      </motion.div>
      {isButtonShown && (
        <span
          className="text-right text-blue-500 cursor-pointer"
          onClick={() => setOpened((o) => !o)}
        >
          Mostrar {opened ? 'menos' : 'más'}
        </span>
      )}
    </div>
  );
};

export default Collapsable;
