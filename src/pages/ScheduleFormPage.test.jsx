import { render, screen } from "@testing-library/react";
import ScheduleFormPage from "./ScheduleFormPage";
import { ChakraProvider } from "@chakra-ui/react";
import { ModalProvider } from "../context/ModalContext";
import { BrowserRouter } from "react-router-dom";

jest.mock("../services/api", () => ({
  post: jest.fn(), 
}));

const renderWithProviders = (ui) => {
  return render(
    <ChakraProvider>
      <ModalProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </ModalProvider>
    </ChakraProvider>
  );
};

describe("ScheduleFormPage", () => {
  it("renderiza o título e o subtítulo corretamente", () => {
    renderWithProviders(<ScheduleFormPage />);

    const titleElements = screen.getAllByText(/Agendamentos/i);
    expect(titleElements.length).toBeGreaterThan(0);

    expect(
      screen.getByText(
        /Agende sua vacina contra COVID-19 através deste formulário./i
      )
    ).toBeInTheDocument();
  });

  it("renderiza o componente ScheduleForm", () => {
    renderWithProviders(<ScheduleFormPage />);

    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data do Agendamento/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Horário do Agendamento/i)
    ).toBeInTheDocument();
  });

  it("renderiza o layout da página corretamente", () => {
    renderWithProviders(<ScheduleFormPage />);

    const flexContainer = screen.getByRole("main");
    expect(flexContainer).toHaveStyle("min-height: 100vh");
    expect(flexContainer).toHaveStyle("align-items: center");
    expect(flexContainer).toHaveStyle("justify-content: center");

    const boxContainer = screen.getByRole("article");
    expect(boxContainer).toHaveStyle("box-shadow: var(--chakra-shadows-2xl)");
  });
});
