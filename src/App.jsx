import { Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import RoutingSandbox from "@/components/pages/RoutingSandbox";
import React from "react";
import Layout from "@/components/organisms/Layout";
import Team from "@/components/pages/Team";
import Settings from "@/components/pages/Settings";
import APIKeys from "@/components/pages/APIKeys";
import Analytics from "@/components/pages/Analytics";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Projects from "@/components/pages/Projects";
import Dashboard from "@/components/pages/Dashboard";
import RoutingRules from "@/components/pages/RoutingRules";

function App() {
  return (
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
          <Route path="sandbox" element={<RoutingSandbox />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </motion.div>
  );
}

export default App;