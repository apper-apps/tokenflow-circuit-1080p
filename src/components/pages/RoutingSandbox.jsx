import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { sandboxService } from "@/services/api/sandboxService";
import { routingRuleService } from "@/services/api/routingRuleService";
import { toast } from "react-toastify";

const RoutingSandbox = () => {
  const [rules, setRules] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const [customInput, setCustomInput] = useState({
    model: "",
    tokens: "",
    complexity: "medium"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rulesData, scenariosData] = await Promise.all([
        routingRuleService.getAll(),
        sandboxService.getScenarios()
      ]);
      setRules(rulesData);
      setScenarios(scenariosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunTest = async () => {
    if (!selectedRule) {
      toast.error("Please select a routing rule to test");
      return;
    }

    try {
      setTesting(true);
      const testData = selectedScenario || {
        model: customInput.model,
        tokens: parseInt(customInput.tokens),
        complexity: customInput.complexity
      };

      const result = await sandboxService.runTest(selectedRule.Id, testData);
      setTestResults(result);
      toast.success("Test completed successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      const config = {
        ruleId: selectedRule?.Id,
        scenario: selectedScenario || customInput,
        results: testResults
      };
      await sandboxService.saveConfiguration(config);
      toast.success("Configuration saved successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetTest = () => {
    setSelectedRule(null);
    setSelectedScenario(null);
    setTestResults(null);
    setCustomInput({ model: "", tokens: "", complexity: "medium" });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading variant="default" />;
  }

  if (error) {
    return <Error onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">Routing Sandbox</h1>
          <p className="text-surface-400 mt-1">
            Test and validate routing rules safely without affecting production
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={resetTest}>
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Reset Test
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSaveConfiguration}
            disabled={!testResults}
          >
            <ApperIcon name="Save" size={16} className="mr-2" />
            Save Config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rule Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">
              Select Routing Rule
            </h3>
            <div className="space-y-3">
              {rules.map((rule) => (
                <motion.div
                  key={rule.Id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedRule?.Id === rule.Id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-surface-600 bg-surface-800 hover:border-surface-500"
                  }`}
                  onClick={() => setSelectedRule(rule)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-50">{rule.name}</p>
                      <p className="text-sm text-surface-400">{rule.description}</p>
                    </div>
                    <Badge variant={rule.priority === 'cost' ? 'success' : 'primary'}>
                      {rule.priority}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Test Scenario */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-surface-50 mb-4">
              Test Scenario
            </h3>
            
            {/* Predefined Scenarios */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-surface-300">Predefined Scenarios</p>
              {scenarios.map((scenario) => (
                <motion.div
                  key={scenario.Id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedScenario?.Id === scenario.Id
                      ? "border-secondary-500 bg-secondary-500/10"
                      : "border-surface-600 bg-surface-800 hover:border-surface-500"
                  }`}
                  onClick={() => setSelectedScenario(scenario)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-surface-50 text-sm">{scenario.name}</p>
                      <p className="text-xs text-surface-400">{scenario.description}</p>
                    </div>
                    <Badge variant="outline" size="sm">
                      {scenario.tokens} tokens
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-surface-300">Or Create Custom Test</p>
              <Input
                placeholder="Model (e.g., gpt-4, claude-3)"
                value={customInput.model}
                onChange={(e) => setCustomInput({...customInput, model: e.target.value})}
                disabled={selectedScenario}
              />
              <Input
                placeholder="Token count"
                type="number"
                value={customInput.tokens}
                onChange={(e) => setCustomInput({...customInput, tokens: e.target.value})}
                disabled={selectedScenario}
              />
              <Select
                value={customInput.complexity}
                onChange={(value) => setCustomInput({...customInput, complexity: value})}
                disabled={selectedScenario}
                options={[
                  { value: "simple", label: "Simple Query" },
                  { value: "medium", label: "Medium Complexity" },
                  { value: "complex", label: "Complex Analysis" }
                ]}
              />
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Controls */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-surface-50">Run Test</h3>
                <p className="text-sm text-surface-400">
                  Execute the selected rule against your test scenario
                </p>
              </div>
              <Button 
                variant="primary" 
                onClick={handleRunTest}
                disabled={!selectedRule || testing}
              >
                {testing ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Play" size={16} className="mr-2" />
                    Run Test
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Test Results */}
          {testResults && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-surface-50 mb-6">Test Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Routing Decision */}
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-200">Routing Decision</h4>
                  <div className="p-4 bg-surface-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-400">Selected Provider</span>
                      <Badge variant="primary">{testResults.selectedProvider}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-400">Model</span>
                      <span className="text-sm text-surface-200">{testResults.model}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-400">Confidence</span>
                      <span className="text-sm text-accent-400">{testResults.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Cost Analysis */}
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-200">Cost Analysis</h4>
                  <div className="p-4 bg-surface-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-400">Estimated Cost</span>
                      <span className="text-sm text-surface-200">${testResults.cost.estimated}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-400">Alternative Cost</span>
                      <span className="text-sm text-surface-200">${testResults.cost.alternative}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-400">Savings</span>
                      <span className="text-sm text-accent-400">${testResults.cost.savings}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-200">Performance</h4>
                  <div className="p-4 bg-surface-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-400">Expected Latency</span>
                      <span className="text-sm text-surface-200">{testResults.performance.latency}ms</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-surface-400">Throughput</span>
                      <span className="text-sm text-surface-200">{testResults.performance.throughput} req/s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-surface-400">Reliability</span>
                      <span className="text-sm text-accent-400">{testResults.performance.reliability}%</span>
                    </div>
                  </div>
                </div>

                {/* Optimization Suggestions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-surface-200">Suggestions</h4>
                  <div className="p-4 bg-surface-800 rounded-lg">
                    <div className="space-y-2">
                      {testResults.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <ApperIcon name="Lightbulb" size={14} className="text-accent-400 mt-0.5" />
                          <span className="text-sm text-surface-300">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!testResults && (
            <Card className="p-12 text-center">
              <ApperIcon name="TestTube" size={48} className="mx-auto text-surface-600 mb-4" />
              <h3 className="text-lg font-medium text-surface-300 mb-2">
                Ready to Test
              </h3>
              <p className="text-surface-500 mb-6">
                Select a routing rule and test scenario to begin validation
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedRule ? 'bg-accent-500' : 'bg-surface-600'}`}></div>
                  <span className="text-sm text-surface-400">Rule Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedScenario || customInput.model ? 'bg-accent-500' : 'bg-surface-600'}`}></div>
                  <span className="text-sm text-surface-400">Scenario Ready</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutingSandbox;