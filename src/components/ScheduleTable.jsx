import { Table, Thead, Tbody, Tr, Th, Td, Checkbox } from "@chakra-ui/react";

const ScheduleTable = ({
  schedules,
  handleStatusChange,
  handleConclusionChange,
  formatDateForDisplay,
}) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Data do Agendamento</Th>
        <Th>Horário do Agendamento</Th>
        <Th>Nome Completo</Th>
        <Th>Data de Nascimento</Th>
        <Th>Status</Th>
        <Th>Conclusão</Th>
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
              isChecked={schedule.scheduleStatus === "Realizado"}
              onChange={() => handleStatusChange(schedule.id)}
            >
              {schedule.scheduleStatus}
            </Checkbox>
          </Td>
          <Td>
            <Checkbox
              isChecked={schedule.conclusion === "Concluído"}
              onChange={() => handleConclusionChange(schedule.id)}
            >
              {schedule.conclusion === "Concluído"
                ? "Concluído. A vacina foi aplicada"
                : "Não concluído. A vacina não foi aplicada"}
            </Checkbox>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default ScheduleTable;
