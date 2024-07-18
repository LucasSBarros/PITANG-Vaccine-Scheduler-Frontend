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
} from "@chakra-ui/react";
import fetcher from "../services/api";

const ScheduleListPage = () => {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bg = useColorModeValue("gray.50", "gray.800");
  const boxBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetcher("/api/schedule");

        // Verifique se a resposta contém a chave 'items' e se é um objeto
        if (response && response.items && typeof response.items === 'object') {
          // Salvar no local storage
          localStorage.setItem("appointments", JSON.stringify(response.items));
          setSchedules(response.items);
        } else {
          throw new Error("Formato da resposta da API inválido");
        }
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(err.message || "Erro ao buscar agendamentos");

        // Tentar buscar no local storage caso a requisição falhe
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  const handleStatusChange = (dateTime, id) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = { ...prevSchedules };
      const schedule = updatedSchedules[dateTime].find((s) => s.id === id);
      if (schedule) {
        schedule.scheduleStatus = schedule.scheduleStatus === "Não realizado" ? "Realizado" : "Não realizado";
      }
      localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
      return updatedSchedules;
    });
  };

  const handleConclusionChange = (dateTime, id, value) => {
    setSchedules((prevSchedules) => {
      const updatedSchedules = { ...prevSchedules };
      const schedule = updatedSchedules[dateTime].find((s) => s.id === id);
      if (schedule) {
        schedule.conclusion = value;
      }
      localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
      return updatedSchedules;
    });
  };

  const sortedDateTimes = Object.keys(schedules).sort((a, b) => new Date(a) - new Date(b));

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bg}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"xxx-large"} textAlign={"center"}>
            Lista de Agendamentos
          </Heading>
          <Text fontSize={"larger"} color={"gray.600"} textAlign={"center"}>
            Aqui estão os agendamentos realizados.
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={boxBg} boxShadow={"lg"} p={8}>
          {sortedDateTimes.length === 0 ? (
            <Text fontSize={"larger"} color={"gray.600"} textAlign={"center"}>
              Nenhum agendamento encontrado.
            </Text>
          ) : (
            sortedDateTimes.map((dateTime) => (
              <Box key={dateTime} mb={6}>
                <Heading fontSize={"xl"} mb={4}>
                  {formatDate(dateTime.split('-')[0] + '-' + dateTime.split('-')[1] + '-' + dateTime.split('-')[2])} às {dateTime.split('-')[3]}
                </Heading>
                {schedules[dateTime].map((schedule) => (
                  <Box key={schedule.id} mb={4}>
                    <Heading fontSize={"lg"} mb={2}>
                      {schedule.scheduleTime}
                    </Heading>
                    <Box p={5} shadow="md" borderWidth="1px" mb={2}>
                      <Text>
                        <strong>Nome Completo:</strong> {schedule.pacientName}
                      </Text>
                      <Text>
                        <strong>Data de Nascimento:</strong>{" "}
                        {new Date(schedule.pacientBirthDate).toLocaleDateString()}
                      </Text>
                      <Text>
                        <strong>Status:</strong> {schedule.scheduleStatus}
                        <Checkbox
                          ml={2}
                          isChecked={schedule.scheduleStatus === "Realizado"}
                          onChange={() => handleStatusChange(dateTime, schedule.id)}
                        >
                          Marque caso a consulta tenha sido realizada
                        </Checkbox>
                      </Text>
                      <Text mt={4}>
                        <strong>Conclusão:</strong>
                        <Input
                          value={schedule.conclusion || ""}
                          onChange={(e) => handleConclusionChange(dateTime, schedule.id, e.target.value)}
                          placeholder="Conclusão do atendimento"
                          mt={2}
                        />
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default ScheduleListPage;