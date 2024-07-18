import {
  Flex,
  Box,
  Stack,
  Button,
  Heading,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import fetcher from "../services/api";
import pacientSchema from "../schemas/pacient.schema";
import scheduleSchema from "../schemas/schedule.schema";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import FormField from "../components/FormField.jsx";
import DateField from "../components/DateField.jsx";
import TimeField from "../components/TimeField.jsx";

const ScheduleFormPage = () => {
  const combinedSchema = pacientSchema.merge(
    scheduleSchema.omit({ pacientId: true })
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(combinedSchema),
    mode: "onBlur",
  });

  const toast = useToast();

  const toSchedule = async (form) => {
    try {
      const pacientResponse = await fetcher.post("/api/pacient", {
        fullName: form.fullName,
        birthDate: form.birthDate,
      });

      const pacientId = pacientResponse.data.id;

      await fetcher.post("/api/schedule", {
        pacientId: pacientId,
        scheduleDate: form.scheduleDate,
        scheduleTime: form.scheduleTime,
      });

      toast({
        status: "success",
        title: "Sucesso",
        description: "Agendamento realizado com sucesso.",
        isClosable: true,
      });

      localStorage.removeItem("scheduleForm");
    } catch (error) {
      toast({
        status: "error",
        title: "Algo deu errado...",
        description: error.cause || error.message,
        isClosable: true,
      });
    }
  };

  const formValues = watch();

  useEffect(() => {
    const savedForm = JSON.parse(localStorage.getItem("scheduleForm"));
    if (savedForm) {
      for (const [key, value] of Object.entries(savedForm)) {
        setValue(key, value, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [setValue]);

  useEffect(() => {
    localStorage.setItem("scheduleForm", JSON.stringify(formValues));
  }, [formValues]);

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
          <Stack as="form" onSubmit={handleSubmit(toSchedule)} spacing={4}>
            <FormField
              id="fullName"
              label="Nome Completo"
              type="text"
              register={register}
              errorMessage={errors.fullName?.message}
            />

            <DateField
              id="birthDate"
              label="Data de Nascimento"
              control={control}
              setValue={setValue}
              trigger={trigger}
              errorMessage={errors.birthDate?.message}
            />

            <DateField
              id="scheduleDate"
              label="Data do Agendamento"
              control={control}
              setValue={setValue}
              trigger={trigger}
              errorMessage={errors.scheduleDate?.message}
            />

            <TimeField
              id="scheduleTime"
              label="Horário do Agendamento"
              register={register}
              setValue={setValue}
              trigger={trigger}
              errorMessage={errors.scheduleTime?.message}
            />

            <Stack spacing={10} pt={2}>
              <Button
                isLoading={isSubmitting}
                isDisabled={!isValid}
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={"purple.500"}
                color={"white"}
                _hover={{
                  bg: "purple.800",
                }}
              >
                Agendar
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Já realizou o seu agendamento?
                <br />
                <ChakraLink as={Link} to="/schedulelist" color={"purple.400"}>
                  Consultar Lista de Agendamentos
                </ChakraLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default ScheduleFormPage;
