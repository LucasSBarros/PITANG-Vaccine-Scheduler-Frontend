import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Stack,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import fetcher from "../services/api";
import { useForm } from "react-hook-form";
import LinkField from "../components/LinkField";
import Filters from "../components/Filters";
import ScheduleTable from "../components/ScheduleTable";
import PaginationControls from "../components/PaginationControls";
import Header from "../components/Header";

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
        <Header
          title="Lista de Agendamentos"
          subtitle="Confira aqui o seu agendamento."
        />
        <Box rounded={"lg"} bg={boxBg} boxShadow={"lg"} p={8} width="100%">
          <Filters
            control={control}
            setValue={setValue}
            trigger={trigger}
            filterTime={filterTime}
          />
          <ScheduleTable
            schedules={currentSchedules}
            handleStatusChange={handleStatusChange}
            handleConclusionChange={handleConclusionChange}
            formatDateForDisplay={formatDateForDisplay}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
          />
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
