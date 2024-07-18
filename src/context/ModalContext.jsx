import React, { createContext, useContext, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState({});

  const openModal = (content) => {
    setModalContent(content);
    onOpen();
  };

  const closeModal = () => {
    setModalContent({});
    onClose();
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalContent.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalContent.body}</ModalBody>
          <ModalFooter>{modalContent.footer}</ModalFooter>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

const useModal = () => useContext(ModalContext);

export { ModalProvider, useModal };