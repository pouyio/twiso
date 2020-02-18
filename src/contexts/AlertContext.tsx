import React, { createContext, ReactNode, useState } from 'react';

export const DEFAULT_TIME = 5000;

export const AlertContext = createContext<{
  showAlert: (text: string) => void;
  opened: boolean;
  text: string;
  close: () => void;
}>({
  showAlert: text => null,
  opened: false,
  text: '',
  close: () => null,
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [opened, setOpened] = useState(false);
  const [text, setText] = useState('');
  const [toRef, setToRef] = useState();
  const showAlert = (text: string) => {
    setText(text);
    setOpened(true);
    setToRef(
      setTimeout(() => {
        setOpened(false);
      }, DEFAULT_TIME),
    );
  };

  const close = () => {
    clearTimeout(toRef);
    setOpened(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert, opened, text, close }}>
      {children}
    </AlertContext.Provider>
  );
};
