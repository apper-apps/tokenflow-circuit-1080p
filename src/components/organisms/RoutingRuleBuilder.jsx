import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";

const RoutingRuleBuilder = ({ rules, onSave, onDelete }) => {
  const [selectedRule, setSelectedRule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const priorityOptions = [
    { value: "cost", label: "Cost Optimization" },
    { value: "speed", label: "Speed Optimization" },
    { value: "reliability", label: "Reliability" },
    { value: "balanced", label: "Balanced" }
  ];

  const providerOptions = [
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google Gemini" },
    { value: "cohere", label: "Cohere" },
    { value: "mistral", label: "Mistral" }
  ];

  const handleRuleSelect = (rule) => {
    setSelectedRule(rule);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedRule) {
      onSave(selectedRule);
      setIsEditing(false);
      setSelectedRule(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rules List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-50">Routing Rules</h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedRule({
                Id: Date.now(),
                name: "",
                priority: "balanced",
                conditions: {},
                targetProvider: "openai",
                fallbackProviders: []
              });
              setIsEditing(true);
            }}
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Rule
          </Button>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-surface-700 rounded-lg hover:border-surface-600 transition-colors cursor-pointer"
              onClick={() => handleRuleSelect(rule)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-surface-200">{rule.name}</h4>
                <Badge variant="outline" size="sm">
                  Priority: {rule.priority}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-surface-400">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Target" size={16} />
                  <span>{rule.targetProvider}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Shield" size={16} />
                  <span>{rule.fallbackProviders?.length || 0} fallbacks</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Rule Editor */}
      {isEditing && selectedRule && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-50">
              {selectedRule.Id ? "Edit Rule" : "New Rule"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setSelectedRule(null);
              }}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              label="Rule Name"
              value={selectedRule.name}
              onChange={(e) => setSelectedRule({
                ...selectedRule,
                name: e.target.value
              })}
              placeholder="Enter rule name"
            />

            <Select
              label="Priority"
              options={priorityOptions}
              value={selectedRule.priority}
              onChange={(e) => setSelectedRule({
                ...selectedRule,
                priority: e.target.value
              })}
            />

            <Select
              label="Primary Provider"
              options={providerOptions}
              value={selectedRule.targetProvider}
              onChange={(e) => setSelectedRule({
                ...selectedRule,
                targetProvider: e.target.value
              })}
            />

            <div>
              <label className="block text-sm font-medium text-surface-200 mb-2">
                Conditions
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Cost ($)"
                  type="number"
                  placeholder="0.01"
                  value={selectedRule.conditions?.maxCost || ""}
                  onChange={(e) => setSelectedRule({
                    ...selectedRule,
                    conditions: {
                      ...selectedRule.conditions,
                      maxCost: e.target.value
                    }
                  })}
                />
                <Input
                  label="Max Latency (ms)"
                  type="number"
                  placeholder="1000"
                  value={selectedRule.conditions?.maxLatency || ""}
                  onChange={(e) => setSelectedRule({
                    ...selectedRule,
                    conditions: {
                      ...selectedRule.conditions,
                      maxLatency: e.target.value
                    }
                  })}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-1"
              >
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Rule
              </Button>
              
              {selectedRule.Id && (
                <Button
                  variant="danger"
                  onClick={() => {
                    onDelete(selectedRule.Id);
                    setIsEditing(false);
                    setSelectedRule(null);
                  }}
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RoutingRuleBuilder;