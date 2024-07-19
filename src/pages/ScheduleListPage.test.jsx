import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from '../context/ModalContext';
import ScheduleListPage from './ScheduleListPage';

jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('../components/ScheduleList', () => jest.fn(() => <div>Mocked ScheduleList</div>));

const renderWithProviders = (ui) => {
  return render(
    <ChakraProvider>
      <ModalProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ModalProvider>
    </ChakraProvider>
  );
};

describe('ScheduleListPage', () => {
  beforeEach(() => {
   
  });

  it('renderiza o título e o subtítulo corretamente', () => {
    renderWithProviders(<ScheduleListPage />);

    expect(screen.getByText('Lista de Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Confira aqui o seu agendamento.')).toBeInTheDocument();
  });

  it('renderiza o link para o formulário de agendamento', () => {
    renderWithProviders(<ScheduleListPage />);

    expect(screen.getByText('Formulário de agendamento')).toBeInTheDocument();
    expect(screen.getByText('Deseja realizar um novo agendamento?')).toBeInTheDocument();
  });

  it('renderiza o layout da página corretamente', () => {
    renderWithProviders(<ScheduleListPage />);

    const flexContainer = screen.getByRole('main');
    expect(flexContainer).toHaveStyle('min-height: 100vh');
    expect(flexContainer).toHaveStyle('align-items: center');
    expect(flexContainer).toHaveStyle('justify-content: center');
  });

  it('renderiza o componente ScheduleList', async () => {
    renderWithProviders(<ScheduleListPage />);

    await waitFor(() => {
      expect(screen.getByText('Mocked ScheduleList')).toBeInTheDocument();
    });
  });
  
});
