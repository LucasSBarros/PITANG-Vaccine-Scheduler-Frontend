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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import fetcher from "../services/api";
import { useForm } from "react-hook-form";
import LinkField from "../components/LinkField";
import Filters from "../components/Filters";

const ScheduleListPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { control, setValue, trigger, watch } = useForm();

  const filterDate = watch("filterDate", "");
  const filterTime = watch("filterTime", "");

  const bg = useColorModeValue("gray.50", "gray.800");
  const boxBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetcher("/api/schedule");

        if (response && response.items && typeof response.items === "object") {
          const scheduleArray = Object.values(response.items).flat();
          localStorage.setItem("appointments", JSON.stringify(scheduleArray));
          setSchedules(scheduleArray);
          setItemsPerPage(response.pageSize || 20);
        } else {
          throw new Error("Formato da resposta da API inválido");
        }
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(err.message || "Erro ao buscar agendamentos");

        const storedAppointments = JSON.parse(
          localStorage.getItem("appointments")
        );
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
          ? {
              ...schedule,
              scheduleStatus:
                schedule.scheduleStatus === "Não realizado"
                  ? "Realizado"
                  : "Não realizado",
            }
          : schedule
      );
      localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
      return updatedSchedules;
    });
  };

  const handleConclusionChange = (id) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = prevSchedules.map((schedule) =>
        schedule.id === id
          ? {
              ...schedule,
              conclusion:
                schedule.conclusion === "Concluído"
                  ? "Não concluído"
                  : "Concluído",
            }
          : schedule
      );
      localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
      return updatedSchedules;
    });
  };

  const formatDateForComparison = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const filteredSchedules = schedules
    .filter((schedule) => {
      const scheduleDate = formatDateForComparison(schedule.scheduleDate);
      const filterDateFormatted = filterDate
        ? formatDateForComparison(filterDate)
        : "";
      console.log(`Comparing: ${filterDateFormatted} with ${scheduleDate}`);
      return (
        (!filterDate || filterDateFormatted === scheduleDate) &&
        (!filterTime || filterTime === schedule.scheduleTime)
      );
    })
    .sort(
      (a, b) =>
        new Date(a.scheduleDate + "T" + a.scheduleTime) -
        new Date(b.scheduleDate + "T" + b.scheduleTime)
    );

  const indexOfLastSchedule = currentPage * itemsPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bg} px={4}>
      <Stack spacing={8} mx={"auto"} width="100%" maxW={"1200px"} py={12}>
        <Stack align={"center"}>
          <Heading fontSize={"xxx-large"} textAlign={"center"}>
            Lista de Agendamentos
          </Heading>
          <Text fontSize={"larger"} color={"gray.600"} textAlign={"center"}>
            Confira aqui o seu agendamento.
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={boxBg} boxShadow={"lg"} p={8} width="100%">
          <Filters
            control={control}
            setValue={setValue}
            trigger={trigger}
            filterTime={filterTime}
          />
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
              {currentSchedules.map((schedule) => (
                <Tr key={schedule.id}>
                  <Td>{formatDateForDisplay(schedule.scheduleDate)}</Td>
                  <Td>{schedule.scheduleTime}</Td>
                  <Td>{schedule.pacientName}</Td>
                  <Td>
                    {new Date(schedule.pacientBirthDate).toLocaleDateString(
                      "pt-BR"
                    )}
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
          <Flex mt={4} justifyContent="space-between">
            <Button
              onClick={handlePreviousPage}
              isDisabled={currentPage === 1}
              colorScheme="purple"
            >
              Anterior
            </Button>
            <Text>
              Página {currentPage} de {totalPages}
            </Text>
            <Button
              onClick={handleNextPage}
              isDisabled={currentPage === totalPages}
              colorScheme="purple"
            >
              Próxima
            </Button>
          </Flex>
        </Box>
        <LinkField
          to="/"
          linkText="Formulário de agendamento"
          description="Deseja realizar um novo agendamento?"
        />
      </Stack>
    </Flex>
  );
};

export default ScheduleListPage;
