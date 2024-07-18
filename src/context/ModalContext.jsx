import { createContext, useContext, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState({});

  const openModal = ({ title, body, footer }) => {
    setModalContent({ title, body, footer });
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

export const useModal = () => useContext(ModalContext);