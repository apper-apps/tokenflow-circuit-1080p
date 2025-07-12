import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectGrid from "@/components/organisms/ProjectGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await projectService.getAll();
      setProjects(result);
      setFilteredProjects(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredProjects(projects);
} else {
      const filtered = projects.filter(project =>
        (project.Name || project.name || "").toLowerCase().includes(term.toLowerCase()) ||
        (project.description || "").toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const handleCreateProject = () => {
    toast.info("Project creation dialog would open here");
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <Error onRetry={loadProjects} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Projects</h1>
          <p className="text-surface-400 mt-1">
            Manage your AI optimization projects and configurations
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateProject}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search projects..."
          className="flex-1"
        />
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="SortAsc" size={16} className="mr-2" />
            Sort
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title="No projects found"
          message={searchTerm ? "No projects match your search criteria." : "Create your first project to get started with AI token optimization."}
          icon="FolderOpen"
          actionLabel="Create Project"
          onAction={handleCreateProject}
        />
      ) : (
        <ProjectGrid projects={filteredProjects} />
      )}
    </div>
  );
};

export default Projects;