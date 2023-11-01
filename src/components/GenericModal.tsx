import React, { ReactNode } from 'react';
import Modal from 'react-modal';

// Icons : 
import { IoMdClose } from 'react-icons/io'

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  modalWidth?: number
}

const GenericModal: React.FC<ModalProps> = ({ isOpen, onRequestClose, children, modalWidth }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal"
      ariaHideApp={false} 
      className="w-full focus:outline-none h-fit flex flex-row items-center justify-center min-w-screen lg:min-w-[50vw]"// Disables a11y warnings
    >
      <div className={`flex flex-col items-start justify-start w-[90%] lg:w-[40%] min-h-20 h-fit rounded-2xl bg-white border border-blackText-500/30 shadow shadow-blackText-500 px-1 pb-2`}>
        <div className='w-full py-2 px-1 flex flex-row items-center justify-end'>
          <div className='w-fit h-fit p-1 rounded-full bg-transparent hover:bg-gray-300 cursor-pointer' onClick={onRequestClose}>
          <IoMdClose color="#2F2F2F" size={20} />
          </div>
        </div>
        
        {children}
      </div>
      
    </Modal>
  );
};

export default GenericModal;
