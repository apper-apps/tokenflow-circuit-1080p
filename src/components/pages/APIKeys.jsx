import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import APIKeyTable from "@/components/organisms/APIKeyTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { apiKeyService } from "@/services/api/apiKeyService";
import { toast } from "react-toastify";

const APIKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState({
    provider: "",
    name: "",
    encryptedKey: ""
  });

  const providerOptions = [
    { value: "", label: "Select Provider" },
    { value: "OpenAI", label: "OpenAI" },
    { value: "Anthropic", label: "Anthropic" },
    { value: "Google", label: "Google Gemini" },
    { value: "Cohere", label: "Cohere" },
    { value: "Mistral", label: "Mistral" }
  ];

  const loadAPIKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiKeyService.getAll();
      setApiKeys(result);
      setFilteredKeys(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (term.trim() === "") {
      setFilteredKeys(apiKeys);
} else {
      const filtered = apiKeys.filter(key =>
        (key.provider || "").toLowerCase().includes(term.toLowerCase()) ||
        (key.Name || key.name || "").toLowerCase().includes(term.toLowerCase())
      );
      setFilteredKeys(filtered);
    }
  };

  const handleAddKey = async () => {
    try {
      if (!newKey.provider || !newKey.name || !newKey.encryptedKey) {
        toast.error("Please fill in all fields");
        return;
      }

const result = await apiKeyService.create({
        Name: newKey.name,
        provider: newKey.provider,
        encrypted_key: newKey.encryptedKey,
        status: "pending",
        last_validated: null
      });

      setApiKeys([...apiKeys, result]);
      setFilteredKeys([...filteredKeys, result]);
      setNewKey({ provider: "", name: "", encryptedKey: "" });
      setShowAddForm(false);
      toast.success("API key added successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleValidate = async (keyId) => {
    try {
      const updatedKey = await apiKeyService.update(keyId, { status: "active" });
      const updatedKeys = apiKeys.map(key => 
        key.Id === keyId ? updatedKey : key
      );
      setApiKeys(updatedKeys);
      setFilteredKeys(updatedKeys);
      toast.success("API key validated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (keyId) => {
    try {
      await apiKeyService.delete(keyId);
      const updatedKeys = apiKeys.filter(key => key.Id !== keyId);
      setApiKeys(updatedKeys);
      setFilteredKeys(updatedKeys);
      toast.success("API key deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    loadAPIKeys();
  }, []);

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return <Error onRetry={loadAPIKeys} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">API Keys</h1>
          <p className="text-surface-400 mt-1">
            Manage your LLM provider API keys and authentication
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddForm(true)}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add API Key
        </Button>
      </div>

      {/* Add Key Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-50">Add New API Key</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Provider"
                options={providerOptions}
                value={newKey.provider}
                onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
              />
              <Input
                label="Key Name"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                placeholder="My OpenAI Key"
              />
              <Input
                label="API Key"
                type="password"
                value={newKey.encryptedKey}
                onChange={(e) => setNewKey({ ...newKey, encryptedKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="primary" onClick={handleAddKey}>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Key
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search API keys..."
          className="flex-1"
        />
        <Button variant="outline" size="sm">
          <ApperIcon name="Filter" size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {/* API Keys Table */}
      {filteredKeys.length === 0 ? (
        <Empty
          title="No API keys found"
          message="Add your first API key to start optimizing your LLM requests."
          icon="Key"
          actionLabel="Add API Key"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <APIKeyTable 
          apiKeys={filteredKeys}
          onValidate={handleValidate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default APIKeys;