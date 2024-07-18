import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Checkbox,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
} from "@chakra-ui/react";
import fetcher from "../services/api";

const ScheduleListPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");

  const bg = useColorModeValue("gray.50", "gray.800");
  const boxBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetcher("/api/schedule");

        if (response && response.items && typeof response.items === 'object') {
          const scheduleArray = Object.values(response.items).flat();
          localStorage.setItem("appointments", JSON.stringify(scheduleArray));
          setSchedules(scheduleArray);
        } else {
          throw new Error("Formato da resposta da API inválido");
        }
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(err.message || "Erro ao buscar agendamentos");

        const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
        if (storedAppointments) {
          setSchedules(storedAppointments);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Flex>
    );
  }

  const handleStatusChange = (id) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = prevSchedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, scheduleStatus: schedule.scheduleStatus === "Não realizado" ? "Realizado" : "Não realizado" }
          : schedule
      );
      localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
      return updatedSchedules;
    });
  };

  const handleConclusionChange = (id, value) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = prevSchedules.map((schedule) =>
        schedule.id === id ? { ...schedule, conclusion: value } : schedule
      );
      localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
      return updatedSchedules;
    });
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleFilterTimeChange = (e) => {
    setFilterTime(e.target.value);
  };

  const formatDateForComparison = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const scheduleDate = formatDateForComparison(schedule.scheduleDate);
    return (
      (!filterDate || filterDate === scheduleDate) &&
      (!filterTime || filterTime === schedule.scheduleTime)
    );
  });

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bg} px={4}>
      <Stack spacing={8} mx={"auto"} width="100%" maxW={"1200px"} py={12}>
        <Stack align={"center"}>
          <Heading fontSize={"xxx-large"} textAlign={"center"}>
            Lista de Agendamentos
          </Heading>
          <Text fontSize={"larger"} color={"gray.600"} textAlign={"center"}>
            Aqui estão os agendamentos realizados.
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={boxBg} boxShadow={"lg"} p={8} width="100%">
          <Stack direction="row" spacing={4} mb={4}>
            <Input
              type="date"
              value={filterDate}
              onChange={handleFilterDateChange}
              placeholder="Filtrar por data"
            />
            <Select
              value={filterTime}
              onChange={handleFilterTimeChange}
              placeholder="Filtrar por horário"
            >
              <option value="07:00:00">07:00</option>
              <option value="08:00:00">08:00</option>
              <option value="09:00:00">09:00</option>
              <option value="10:00:00">10:00</option>
              <option value="11:00:00">11:00</option>
              <option value="12:00:00">12:00</option>
              <option value="13:00:00">13:00</option>
              <option value="14:00:00">14:00</option>
              <option value="15:00:00">15:00</option>
              <option value="16:00:00">16:00</option>
              <option value="17:00:00">17:00</option>
            </Select>
          </Stack>
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
              {filteredSchedules.map((schedule) => (
                <Tr key={schedule.id}>
                  <Td>{new Date(schedule.scheduleDate).toLocaleDateString('pt-BR')}</Td>
                  <Td>{schedule.scheduleTime}</Td>
                  <Td>{schedule.pacientName}</Td>
                  <Td>{new Date(schedule.pacientBirthDate).toLocaleDateString('pt-BR')}</Td>
                  <Td>
                    <Checkbox
                      isChecked={schedule.scheduleStatus === "Realizado"}
                      onChange={() => handleStatusChange(schedule.id)}
                    >
                      {schedule.scheduleStatus}
                    </Checkbox>
                  </Td>
                  <Td>
                    <Input
                      value={schedule.conclusion || ""}
                      onChange={(e) => handleConclusionChange(schedule.id, e.target.value)}
                      placeholder="Conclusão do atendimento"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </Flex>
  );
};

export default ScheduleListPage;