import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import ModalContext from '../utils/ModalContext';

const Modal = () => {

    const { isShowing, toggle, title, text } = useContext(ModalContext);

    return (
        ReactDOM.createPortal(
            <div onClick={toggle} className={`${isShowing ? '' : 'hidden'} fixed w-full h-full top-0 left-0 flex items-center justify-center z-10`}>
                <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

                <div className="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto" style={{ maxHeight: '60vh', WebkitOverflowScrolling: 'touch' }}>

                    <div className="p-4 leading-tight">
                        <p className="text-2xl mb-4">{title}</p>

                        <p className="font-light whitespace-pre-wrap" >{text}</p>
                    </div>
                </div>
            </div>, document.body)
    )
}

export default Modal;