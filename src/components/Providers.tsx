import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'contexts/ThemeContext';
import { AlertProvider } from 'contexts/AlertContext';
import { ModalProvider } from 'contexts/ModalContext';
import { AuthProvider } from '../contexts/AuthContext';

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
