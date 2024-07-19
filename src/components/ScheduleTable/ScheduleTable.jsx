import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useModal } from "../../context/ModalContext";

const ScheduleTable = ({
  schedules,
  handleStatusChange,
  handleConclusionChange,
  handleDelete,
  formatDateForDisplay,
}) => {
  const { openModal, closeModal } = useModal();

  const handleShowSummary = (schedule) => {
    openModal({
      title: "Resumo do Agendamento",
      body: (
        <div>
          <p>
            <strong>Data do Agendamento:</strong>{" "}
            {formatDateForDisplay(schedule.scheduleDate)}
          </p>
          <p>
            <strong>Horário do Agendamento:</strong> {schedule.scheduleTime}
          </p>
          <p>
            <strong>Nome Completo:</strong> {schedule.pacientName}
          </p>
          <p>
            <strong>Data de Nascimento:</strong>{" "}
            {new Date(schedule.pacientBirthDate).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <strong>Status:</strong> {schedule.scheduleStatus}
          </p>
          <p>
            <strong>Conclusão:</strong> {schedule.conclusion}
          </p>
        </div>
      ),
      footer: (
        <Button colorScheme="purple" onClick={closeModal}>
          Fechar
        </Button>
      ),
    });
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Data do Agendamento</Th>
          <Th>Horário do Agendamento</Th>
          <Th>Nome Completo</Th>
          <Th>Data de Nascimento</Th>
          <Th>Status</Th>
          <Th>Conclusão</Th>
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {schedules.map((schedule) => (
          <Tr key={schedule.id}>
            <Td>{formatDateForDisplay(schedule.scheduleDate)}</Td>
            <Td>{schedule.scheduleTime}</Td>
            <Td>{schedule.pacientName}</Td>
            <Td>
              {new Date(schedule.pacientBirthDate).toLocaleDateString("pt-BR")}
            </Td>
            <Td>
              <Checkbox
                colorScheme="purple"
                isChecked={schedule.scheduleStatus === "Realizado"}
                onChange={() =>
                  handleStatusChange(
                    schedule.id,
                    schedule.scheduleStatus === "Não realizado"
                      ? "Realizado"
                      : "Não realizado"
                  )
                }
              >
                {schedule.scheduleStatus}
              </Checkbox>
            </Td>
            <Td>
              <Checkbox
                colorScheme="purple"
                isChecked={
                  schedule.conclusion === "Concluído. A vacina foi aplicada"
                }
                onChange={() =>
                  handleConclusionChange(
                    schedule.id,
                    schedule.conclusion === "Concluído. A vacina foi aplicada"
                      ? "Não concluído. A vacina não foi aplicada"
                      : "Concluído. A vacina foi aplicada"
                  )
                }
              >
                {schedule.conclusion === "Concluído. A vacina foi aplicada"
                  ? "Concluído. A vacina foi aplicada"
                  : "Não concluído. A vacina não foi aplicada"}
              </Checkbox>
            </Td>
            <Td>
              <Flex>
                <Button
                  colorScheme="purple"
                  onClick={() => handleShowSummary(schedule)}
                >
                  Ver Resumo
                </Button>
                <Button
                  colorScheme="red"
                  ml={2}
                  onClick={() => handleDelete(schedule.id)}
                >
                  Deletar
                </Button>
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ScheduleTable;
