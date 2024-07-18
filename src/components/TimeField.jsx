import { FormControl, FormLabel, Select, FormErrorMessage } from "@chakra-ui/react";

const TimeField = ({ id, label, register, setValue, trigger, errorMessage }) => {
  return (
    <FormControl id={id} isInvalid={!!errorMessage}>
      <FormLabel>{label}</FormLabel>
      <Select
        {...register(id)}
        placeholder="--:--"
        onChange={(e) => {
          setValue(id, e.target.value);
          trigger(id);
        }}
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
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default TimeField;