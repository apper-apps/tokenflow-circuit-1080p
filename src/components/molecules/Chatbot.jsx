import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your TokenFlow assistant. I can help you optimize your token usage, understand API endpoints, and troubleshoot issues. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    'How to optimize token usage?',
    'What are the API rate limits?',
    'Best practices for cost reduction',
    'How to implement caching?'
  ];

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate API response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('token') && lowerMessage.includes('optim')) {
      return `Here are key strategies for token optimization:

1. **Use Shorter Prompts**: Be concise and specific in your requests
2. **Implement Caching**: Cache responses for repeated queries
3. **Batch Requests**: Combine multiple small requests when possible
4. **Choose Right Models**: Use smaller models for simple tasks
5. **Set Max Tokens**: Always set appropriate token limits

Would you like me to explain any of these strategies in detail?`;
    }
    
    if (lowerMessage.includes('api') && (lowerMessage.includes('endpoint') || lowerMessage.includes('rate'))) {
      return `TokenFlow API Information:

**Base URL**: \`https://api.tokenflow.pro/v1\`

**Key Endpoints**:
- \`/chat/completions\` - Chat completions
- \`/models\` - Available models
- \`/usage\` - Token usage stats
- \`/billing\` - Billing information

**Rate Limits**:
- Free Tier: 1,000 requests/hour
- Pro Tier: 10,000 requests/hour
- Enterprise: Custom limits

Need help with a specific endpoint?`;
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('reduc') || lowerMessage.includes('save')) {
      return `Cost Reduction Tips:

💡 **Smart Model Selection**
- Use GPT-3.5 for simple tasks (90% cheaper)
- Reserve GPT-4 for complex reasoning

💡 **Optimize Prompts**
- Remove unnecessary context
- Use bullet points instead of prose
- Set appropriate max_tokens

💡 **Implement Caching**
- Cache frequently asked questions
- Store common responses locally

💡 **Monitor Usage**
- Set up billing alerts
- Track token usage per feature

Average savings: 30-40% with these practices!`;
    }
    
    if (lowerMessage.includes('cache') || lowerMessage.includes('caching')) {
      return `Caching Best Practices:

**Client-Side Caching**:
\`\`\`javascript
// Simple cache implementation
const cache = new Map();
const cacheKey = JSON.stringify(prompt);
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
\`\`\`

**Server-Side Options**:
- Redis for distributed caching
- In-memory caching for single instance
- Database caching for persistence

**Cache Strategies**:
- TTL-based expiration
- LRU eviction policy
- Cache by user/session context

Need help implementing a specific caching solution?`;
    }
    
    return `I understand you're asking about "${userMessage}". 

I can help you with:
🔹 Token optimization strategies
🔹 API endpoint documentation  
🔹 Cost reduction techniques
🔹 Implementation best practices
🔹 Troubleshooting common issues

Could you be more specific about what you'd like to know? Or try one of the quick suggestions below!`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl h-[600px] bg-surface-800 rounded-lg border border-surface-600 flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="MessageSquare" size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-50">TokenFlow Assistant</h3>
              <p className="text-xs text-surface-400">AI-powered token optimization help</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary-600 text-white ml-12' 
                    : 'bg-surface-700 text-surface-100 mr-12'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-surface-700 p-3 rounded-lg mr-12">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-surface-600">
            <p className="text-xs text-surface-400 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-surface-600">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about token optimization..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <ApperIcon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;