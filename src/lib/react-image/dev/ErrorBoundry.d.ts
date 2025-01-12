import React, { Component } from 'react';
export interface ErrorBoundary {
    props: {
        children: React.ReactNode;
        onError?: React.ReactNode;
    };
}
export declare class ErrorBoundary extends Component implements ErrorBoundary {
    state: {
        hasError: boolean;
        error: Error | null;
    };
    onError: React.ReactNode;
    constructor(props: any);
    static getDerivedStateFromError(error: any): {
        hasError: any;
        error: any;
    };
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
}
