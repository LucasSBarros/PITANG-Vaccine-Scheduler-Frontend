import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable";
import { useModal } from "../context/ModalContext";

jest.mock("../context/ModalContext", () => ({
  useModal: jest.fn(),
}));

const renderWithChakraProvider = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

const schedules = [
  {
    id: 1,
    scheduleDate: "2025-07-21",
    scheduleTime: "09:00:00",
    pacientName: "Fulano da Silva",
    pacientBirthDate: "1990-05-15",
    scheduleStatus: "Realizado",
    conclusion: "Concluído. A vacina foi aplicada",
  },
  {
    id: 2,
    scheduleDate: "2025-07-22",
    scheduleTime: "10:00:00",
    pacientName: "Cicrano de Tal",
    pacientBirthDate: "1985-08-30",
    scheduleStatus: "Não realizado",
    conclusion: "Não concluído. A vacina não foi aplicada",
  },
];

const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

describe("ScheduleTable", () => {
  let openModal;
  let closeModal;
  let handleStatusChange;
  let handleConclusionChange;
  let handleDelete;

  beforeEach(() => {
    openModal = jest.fn();
    closeModal = jest.fn();
    handleStatusChange = jest.fn();
    handleConclusionChange = jest.fn();
    handleDelete = jest.fn();

    useModal.mockReturnValue({
      openModal,
      closeModal,
    });
  });

  it("renderiza ScheduleTable com os dados corretos", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={schedules}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    expect(screen.getByText("Fulano da Silva")).toBeInTheDocument();
    expect(screen.getByText("Cicrano de Tal")).toBeInTheDocument();
    expect(screen.getByText("21/07/2025")).toBeInTheDocument();
    expect(screen.getByText("22/07/2025")).toBeInTheDocument();
  });

  it("chama handleStatusChange quando o status é alterado para 'Não realizado'", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={schedules}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    const statusCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(statusCheckbox);

    expect(handleStatusChange).toHaveBeenCalledWith(1, "Não realizado");
  });

  it("chama handleStatusChange quando o status é alterado para 'Realizado'", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={[
          ...schedules,
          { ...schedules[1], id: 3, scheduleStatus: "Realizado" },
        ]}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    const statusCheckbox = screen.getAllByRole("checkbox")[2];
    fireEvent.click(statusCheckbox);

    expect(handleStatusChange).toHaveBeenCalledWith(2, "Realizado");
  });

  it("chama handleConclusionChange quando a conclusão é alterada para 'Não concluído'", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={schedules}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    const conclusionCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(conclusionCheckbox);

    expect(handleConclusionChange).toHaveBeenCalledWith(
      1,
      "Não concluído. A vacina não foi aplicada"
    );
  });

  it("chama handleConclusionChange quando a conclusão é alterada para 'Concluído'", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={[
          ...schedules,
          {
            ...schedules[1],
            id: 3,
            conclusion: "Concluído. A vacina foi aplicada",
          },
        ]}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    const conclusionCheckbox = screen.getAllByRole("checkbox")[3];
    fireEvent.click(conclusionCheckbox);

    expect(handleConclusionChange).toHaveBeenCalledWith(
      2,
      "Concluído. A vacina foi aplicada"
    );
  });

  it("chama handleDelete quando o botão de deletar é clicado", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={schedules}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    const deleteButton = screen.getAllByText("Deletar")[0];
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it("abre o modal de resumo quando o botão de ver resumo é clicado", () => {
    renderWithChakraProvider(
      <ScheduleTable
        schedules={schedules}
        handleStatusChange={handleStatusChange}
        handleConclusionChange={handleConclusionChange}
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
    );

    const showSummaryButton = screen.getAllByText("Ver Resumo")[0];
    fireEvent.click(showSummaryButton);

    expect(openModal).toHaveBeenCalledWith({
      title: "Resumo do Agendamento",
      body: expect.any(Object),
      footer: expect.any(Object),
    });
  });
});
