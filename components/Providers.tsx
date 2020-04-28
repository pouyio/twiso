import React from 'react';
import { ThemeProvider, AlertProvider, ModalProvider } from '../contexts';

interface IProvidersProp {
  modalRef: HTMLDivElement;
}

export const Providers: React.FC<IProvidersProp> = ({ children, modalRef }) => {
  return (
    <ThemeProvider>
      <AlertProvider>
        <ModalProvider modalRef={modalRef}>{children}</ModalProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};
