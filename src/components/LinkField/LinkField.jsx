import { Stack, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const LinkField = ({ to, linkText, description }) => {
  return (
    <Stack pt={6}>
      <Text align={"center"}>
        {description}
        <br />
        <ChakraLink as={Link} to={to} color={"purple.400"}>
          {linkText}
        </ChakraLink>
      </Text>
    </Stack>
  );
};

export default LinkField;
