import React from 'react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AlertProvider } from '../contexts/AlertContext';
import { ModalProvider } from '../contexts/ModalContext';
import { AuthProvider } from '../contexts/AuthContext';
import * as Sentry from '@sentry/react';

interface IProvidersProp {}

export const Providers: React.FC<React.PropsWithChildren<IProvidersProp>> = ({
  children,
}) => {
  return (
    <Sentry.ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AlertProvider>
              <ModalProvider>{children}</ModalProvider>
            </AlertProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  );
};
