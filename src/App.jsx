import { Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import HelpCenter from "@/components/pages/HelpCenter";
import { ThemeProvider } from "@/hooks/useTheme";
import Layout from "@/components/organisms/Layout";
import RoutingSandbox from "@/components/pages/RoutingSandbox";
import Team from "@/components/pages/Team";
import Settings from "@/components/pages/Settings";
import APIKeys from "@/components/pages/APIKeys";
import Analytics from "@/components/pages/Analytics";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Projects from "@/components/pages/Projects";
import Dashboard from "@/components/pages/Dashboard";
import RoutingRules from "@/components/pages/RoutingRules";
import Workspaces from "@/components/pages/Workspaces";
import { WorkspaceProvider } from "@/hooks/useWorkspace";

function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-900 to-surface-800"
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="api-keys" element={<APIKeys />} />
            <Route path="routing-rules" element={<RoutingRules />} />
            <Route path="workspaces" element={<Workspaces />} />
            <Route path="sandbox" element={<RoutingSandbox />} />
<Route path="analytics" element={<Analytics />} />
            <Route path="team" element={<Team />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </motion.div>
      </WorkspaceProvider>
</ThemeProvider>
  );
}

export default App;