import React from 'react';

export default function Emoji({ emoji, rotating, className = '' , ...props}) {

    return <span {...props} className={className + ' ' + (rotating ? 'spin' : '')} role="img" aria-label="emoji">{emoji}</span>;

}