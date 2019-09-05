import React, { useState } from 'react';

const MAX_LENGTH = 200;

export default function CollapsableText({ children = '', className }) {

    const [opened, setOpened] = useState(false);

    const toggleOpened = () => setOpened(o => !o);

    return (
        <div>
            <p className={className}>
                {children.length > MAX_LENGTH
                    ? opened
                        ? children
                        : `${children.slice(0, MAX_LENGTH)} ...`
                    : children}
            </p>
            {children.length > MAX_LENGTH && <span className="float-right text-blue-500" onClick={toggleOpened}>Mostrar {opened ? 'menos' : 'más'}</span>}
        </div>
    );

}