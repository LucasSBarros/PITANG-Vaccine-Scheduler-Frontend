import { Stack, Heading, Text } from "@chakra-ui/react";

const Header = ({ title, subtitle }) => (
  <Stack align={"center"}>
    <Heading fontSize={"xxx-large"} textAlign={"center"}>
      {title}
    </Heading>
    <Text fontSize={"larger"} color={"gray.600"} textAlign={"center"}>
      {subtitle}
    </Text>
  </Stack>
);

export default Header;