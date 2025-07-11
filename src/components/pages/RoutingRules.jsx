import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import RoutingRuleBuilder from "@/components/organisms/RoutingRuleBuilder";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { routingRuleService } from "@/services/api/routingRuleService";
import { toast } from "react-toastify";

const RoutingRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await routingRuleService.getAll();
      setRules(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (rule) => {
    try {
      let result;
      if (rule.Id && rules.find(r => r.Id === rule.Id)) {
        result = await routingRuleService.update(rule.Id, rule);
        setRules(rules.map(r => r.Id === rule.Id ? result : r));
        toast.success("Rule updated successfully");
      } else {
        result = await routingRuleService.create(rule);
        setRules([...rules, result]);
        toast.success("Rule created successfully");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await routingRuleService.delete(ruleId);
      setRules(rules.filter(rule => rule.Id !== ruleId));
      toast.success("Rule deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  if (loading) {
    return <Loading variant="default" />;
  }

  if (error) {
    return <Error onRetry={loadRules} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Routing Rules</h1>
          <p className="text-surface-400 mt-1">
            Configure intelligent routing logic for optimal cost and performance
          </p>
</div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/sandbox'}>
            <ApperIcon name="Play" size={16} className="mr-2" />
            Test Rules
          </Button>
          <Button variant="primary" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export Config
          </Button>
        </div>
      </div>

      {/* Rule Builder */}
      {rules.length === 0 ? (
        <Empty
          title="No routing rules configured"
          message="Create your first routing rule to start optimizing your AI requests."
          icon="GitBranch"
          actionLabel="Create Rule"
          onAction={() => {}}
        />
      ) : (
        <RoutingRuleBuilder
          rules={rules}
          onSave={handleSaveRule}
          onDelete={handleDeleteRule}
        />
      )}
    </div>
  );
};

export default RoutingRules;