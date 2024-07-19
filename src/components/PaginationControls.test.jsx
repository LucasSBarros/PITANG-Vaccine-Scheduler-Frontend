import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from "@chakra-ui/react";
import PaginationControls from './PaginationControls';

const renderWithChakraProvider = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

it('renderiza PaginationControls com botões e texto', () => {
  renderWithChakraProvider(
    <PaginationControls
      currentPage={1}
      totalPages={10}
      handlePreviousPage={() => {}}
      handleNextPage={() => {}}
    />
  );

  expect(screen.getByText('Anterior')).toBeInTheDocument();
  expect(screen.getByText('Página 1 de 10')).toBeInTheDocument();
  expect(screen.getByText('Próxima')).toBeInTheDocument();
});

it('desativa o botão "Anterior" na primeira página', () => {
  renderWithChakraProvider(
    <PaginationControls
      currentPage={1}
      totalPages={10}
      handlePreviousPage={() => {}}
      handleNextPage={() => {}}
    />
  );

  expect(screen.getByText('Anterior')).toBeDisabled();
});

it('desativa o botão "Próxima" na última página', () => {
  renderWithChakraProvider(
    <PaginationControls
      currentPage={10}
      totalPages={10}
      handlePreviousPage={() => {}}
      handleNextPage={() => {}}
    />
  );

  expect(screen.getByText('Próxima')).toBeDisabled();
});

it('habilita ambos os botões em páginas intermediárias', () => {
  renderWithChakraProvider(
    <PaginationControls
      currentPage={5}
      totalPages={10}
      handlePreviousPage={() => {}}
      handleNextPage={() => {}}
    />
  );

  expect(screen.getByText('Anterior')).not.toBeDisabled();
  expect(screen.getByText('Próxima')).not.toBeDisabled();
});

it('chama handlePreviousPage ao clicar no botão "Anterior"', () => {
  const handlePreviousPage = jest.fn();
  renderWithChakraProvider(
    <PaginationControls
      currentPage={5}
      totalPages={10}
      handlePreviousPage={handlePreviousPage}
      handleNextPage={() => {}}
    />
  );

  fireEvent.click(screen.getByText('Anterior'));
  expect(handlePreviousPage).toHaveBeenCalled();
});

it('chama handleNextPage ao clicar no botão "Próxima"', () => {
  const handleNextPage = jest.fn();
  renderWithChakraProvider(
    <PaginationControls
      currentPage={5}
      totalPages={10}
      handlePreviousPage={() => {}}
      handleNextPage={handleNextPage}
    />
  );

  fireEvent.click(screen.getByText('Próxima'));
  expect(handleNextPage).toHaveBeenCalled();
});
