import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from "@chakra-ui/react";
import Header from './Header';

const renderWithChakraProvider = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

it('renderiza Header com title e subtitle', () => {
  renderWithChakraProvider(<Header title="Título de Teste" subtitle="Subtítulo de Teste" />);
  expect(screen.getByText('Título de Teste')).toBeInTheDocument();
  expect(screen.getByText('Subtítulo de Teste')).toBeInTheDocument();
});

it('aplica as propriedades de estilo corretamente', () => {
  renderWithChakraProvider(<Header title="Título de Teste" subtitle="Subtítulo de Teste" />);
  const headingElement = screen.getByText('Título de Teste');
  const textElement = screen.getByText('Subtítulo de Teste');
  
  expect(headingElement).toHaveStyle({ fontSize: 'xxx-large', textAlign: 'center' });
  expect(textElement).toHaveStyle({ fontSize: 'larger', color: 'gray.600', textAlign: 'center' });
});

