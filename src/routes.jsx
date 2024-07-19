import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScheduleFormPage from "./pages/ScheduleFormPage.jsx";
import ScheduleListPage from "./pages/ScheduleListPage.jsx";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<ScheduleFormPage />} path="/" />
      <Route element={<ScheduleListPage />} path="/schedulelist" />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
