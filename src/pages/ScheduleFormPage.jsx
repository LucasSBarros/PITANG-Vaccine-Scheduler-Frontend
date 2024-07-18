import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ScheduleForm from "../components/ScheduleForm";

const ScheduleFormPage = () => {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("white", "black")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"xxx-large"} color={"black"} textAlign={"center"}>
            Agendamento
          </Heading>
          <Text fontSize={"larger"} color={"black"} textAlign={"center"}>
            Agende sua vacina contra a COVID-19 através deste formulário.
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "black")}
          boxShadow={"2xl"}
          p={8}
        >
          <ScheduleForm />
        </Box>
      </Stack>
    </Flex>
  );
};

export default ScheduleFormPage;
