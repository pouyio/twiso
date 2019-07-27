import React from 'react';

export default function Emoji({ emoji, rotating }) {

    return <span className={rotating ? 'spin' : ''} role="img" aria-label="emoji">{emoji}</span>;

}