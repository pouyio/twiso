import React, { useState, createContext, ReactNode } from 'react';
import Modal from '../components/Modal';

type Data =
  | {
      title: string;
      text: string;
      custom?: never;
    }
  | {
      title?: never;
      text?: never;
      custom: React.ReactNode;
    };

interface IModalContext {
  toggle: (data?: Data) => void;
  isShowing: boolean;
  title?: string;
  text?: string;
  custom?: React.ReactNode;
}

export const ModalContext = createContext<IModalContext>({
  toggle: () => {},
  isShowing: false,
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [data, setData] = useState<Data>();

  const toggle = (data?: Data) => {
    setData(data);
    setIsShowing(!isShowing);
  };

  return (
    <ModalContext
      value={{
        isShowing,
        toggle,
        title: data?.title,
        text: data?.text,
        custom: data?.custom,
      }}
    >
      {children}
      <Modal />
    </ModalContext>
  );
};
