import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { projectService } from "../services/api/projectService.js";
import { sandboxService } from "../services/api/sandboxService.js";
import { apiKeyService } from "../services/api/apiKeyService.js";
import { workspaceService } from "../services/api/workspaceService.js";
import { routingRuleService } from "../services/api/routingRuleService.js";
import { analyticsService } from "../services/api/analyticsService.js";
import { teamService } from "../services/api/teamService.js";
import { dashboardService } from "../services/api/dashboardService.js";
import { providerMonitorService } from "../services/api/providerMonitorService.js";

// Node.js globals
const process = globalThis.process;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handler middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generic CRUD route factory
const createCrudRoutes = (router, service, basePath) => {
  // GET all items
  router.get(`/${basePath}`, asyncHandler(async (req, res) => {
    const items = await service.getAll();
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  }));

  // GET item by ID
  router.get(`/${basePath}/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format. ID must be an integer.'
      });
    }

    try {
      const item = await service.getById(id);
      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }));

  // POST create new item
  router.post(`/${basePath}`, asyncHandler(async (req, res) => {
    const item = await service.create(req.body);
    res.status(201).json({
      success: true,
      data: item,
      message: `${basePath.slice(0, -1)} created successfully`
    });
  }));

  // PUT update item
  router.put(`/${basePath}/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format. ID must be an integer.'
      });
    }

    try {
      const item = await service.update(id, req.body);
      res.json({
        success: true,
        data: item,
        message: `${basePath.slice(0, -1)} updated successfully`
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }));

  // DELETE item
  router.delete(`/${basePath}/:id`, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format. ID must be an integer.'
      });
    }

    try {
      await service.delete(id);
      res.json({
        success: true,
        message: `${basePath.slice(0, -1)} deleted successfully`
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }));
};

// API Router
const apiRouter = express.Router();

// Create CRUD routes for all services
createCrudRoutes(apiRouter, projectService, 'projects');
createCrudRoutes(apiRouter, apiKeyService, 'api-keys');
createCrudRoutes(apiRouter, workspaceService, 'workspaces');
createCrudRoutes(apiRouter, routingRuleService, 'routing-rules');
createCrudRoutes(apiRouter, analyticsService, 'analytics');
createCrudRoutes(apiRouter, teamService, 'team');

// Sandbox specific routes
apiRouter.get('/sandbox/scenarios', asyncHandler(async (req, res) => {
  const scenarios = await sandboxService.getScenarios();
  res.json({
    success: true,
    data: scenarios,
    count: scenarios.length
  });
}));

apiRouter.post('/sandbox/test', asyncHandler(async (req, res) => {
  const { ruleId, testData } = req.body;
  if (!ruleId || !testData) {
    return res.status(400).json({
      success: false,
      error: 'ruleId and testData are required'
    });
  }
  
  const result = await sandboxService.runTest(ruleId, testData);
  res.json({
    success: true,
    data: result
  });
}));

createCrudRoutes(apiRouter, sandboxService, 'sandbox/configurations');

// Dashboard specific routes
apiRouter.get('/dashboard/stats', asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.json({
    success: true,
    data: stats
  });
}));

apiRouter.get('/dashboard/recent-activity', asyncHandler(async (req, res) => {
  const activity = await dashboardService.getRecentActivity();
  res.json({
    success: true,
    data: activity
  });
}));

// Provider Monitor specific routes
apiRouter.get('/providers/status', asyncHandler(async (req, res) => {
  const status = await providerMonitorService.getProviderStatus();
  res.json({
    success: true,
    data: status
  });
}));

apiRouter.get('/providers/metrics', asyncHandler(async (req, res) => {
  const metrics = await providerMonitorService.getMetrics();
  res.json({
    success: true,
    data: metrics
  });
}));

