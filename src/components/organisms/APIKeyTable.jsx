import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import StatusIndicator from "@/components/molecules/StatusIndicator";

const APIKeyTable = ({ apiKeys, onValidate, onDelete }) => {
  const providerIcons = {
    "OpenAI": "Brain",
    "Anthropic": "MessageSquare",
    "Google": "Search",
    "Cohere": "Cpu",
    "Mistral": "Zap"
  };

  const getProviderIcon = (provider) => {
    return providerIcons[provider] || "Key";
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-700">
              <th className="text-left p-4 text-sm font-semibold text-surface-200">Provider</th>
              <th className="text-left p-4 text-sm font-semibold text-surface-200">Key Name</th>
              <th className="text-left p-4 text-sm font-semibold text-surface-200">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-surface-200">Last Validated</th>
              <th className="text-left p-4 text-sm font-semibold text-surface-200">Usage</th>
              <th className="text-right p-4 text-sm font-semibold text-surface-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key, index) => (
              <motion.tr
                key={key.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getProviderIcon(key.provider)} size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-surface-200">{key.provider}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-surface-200">{key.name}</p>
                    <p className="text-sm text-surface-400">
                      {key.encryptedKey ? "••••••••" + key.encryptedKey.slice(-4) : "No key"}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <StatusIndicator 
                    status={key.status} 
                    label={key.status} 
                    showDot={true}
                    showIcon={false}
                  />
                </td>
                <td className="p-4">
                  <span className="text-sm text-surface-400">
                    {key.lastValidated ? new Date(key.lastValidated).toLocaleDateString() : "Never"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-surface-400">Requests:</span>
                      <Badge variant="outline" size="sm">{key.monthlyRequests || 0}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-surface-400">Cost:</span>
                      <span className="text-sm font-medium text-accent-400">
                        ${(key.monthlyCost || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onValidate(key.Id)}
                    >
                      <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                      Validate
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(key.Id)}
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default APIKeyTable;