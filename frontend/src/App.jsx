import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Containers from "./pages/Containers/Containers";
import Deployments from "./pages/Deployments/Deployments";
import Logs from "./pages/Logs/Logs";
import Alerts from "./pages/Alerts/Alerts";

export default function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/deployments" element={<Deployments />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/alerts" element={<Alerts />} />
        {/* We will add other routes here as we implement features */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </DashboardLayout>
  );
}