// API Documentation endpoint
apiRouter.get('/docs', (req, res) => {
  const apiDocs = {
    title: 'TokenFlow Pro API Documentation',
    version: '1.0.0',
    description: 'Complete API documentation for TokenFlow Pro - LLM Gateway Management Platform',
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: {
      projects: {
        'GET /api/projects': 'Get all projects',
        'GET /api/projects/:id': 'Get project by ID',
        'POST /api/projects': 'Create new project',
        'PUT /api/projects/:id': 'Update project',
        'DELETE /api/projects/:id': 'Delete project'
      },
      apiKeys: {
        'GET /api/api-keys': 'Get all API keys',
        'GET /api/api-keys/:id': 'Get API key by ID',
        'POST /api/api-keys': 'Create new API key',
        'PUT /api/api-keys/:id': 'Update API key',
        'DELETE /api/api-keys/:id': 'Delete API key'
      },
      workspaces: {
        'GET /api/workspaces': 'Get all workspaces',
        'GET /api/workspaces/:id': 'Get workspace by ID',
        'POST /api/workspaces': 'Create new workspace',
        'PUT /api/workspaces/:id': 'Update workspace',
        'DELETE /api/workspaces/:id': 'Delete workspace'
      },
      routingRules: {
        'GET /api/routing-rules': 'Get all routing rules',
        'GET /api/routing-rules/:id': 'Get routing rule by ID',
        'POST /api/routing-rules': 'Create new routing rule',
        'PUT /api/routing-rules/:id': 'Update routing rule',
        'DELETE /api/routing-rules/:id': 'Delete routing rule'
      },
      sandbox: {
        'GET /api/sandbox/scenarios': 'Get all test scenarios',
        'POST /api/sandbox/test': 'Run sandbox test',
        'GET /api/sandbox/configurations': 'Get saved configurations',
        'POST /api/sandbox/configurations': 'Save test configuration',
        'DELETE /api/sandbox/configurations/:id': 'Delete configuration'
      },
      analytics: {
        'GET /api/analytics': 'Get analytics data',
        'GET /api/analytics/:id': 'Get specific analytics by ID'
      },
      team: {
        'GET /api/team': 'Get team members',
        'GET /api/team/:id': 'Get team member by ID',
        'POST /api/team': 'Add team member',
        'PUT /api/team/:id': 'Update team member',
        'DELETE /api/team/:id': 'Remove team member'
      },
      dashboard: {
        'GET /api/dashboard/stats': 'Get dashboard statistics',
        'GET /api/dashboard/recent-activity': 'Get recent activity'
      },
      providers: {
        'GET /api/providers/status': 'Get provider status',
        'GET /api/providers/metrics': 'Get provider metrics'
      }
    },
    authentication: {
      type: 'API Key',
      description: 'Include API key in request headers',
      header: 'Authorization: Bearer YOUR_API_KEY'
    },
    responseFormat: {
      success: {
        success: true,
        data: '// Response data',
        message: '// Optional success message'
      },
      error: {
        success: false,
        error: '// Error message',
        code: '// Optional error code'
      }
    },
    examples: {
      createProject: {
        url: 'POST /api/projects',
        body: {
          name: 'My New Project',
          description: 'Project description',
          provider: 'OpenAI'
        },
        response: {
          success: true,
          data: {
            Id: 1,
            name: 'My New Project',
            description: 'Project description',
            provider: 'OpenAI',
            createdAt: '2024-01-01T00:00:00.000Z'
          },
          message: 'project created successfully'
        }
      },
      runSandboxTest: {
        url: 'POST /api/sandbox/test',
        body: {
          ruleId: 1,
          testData: {
            tokens: 1000,
            model: 'gpt-4',
            temperature: 0.7
          }
        },
        response: {
          success: true,
          data: {
            selectedProvider: 'OpenAI',
            model: 'gpt-4',
            confidence: 92,
            cost: {
              estimated: '0.0200',
              alternative: '0.0280',
              savings: '0.0080'
            },
            performance: {
              latency: 450,
              throughput: 85,
              reliability: 98
            }
          }
        }
      }
    }
  };

  res.json(apiDocs);
});

// Use API router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TokenFlow Pro API Server',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TokenFlow Pro API Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

export default app;