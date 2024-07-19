import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import DateField from "./DateField";

const Wrapper = ({ children }) => {
  const methods = useForm();
  return (
    <ChakraProvider>
      <FormProvider {...methods}>{children}</FormProvider>
    </ChakraProvider>
  );
};

it("renderiza DateField com label", () => {
  render(
    <Wrapper>
      <DateField id="test-date" label="Data de Teste" />
    </Wrapper>
  );
  expect(screen.getByLabelText("Data de Teste")).toBeInTheDocument();
});

it("mostra mensagem de erro quando fornecida", () => {
  render(
    <Wrapper>
      <DateField
        id="test-date"
        label="Data de Teste"
        errorMessage="Data inválida"
      />
    </Wrapper>
  );
  expect(screen.getByText("Data inválida")).toBeInTheDocument();
});

it("chama setValue e trigger na alteração de data", async () => {
  const setValue = jest.fn();
  const trigger = jest.fn();

  render(
    <Wrapper>
      <DateField
        id="test-date"
        label="Data de Teste"
        setValue={setValue}
        trigger={trigger}
      />
    </Wrapper>
  );

  const input = screen.getByPlaceholderText("dd/mm/aaaa");
  fireEvent.change(input, { target: { value: "25/12/2022" } });

  await waitFor(() => {
    const calledDate = setValue.mock.calls[0][1];
    expect(calledDate.getFullYear()).toBe(2022);
    expect(calledDate.getMonth()).toBe(11);
    expect(calledDate.getDate()).toBe(25);
    expect(trigger).toHaveBeenCalledWith("test-date");
  });
});
