import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { ModalContext } from '../contexts/ModalContext';
import { AnimatePresence, motion } from 'framer-motion';

interface IModalProps {}

const Modal: React.FC<IModalProps> = () => {
  const { isShowing, toggle, title, text, custom } = useContext(ModalContext);
  const { theme } = useContext(ThemeContext);

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          className={`${
            theme ?? ''
          } fixed w-full h-full top-0 left-0 flex items-center justify-center z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div
            onClick={() => toggle()}
            className="absolute w-full h-full bg-gray-600 opacity-50"
          ></div>

          <motion.div
            className="text-black bg-white w-11/12 md:max-w-md mx-auto rounded-sm shadow-lg z-50 overflow-y-auto"
            style={{ maxHeight: '60vh', WebkitOverflowScrolling: 'touch' }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
