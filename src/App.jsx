import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Clients from "./pages/Clients.jsx";
import ClientProfile from "./pages/ClientProfile.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Services from "./pages/Services.jsx";
import Quotes from "./pages/Quotes.jsx";
import Invoices from "./pages/Invoices.jsx";
import Tasks from "./pages/Tasks.jsx";
import Revisions from "./pages/Revisions.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/clients/:id" element={<ClientProfile />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/revisions" element={<Revisions />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
