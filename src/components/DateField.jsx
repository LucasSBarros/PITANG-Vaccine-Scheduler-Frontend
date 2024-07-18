import { FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

const DateField = ({ id, label, control, setValue, trigger, errorMessage }) => {
  return (
    <FormControl id={id} isInvalid={!!errorMessage}>
      <FormLabel>{label}</FormLabel>
      <Controller
        control={control}
        name={id}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date) => {
              setValue(id, date);
              trigger(id);
            }}
            dateFormat="dd/MM/yyyy"
            customInput={<Input width={"25em"} />}
          />
        )}
      />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default DateField;