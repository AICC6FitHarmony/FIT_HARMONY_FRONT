import React, { createContext, useContext, useEffect, useState } from 'react';
import StandardModal from './StandardModal';

const ModalContext = createContext();

export const ModalProvider = ({children})=>{
  const [isOpen, setIsOpen] = useState(false);
  const [modalChildren, setModalChildren] = useState(false);
  const [modal, setModal] = useState({
    title:undefined,
    okEvent:undefined,
    cancelEvent:undefined,
    closeEvent:undefined,
    size:undefined
  });
  const openModal = (
    {title, children,okEvent, cancelEvent, closeEvent, size, isCancelClose, isOkClose}
  )=>{
    const handleClose = ()=>{
      setIsOpen(false);
      if(closeEvent) closeEvent();
    }
    const handleCancel = ()=>{
      setIsOpen(false);
      if(cancelEvent) cancelEvent();
    }
    const handleOk = ()=>{
      setIsOpen(false);
      if(okEvent) okEvent();
    }
    setModal({title, okEvent:(isOkClose?handleOk:okEvent), cancelEvent:(isCancelClose?handleCancel:cancelEvent), closeEvent:handleClose, size});
    setIsOpen(true);
    setModalChildren(children);
  }

  return (
    <ModalContext.Provider value={openModal}>
      {isOpen&&
        <StandardModal title={modal.title} cancelEvent={modal.cancelEvent} closeEvent={modal.closeEvent} okEvent={modal.okEvent} size={modal.size}>
          {modalChildren}
        </StandardModal>
      }
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  return useContext(ModalContext);
}

export const useAlertModal = () => {
  const openModal = useContext(ModalContext);
  const openAlert = (title, text)=>{
    openModal({
      title, children:text, isOkClose, size:{height:"auto"}
    })
  }
  return openAlert; 
}