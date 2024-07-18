import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes.jsx";
import { ModalProvider } from "./context/ModalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <ModalProvider>
      <AppRoutes />
    </ModalProvider>
  </ChakraProvider>
);
