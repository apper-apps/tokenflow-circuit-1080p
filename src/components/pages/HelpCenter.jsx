import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Chatbot from '@/components/molecules/Chatbot';
import { helpService } from '@/services/api/helpService';

const HelpCenter = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await helpService.getAll();
      setArticles(data);
    } catch (error) {
      console.error('Failed to load help articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'api', 'tokens', 'optimization', 'troubleshooting'];

  const getCategoryIcon = (category) => {
    const icons = {
      api: 'Code',
      tokens: 'Coins',
      optimization: 'Zap',
      troubleshooting: 'AlertCircle',
      all: 'BookOpen'
    };
    return icons[category] || 'BookOpen';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Help Center</h1>
          <p className="text-surface-400 mt-1">Find answers and optimize your token usage</p>
        </div>
        <Button 
          onClick={() => setShowChatbot(true)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <ApperIcon name="MessageSquare" size={16} className="mr-2" />
          Chat Assistant
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
            />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                <ApperIcon 
                  name={getCategoryIcon(category)} 
                  size={14} 
                  className="mr-1" 
                />
                {category === 'all' ? 'All Articles' : category}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:bg-surface-700 transition-colors cursor-pointer group">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Code" size={20} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">API Endpoints</h3>
          </div>
          <p className="text-surface-300 text-sm mb-4">Access TokenFlow API documentation and endpoint references</p>
          <div className="space-y-2">
            <div className="text-xs text-surface-400">Base URL:</div>
            <code className="text-xs bg-surface-800 p-2 rounded block text-primary-300">
              https://api.tokenflow.pro/v1
            </code>
          </div>
        </Card>

        <Card className="p-6 hover:bg-surface-700 transition-colors cursor-pointer group">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">Token Optimization</h3>
          </div>
          <p className="text-surface-300 text-sm mb-4">Learn best practices for reducing token usage and costs</p>
          <div className="flex items-center text-xs text-accent-400">
            <ApperIcon name="TrendingUp" size={14} className="mr-1" />
            Save up to 40% on API costs
          </div>
        </Card>

        <Card className="p-6 hover:bg-surface-700 transition-colors cursor-pointer group">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-secondary-500/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageSquare" size={20} className="text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-50">Live Support</h3>
          </div>
          <p className="text-surface-300 text-sm mb-4">Get instant help with our AI-powered chat assistant</p>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowChatbot(true)}
            className="w-full group-hover:bg-secondary-600 group-hover:border-secondary-600"
          >
            Start Chat
          </Button>
        </Card>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-surface-50">
          Knowledge Base
          <span className="text-sm text-surface-400 ml-2">
            ({filteredArticles.length} articles)
          </span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-surface-700 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-700 rounded w-full"></div>
                  <div className="h-3 bg-surface-700 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:bg-surface-700 transition-colors cursor-pointer group">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ApperIcon 
                        name={getCategoryIcon(article.category)} 
                        size={16} 
                        className="text-primary-400" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-surface-50 group-hover:text-primary-300 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-surface-400 text-sm mt-1 line-clamp-2">
                        {article.content.substring(0, 120)}...
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-surface-500 capitalize bg-surface-800 px-2 py-1 rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-surface-500">
                          {article.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <Card className="p-12 text-center">
            <ApperIcon name="Search" size={48} className="text-surface-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-50 mb-2">No articles found</h3>
            <p className="text-surface-400">
              Try adjusting your search terms or category filters
            </p>
          </Card>
        )}
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <Chatbot onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default HelpCenter;