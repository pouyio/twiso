import React from 'react';

interface IEmojiProps {
  emoji: string;
  rotating?: boolean;
  className?: string;
  [key: string]: any;
}

export default function Emoji({
  emoji,
  rotating = false,
  className = '',
  ...props
}: IEmojiProps) {
  return (
    <span
      {...props}
      className={className + ' ' + (rotating ? 'animate-spin' : '')}
      role="img"
      aria-label="emoji"
    >
      {emoji}
    </span>
  );
}
