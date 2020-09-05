import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import './collapsable-text.css';

interface ICollapsableTextProps {
  children: string;
}

const isOverflown = (element: HTMLParagraphElement | null) => {
  if (!element) {
    return false;
  }

  const isOverflowing =
    element.clientHeight < element.scrollHeight ||
    element.clientHeight > 7 * 16;

  return isOverflowing;
};
const CollapsableText: React.FC<ICollapsableTextProps> = ({
  children = '',
}) => {
  const [opened, setOpened] = useState(false);
  const [isButtonShown, setIsButtonShown] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    setOpened(false);
    setIsButtonShown(isOverflown(ref.current));
  }, [children]);

  return (
    <div className="flex flex-col">
      <motion.p
        ref={ref}
        className={`leading-tight font-light overflow-hidden relative ${
          isButtonShown && !opened ? 'collapsable-text' : ''
        }`}
        initial={false}
        {...(isButtonShown
          ? { animate: { height: opened ? 'auto' : '7rem' } }
          : {})}
      >
        {children}
      </motion.p>
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

export default CollapsableText;
