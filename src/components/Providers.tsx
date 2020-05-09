import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ThemeProvider, AlertProvider, ModalProvider } from 'contexts';

interface IProvidersProp {
  modalRef: HTMLDivElement;
}

export const Providers: React.FC<IProvidersProp> = ({ children, modalRef }) => {
  return (
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <ThemeProvider>
          <AlertProvider>
            <ModalProvider modalRef={modalRef}>{children}</ModalProvider>
          </AlertProvider>
        </ThemeProvider>
      </QueryParamProvider>
    </BrowserRouter>
  );
};
