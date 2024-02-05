import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ThemeProvider,
  AlertProvider,
  ModalProvider,
  AuthProvider,
} from 'contexts';

interface IProvidersProp {
  modalRef: HTMLDivElement;
}

export const Providers: React.FC<React.PropsWithChildren<IProvidersProp>> = ({
  children,
  modalRef,
}) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AlertProvider>
            <ModalProvider modalRef={modalRef}>{children}</ModalProvider>
          </AlertProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
