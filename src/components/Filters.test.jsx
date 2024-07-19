import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filters from "./Filters";
import { ChakraProvider } from "@chakra-ui/react";

const renderWithChakraProvider = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: ({ render, ...props }) => render({ field: {} }),
  useForm: () => ({
    control: {},
    setValue: jest.fn(),
    trigger: jest.fn(),
    watch: jest.fn(),
  }),
}));

it("renderiza Filters com DateField e TimeField", () => {
  const { getByLabelText } = renderWithChakraProvider(
    <Filters
      control={{}}
      setValue={() => {}}
      trigger={() => {}}
      filterTime=""
    />
  );

  expect(getByLabelText(/Filtrar por data/i)).toBeInTheDocument();
  expect(getByLabelText(/Filtrar por horário/i)).toBeInTheDocument();
});

it("chama setValue e trigger na alteração da data", () => {
  const setValue = jest.fn();
  const trigger = jest.fn();

  const { getByLabelText, container } = renderWithChakraProvider(
    <Filters control={{}} setValue={setValue} trigger={trigger} filterTime="" />
  );

  const dateInput = container.querySelector('input[placeholder="dd/mm/aaaa"]');
  fireEvent.input(dateInput, { target: { value: "01/01/2022" } });

  expect(setValue).toHaveBeenCalledWith("filterDate", expect.any(Date));
  expect(trigger).toHaveBeenCalledWith("filterDate");
});

it("chama setValue e trigger na alteração do horário", () => {
  const setValue = jest.fn();
  const trigger = jest.fn();

  const { getByLabelText } = renderWithChakraProvider(
    <Filters control={{}} setValue={setValue} trigger={trigger} filterTime="" />
  );

  const timeInput = getByLabelText(/Filtrar por horário/i);
  fireEvent.change(timeInput, { target: { value: "09:00:00" } });

  expect(setValue).toHaveBeenCalledWith("filterTime", "09:00:00");
  expect(trigger).toHaveBeenCalledWith("filterTime");
});
