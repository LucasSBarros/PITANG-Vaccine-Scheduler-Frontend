import { Flex, Box, Stack, useColorModeValue } from "@chakra-ui/react";
import ScheduleForm from "../components/ScheduleForm/ScheduleForm";
import Header from "../components/Header/Header";

const ScheduleFormPage = () => {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("white", "black")}
      role="main" 
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Header
          title="Agendamentos"
          subtitle="Agende sua vacina contra COVID-19 através deste formulário."
        />
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "black")}
          boxShadow={"2xl"}
          p={8}
          role="article"
        >
          <ScheduleForm />
        </Box>
      </Stack>
    </Flex>
  );
};

export default ScheduleFormPage;
