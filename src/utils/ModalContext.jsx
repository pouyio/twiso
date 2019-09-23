import React, { useState, createContext } from 'react';
import Modal from '../components/Modal';

const ModalContext = createContext({ session: false });

export const ModalProvider = ({ children, modalRef }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const toggle = ({ title, text }) => {
    setTitle(title);
    setText(text);
    setIsShowing(!isShowing);
  };

  return (
    <ModalContext.Provider value={{ isShowing, toggle, title, text }}>
      {children}
      {modalRef && <Modal modalRef={modalRef} />}
    </ModalContext.Provider>
  );
};

export default ModalContext;
