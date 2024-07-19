import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from "@chakra-ui/react";
import { useForm, FormProvider } from 'react-hook-form';
import TimeField from './TimeField';

const renderWithChakraProvider = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

const Wrapper = ({ children }) => {
  const methods = useForm();
  return (
    <ChakraProvider>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </ChakraProvider>
  );
};

it('renderiza TimeField com label e placeholder', () => {
  renderWithChakraProvider(
    <Wrapper>
      <TimeField id="test-time" label="Horário de Teste" register={() => {}} />
    </Wrapper>
  );

  expect(screen.getByLabelText('Horário de Teste')).toBeInTheDocument();
});

it('mostra mensagem de erro quando fornecida', () => {
  renderWithChakraProvider(
    <Wrapper>
      <TimeField id="test-time" label="Horário de Teste" errorMessage="Horário inválido" register={() => {}} />
    </Wrapper>
  );

  expect(screen.getByText('Horário inválido')).toBeInTheDocument();
});

it('chama setValue e trigger ao alterar o horário', () => {
  const setValue = jest.fn();
  const trigger = jest.fn();

  renderWithChakraProvider(
    <Wrapper>
      <TimeField id="test-time" label="Horário de Teste" setValue={setValue} trigger={trigger} register={() => {}} />
    </Wrapper>
  );

  fireEvent.change(screen.getByLabelText('Horário de Teste'), { target: { value: '09:00:00' } });

  expect(setValue).toHaveBeenCalledWith('test-time', '09:00:00');
  expect(trigger).toHaveBeenCalledWith('test-time');
});
