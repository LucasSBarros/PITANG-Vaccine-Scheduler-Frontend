import { useEffect, useState } from "react";
import {
  Flex,
  Box,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import fetcher from "../services/api";
import { useForm } from "react-hook-form";
import Filters from "../components/Filters";
import ScheduleTable from "../components/ScheduleTable";
import PaginationControls from "../components/PaginationControls";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { control, setValue, trigger, watch } = useForm();

  const filterDate = watch("filterDate", "");
  const filterTime = watch("filterTime", "");

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

  const handleStatusChange = async (id, newStatus) => {
    const schedule = schedules.find((schedule) => schedule.id === id);
    if (!schedule) return;

    try {
      const updatedSchedule = {
        ...schedule,
        scheduleStatus: newStatus,
      };
      await fetcher.put(`/api/schedule/${id}`, updatedSchedule);

      setSchedules((prevSchedules) => {
        const updatedSchedules = prevSchedules.map((schedule) =>
          schedule.id === id ? updatedSchedule : schedule
        );
        localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
        return updatedSchedules;
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleConclusionChange = async (id, newConclusion) => {
    const schedule = schedules.find((schedule) => schedule.id === id);
    if (!schedule) return;

    try {
      const updatedSchedule = {
        ...schedule,
        conclusion: newConclusion,
      };
      await fetcher.put(`/api/schedule/${id}`, updatedSchedule);

      setSchedules((prevSchedules) => {
        const updatedSchedules = prevSchedules.map((schedule) =>
          schedule.id === id ? updatedSchedule : schedule
        );
        localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
        return updatedSchedules;
      });
    } catch (error) {
      console.error("Erro ao atualizar conclusão:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetcher.delete(`/api/schedule/${id}`);

      setSchedules((prevSchedules) => {
        const updatedSchedules = prevSchedules.filter(
          (schedule) => schedule.id !== id
        );
        localStorage.setItem("appointments", JSON.stringify(updatedSchedules));
        return updatedSchedules;
      });
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
    }
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
        handleDelete={handleDelete}
        formatDateForDisplay={formatDateForDisplay}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </Box>
  );
};

export default ScheduleList;
