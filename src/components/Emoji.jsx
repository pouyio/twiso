import React from 'react';

export default function Emoji({ emoji, rotating, className , onClick}) {

    return <span onClick={onClick} className={className + ' ' + (rotating ? 'spin' : '')} role="img" aria-label="emoji">{emoji}</span>;

}