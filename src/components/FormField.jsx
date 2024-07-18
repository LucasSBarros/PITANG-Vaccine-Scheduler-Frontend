import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

const FormField = ({ id, label, type, register, errorMessage }) => {
  return (
    <FormControl id={id} isInvalid={!!errorMessage}>
      <FormLabel>{label}</FormLabel>
      <Input type={type} {...register(id)} />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default FormField;