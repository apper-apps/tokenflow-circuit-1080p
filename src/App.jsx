import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Projects from "@/components/pages/Projects";
import ProjectDetail from "@/components/pages/ProjectDetail";
import APIKeys from "@/components/pages/APIKeys";
import RoutingRules from "@/components/pages/RoutingRules";
import Analytics from "@/components/pages/Analytics";
import Team from "@/components/pages/Team";
import Settings from "@/components/pages/Settings";

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
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </motion.div>
  );
}

export default App;