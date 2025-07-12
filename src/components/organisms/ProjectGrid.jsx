import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import StatusIndicator from "@/components/molecules/StatusIndicator";

const ProjectGrid = ({ projects }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <motion.div key={project.Id} variants={itemVariants}>
          <Link to={`/projects/${project.Id}`}>
            <Card className="p-6 group cursor-pointer" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FolderOpen" size={20} className="text-white" />
                  </div>
<div>
                    <h3 className="text-lg font-semibold text-surface-50 group-hover:text-primary-400 transition-colors">
                      {project.Name || project.name}
                    </h3>
                    <p className="text-sm text-surface-400">{project.description}</p>
                  </div>
                </div>
                <StatusIndicator 
                  status={project.status} 
                  label={project.status} 
                  showIcon={false}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">API Keys</span>
                  <Badge variant="outline" size="sm">
                    {project.apiKeys?.length || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Routing Rules</span>
                  <Badge variant="outline" size="sm">
                    {project.routingRules?.length || 0}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Monthly Requests</span>
                  <span className="text-sm font-medium text-surface-200">
                    {(project.monthly_requests || project.monthlyRequests || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Cost This Month</span>
                  <span className="text-sm font-semibold text-accent-400">
                    ${(project.monthly_cost || project.monthlyCost || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectGrid;