import React from 'react';

interface IEmojiProps {
  emoji: string;
  rotating?: boolean;
  className?: string;
  onClick?: any;
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
      className={className + ' ' + (rotating ? 'spin' : '')}
      role="img"
      aria-label="emoji"
    >
      {emoji}
    </span>
  );
}
