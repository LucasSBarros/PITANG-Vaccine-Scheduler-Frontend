import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import LinkField from "./LinkField";

const renderWithChakraAndRouter = (ui) => {
  return render(
    <ChakraProvider>
      <Router>{ui}</Router>
    </ChakraProvider>
  );
};

it("renderiza LinkField com linkText e description", () => {
  renderWithChakraAndRouter(
    <LinkField
      to="/test"
      linkText="Texto do Link"
      description="Descrição do Link"
    />
  );

  expect(screen.getByText("Descrição do Link")).toBeInTheDocument();
  expect(screen.getByText("Texto do Link")).toBeInTheDocument();
});

it("link contém o href correto", () => {
  renderWithChakraAndRouter(
    <LinkField
      to="/test"
      linkText="Texto do Link"
      description="Descrição do Link"
    />
  );

  const linkElement = screen.getByText("Texto do Link");
  expect(linkElement.closest("a")).toHaveAttribute("href", "/test");
});
