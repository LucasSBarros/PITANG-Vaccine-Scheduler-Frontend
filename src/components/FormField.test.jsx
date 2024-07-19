import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from "@chakra-ui/react";
import FormField from './FormField';
import { useForm, FormProvider } from 'react-hook-form';

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

it('renderiza FormField com label', () => {
  render(
    <Wrapper>
      <FormField id="test-field" label="Test Field" type="text" register={() => ({})} />
    </Wrapper>
  );
  expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
});

it('mostra mensagem de erro quando fornecida', () => {
  render(
    <Wrapper>
      <FormField id="test-field" label="Test Field" type="text" register={() => ({})} errorMessage="Campo inválido" />
    </Wrapper>
  );
  expect(screen.getByText('Campo inválido')).toBeInTheDocument();
});

it('chama register corretamente', () => {
  const register = jest.fn();
  render(
    <Wrapper>
      <FormField id="test-field" label="Test Field" type="text" register={register} />
    </Wrapper>
  );
  expect(register).toHaveBeenCalledWith('test-field');
});

it('altera o valor do input corretamente', () => {
  const register = jest.fn();
  render(
    <Wrapper>
      <FormField id="test-field" label="Test Field" type="text" register={register} />
    </Wrapper>
  );
  const input = screen.getByLabelText('Test Field');
  fireEvent.change(input, { target: { value: 'Novo valor' } });
  expect(input.value).toBe('Novo valor');
});
