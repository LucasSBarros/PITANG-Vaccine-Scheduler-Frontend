import { Flex, Button, Text } from "@chakra-ui/react";

const PaginationControls = ({
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}) => (
  <Flex mt={4} justifyContent="space-between">
    <Button
      onClick={handlePreviousPage}
      isDisabled={currentPage === 1}
      colorScheme="purple"
    >
      Anterior
    </Button>
    <Text>
      Página {currentPage} de {totalPages}
    </Text>
    <Button
      onClick={handleNextPage}
      isDisabled={currentPage === totalPages}
      colorScheme="purple"
    >
      Próxima
    </Button>
  </Flex>
);

export default PaginationControls;
