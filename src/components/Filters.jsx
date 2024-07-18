import { Stack } from "@chakra-ui/react";
import DateField from "./DateField";
import TimeField from "./TimeField";

const Filters = ({ control, setValue, trigger, filterTime }) => {
  const handleFilterTimeChange = (e) => {
    setValue("filterTime", e.target.value);
    trigger("filterTime");
  };

  return (
    <Stack direction="row" spacing={4} mb={4}>
      <DateField
        id="filterDate"
        label="Filtrar por data"
        control={control}
        setValue={setValue}
        trigger={trigger}
        errorMessage={null}
      />
      <TimeField
        id="filterTime"
        label="Filtrar por horário"
        register={() => ({
          onChange: handleFilterTimeChange,
          value: filterTime,
        })}
        setValue={(name, value) =>
          handleFilterTimeChange({ target: { value } })
        }
        trigger={() => {}}
        errorMessage={null}
      />
    </Stack>
  );
};

export default Filters;
