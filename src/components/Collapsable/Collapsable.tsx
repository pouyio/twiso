import { motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import './collapsable.css';
import { useTranslate } from '../../hooks/useTranslate';

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
    element.clientHeight + 1 < element.scrollHeight ||
    element.clientHeight > heightInRem * 16;

  return isOverflowing;
};
const Collapsable: React.FC<React.PropsWithChildren<ICollapsableProps>> = ({
  heightInRem,
  children,
}) => {
  const [opened, setOpened] = useState(false);
  const [isButtonShown, setIsButtonShown] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const { t } = useTranslate();

  useEffect(() => {
    setOpened(false);
    setIsButtonShown(isOverflown(ref.current, heightInRem));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <>
      <div className="visible lg:hidden">{children}</div>
      <div className="lg:flex flex-col hidden lg:visible">
        <motion.div
          ref={ref}
          className={`leading-tight font-light overflow-hidden relative ${
            isButtonShown && !opened ? 'collapsable' : ''
          }`}
          initial={{
            height: isButtonShown
              ? opened
                ? 'auto'
                : `${heightInRem}rem`
              : undefined,
          }}
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
            {t('to_show', opened ? '-' : '+')}
          </span>
        )}
      </div>
    </>
  );
};

export default Collapsable;
