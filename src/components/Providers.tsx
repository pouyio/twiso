import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, AlertProvider, ModalProvider } from 'contexts';

interface IProvidersProp {
  modalRef: HTMLDivElement;
}

export const Providers: React.FC<React.PropsWithChildren<IProvidersProp>> = ({
  children,
  modalRef,
}) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AlertProvider>
          <ModalProvider modalRef={modalRef}>{children}</ModalProvider>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
