import React, { useState, createContext, ReactNode } from 'react';
import Modal from '../components/Modal';

interface IModalContext {
  toggle: (text?: { title: string; text: string }) => void;
  isShowing: boolean;
  title: string;
  text: string;
}

export const ModalContext = createContext<IModalContext>({
  toggle: (_text?: { title: string; text: string }) => {},
  isShowing: false,
  title: '',
  text: '',
});

export const ModalProvider = ({
  children,
  modalRef,
}: {
  children: ReactNode;
  modalRef: HTMLDivElement;
}) => {
  const [isShowing, setIsShowing] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const toggle = (data?: { title: string; text: string }) => {
    if (data) {
      setTitle(data.title);
      setText(data.text);
    }
    setIsShowing(!isShowing);
  };

  return (
    <ModalContext.Provider value={{ isShowing, toggle, title, text }}>
      {children}
      {modalRef && <Modal modalRef={modalRef} />}
    </ModalContext.Provider>
  );
};
