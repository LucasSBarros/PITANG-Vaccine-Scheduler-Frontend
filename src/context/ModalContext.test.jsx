import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalProvider, useModal } from "../context/ModalContext";
import { ChakraProvider, Button } from "@chakra-ui/react";

const TestComponent = () => {
  const { openModal, closeModal } = useModal();

  return (
    <>
      <Button
        onClick={() =>
          openModal({
            title: "Título de Teste",
            body: "Corpo de Teste",
            footer: <Button onClick={closeModal}>Fechar</Button>,
          })
        }
      >
        Abrir Modal
      </Button>
    </>
  );
};

const renderWithProviders = (ui) => {
  return render(
    <ChakraProvider>
      <ModalProvider>{ui}</ModalProvider>
    </ChakraProvider>
  );
};

describe("ModalContext", () => {
  it("abre o modal com o conteúdo correto", async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText(/Abrir Modal/i));

    await waitFor(() =>
      expect(screen.getByText(/Título de Teste/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Corpo de Teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Fechar/i)).toBeInTheDocument();
  });

  it("fecha o modal quando o botão fechar é clicado", async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText(/Abrir Modal/i));

    await waitFor(() =>
      expect(screen.getByText(/Título de Teste/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/Fechar/i));

    await waitFor(() =>
      expect(screen.queryByText(/Título de Teste/i)).not.toBeInTheDocument()
    );
  });

  it("fecha o modal quando o botão ModalCloseButton é clicado", async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText(/Abrir Modal/i));

    await waitFor(() =>
      expect(screen.getByText(/Título de Teste/i)).toBeInTheDocument()
    );

    const closeButtons = screen.getAllByRole("button", { name: /Fechar/i });
    fireEvent.click(closeButtons[0]);

    await waitFor(() =>
      expect(screen.queryByText(/Título de Teste/i)).not.toBeInTheDocument()
    );
  });
});
