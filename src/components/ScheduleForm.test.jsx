import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider, Button } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import { useModal } from "../context/ModalContext";
import fetcher from "../services/api";

jest.mock("../context/ModalContext", () => ({
  useModal: jest.fn(),
}));

jest.mock("../services/api", () => ({
  post: jest.fn(),
}));

const renderWithChakraProvider = (ui) => {
  return render(
    <ChakraProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>
  );
};

describe("ScheduleForm", () => {
  let openModal;
  let closeModal;

  beforeEach(() => {
    openModal = jest.fn();
    closeModal = jest.fn();
    useModal.mockReturnValue({
      openModal,
      closeModal,
    });

    fetcher.post.mockReset();
  });

  it("renderiza ScheduleForm com os campos corretos", () => {
    renderWithChakraProvider(<ScheduleForm />);

    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data do Agendamento/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Horário do Agendamento/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Agendar/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Consultar Lista de Agendamentos/i)
    ).toBeInTheDocument();
  });

  it("exibe mensagem de sucesso ao agendar com sucesso", async () => {
    fetcher.post.mockResolvedValueOnce({ data: { id: 1 } });
    fetcher.post.mockResolvedValueOnce({ data: { id: 2 } }); 

    renderWithChakraProvider(<ScheduleForm />);

    fireEvent.input(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Fulano de Tal" },
    });
    fireEvent.input(screen.getByLabelText(/Data de Nascimento/i), {
      target: { value: "1990-05-15" },
    });
    fireEvent.input(screen.getByLabelText(/Data do Agendamento/i), {
      target: { value: "2024-08-21" },
    });
    fireEvent.change(screen.getByLabelText(/Horário do Agendamento/i), {
      target: { value: "09:00:00" },
    });

    await waitFor(() => {
      expect(screen.getByText(/Agendar/i)).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText(/Agendar/i));
    console.log("Clicked submit button");

    await waitFor(() => {
      console.log("fetcher.post calls", fetcher.post.mock.calls);
      expect(fetcher.post).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(openModal).toHaveBeenCalledWith({
        title: "Sucesso",
        body: "Agendamento realizado com sucesso.",
        footer: (
          <Button colorScheme="purple" onClick={closeModal}>
            Fechar
          </Button>
        ),
      });
    });
  });

  it("exibe mensagem de erro ao falhar no agendamento", async () => {
    fetcher.post.mockResolvedValueOnce({ data: { id: 1 } }); 
    fetcher.post.mockRejectedValueOnce(new Error("Erro desconhecido")); 

    renderWithChakraProvider(<ScheduleForm />);

    fireEvent.input(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Fulano de Tal" },
    });
    fireEvent.input(screen.getByLabelText(/Data de Nascimento/i), {
      target: { value: "1990-05-15" },
    });
    fireEvent.input(screen.getByLabelText(/Data do Agendamento/i), {
      target: { value: "2024-08-21" },
    });
    fireEvent.change(screen.getByLabelText(/Horário do Agendamento/i), {
      target: { value: "09:00:00" },
    });

    await waitFor(() => {
      expect(screen.getByText(/Agendar/i)).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText(/Agendar/i));
    console.log("Clicked submit button");

    await waitFor(() => {
      console.log("fetcher.post calls", fetcher.post.mock.calls);
      expect(fetcher.post).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(openModal).toHaveBeenCalledWith({
        title: "Algo deu errado, agendamento não realizado!",
        body: "Erro desconhecido",
        footer: (
          <Button colorScheme="red" onClick={closeModal}>
            Fechar
          </Button>
        ),
      });
    });
  });

  it("salva os valores do formulário no localStorage ao alterar os campos", () => {
    renderWithChakraProvider(<ScheduleForm />);

    fireEvent.input(screen.getByLabelText(/Nome Completo/i), {
      target: { value: "Fulano de Tal" },
    });
    fireEvent.input(screen.getByLabelText(/Data de Nascimento/i), {
      target: { value: "1990-05-15" },
    });
    fireEvent.input(screen.getByLabelText(/Data do Agendamento/i), {
      target: { value: "2024-08-21" },
    });
    fireEvent.change(screen.getByLabelText(/Horário do Agendamento/i), {
      target: { value: "09:00:00" },
    });

    expect(JSON.parse(localStorage.getItem("scheduleForm"))).toEqual({
      fullName: "Fulano de Tal",
      birthDate: "1990-05-15T00:00:00.000Z",
      scheduleDate: "2024-08-21T00:00:00.000Z",
      scheduleTime: "09:00:00",
    });
  });
});
