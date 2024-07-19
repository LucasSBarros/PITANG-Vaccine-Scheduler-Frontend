import { Flex, Stack, useColorModeValue } from "@chakra-ui/react";
import Header from "../components/Header/Header";
import LinkField from "../components/LinkField/LinkField";
import ScheduleList from "../components/ScheduleList/ScheduleList";

const ScheduleListPage = () => {
  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bg} px={4} role="main">
      <Stack spacing={8} mx={"auto"} width="100%" maxW={"1200px"} py={12}>
        <Header
          title="Lista de Agendamentos"
          subtitle="Confira aqui o seu agendamento."
        />
        <ScheduleList />
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