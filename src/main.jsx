import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <AppRoutes />
  </ChakraProvider>
);
