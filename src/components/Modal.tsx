import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ModalContext } from '../contexts/ModalContext';

interface IModalProps {}

const Modal: React.FC<IModalProps> = () => {
  const { isShowing, toggle, title, text, custom } = useContext(ModalContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${theme} ${
        isShowing ? '' : 'hidden'
      } fixed w-full h-full top-0 left-0 flex items-center justify-center z-10`}
    >
      <div
        onClick={() => toggle()}
        className="absolute w-full h-full bg-gray-600 opacity-50"
      ></div>

      <div
        className="text-black bg-white w-11/12 md:max-w-md mx-auto rounded-sm shadow-lg z-50 overflow-y-auto"
        style={{ maxHeight: '60vh', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="p-4 leading-tight">
          {custom ? (
            custom
          ) : (
            <>
              <p className="text-2xl mb-4">{title}</p>

              <p className="font-light whitespace-pre-wrap">{text}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
