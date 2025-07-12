# TokenFlow Pro API Documentation

## Overview
TokenFlow Pro provides a comprehensive RESTful API for managing LLM gateway operations, routing rules, API keys, and analytics. All endpoints follow consistent patterns and return standardized JSON responses.

## Base URL
```
http://localhost:3001/api
```

## Authentication
Include your API key in the request headers:
```
Authorization: Bearer YOUR_API_KEY
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "Optional error code"
}
```

## Endpoints

### Projects
Manage LLM projects and configurations.

- **GET** `/api/projects` - Get all projects
- **GET** `/api/projects/:id` - Get project by ID
- **POST** `/api/projects` - Create new project
- **PUT** `/api/projects/:id` - Update project
- **DELETE** `/api/projects/:id` - Delete project

#### Example: Create Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "name": "My New Project",
    "description": "AI-powered chatbot project",
    "provider": "OpenAI"
  }'
```

### API Keys
Manage LLM provider API keys.

- **GET** `/api/api-keys` - Get all API keys
- **GET** `/api/api-keys/:id` - Get API key by ID
- **POST** `/api/api-keys` - Create new API key
- **PUT** `/api/api-keys/:id` - Update API key
- **DELETE** `/api/api-keys/:id` - Delete API key

#### Example: Add API Key
```bash
curl -X POST http://localhost:3001/api/api-keys \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "OpenAI",
    "name": "Production Key",
    "encryptedKey": "sk-..."
  }'
```

### Workspaces
Manage workspace environments.

- **GET** `/api/workspaces` - Get all workspaces
- **GET** `/api/workspaces/:id` - Get workspace by ID
- **POST** `/api/workspaces` - Create new workspace
- **PUT** `/api/workspaces/:id` - Update workspace
- **DELETE** `/api/workspaces/:id` - Delete workspace

### Routing Rules
Manage LLM routing and optimization rules.

- **GET** `/api/routing-rules` - Get all routing rules
- **GET** `/api/routing-rules/:id` - Get routing rule by ID
- **POST** `/api/routing-rules` - Create new routing rule
- **PUT** `/api/routing-rules/:id` - Update routing rule
- **DELETE** `/api/routing-rules/:id` - Delete routing rule

### Sandbox
Test and simulate LLM configurations.

- **GET** `/api/sandbox/scenarios` - Get all test scenarios
- **POST** `/api/sandbox/test` - Run sandbox test
- **GET** `/api/sandbox/configurations` - Get saved configurations
- **POST** `/api/sandbox/configurations` - Save test configuration
- **DELETE** `/api/sandbox/configurations/:id` - Delete configuration

#### Example: Run Sandbox Test
```bash
curl -X POST http://localhost:3001/api/sandbox/test \
  -H "Content-Type: application/json" \
  -d '{
    "ruleId": 1,
    "testData": {
      "tokens": 1000,
      "model": "gpt-4",
      "temperature": 0.7
    }
  }'
```

### Analytics
Access usage analytics and performance metrics.

- **GET** `/api/analytics` - Get analytics data
- **GET** `/api/analytics/:id` - Get specific analytics by ID

### Team
Manage team members and permissions.

- **GET** `/api/team` - Get team members
- **GET** `/api/team/:id` - Get team member by ID
- **POST** `/api/team` - Add team member
- **PUT** `/api/team/:id` - Update team member
- **DELETE** `/api/team/:id` - Remove team member

### Dashboard
Access dashboard statistics and recent activity.

- **GET** `/api/dashboard/stats` - Get dashboard statistics
- **GET** `/api/dashboard/recent-activity` - Get recent activity

### Providers
Monitor LLM provider status and metrics.

- **GET** `/api/providers/status` - Get provider status
- **GET** `/api/providers/metrics` - Get provider metrics

## Quick Start

1. **Start the API server:**
```bash
npm run api
```

2. **Access API documentation:**
```
http://localhost:3001/api/docs
```

3. **Health check:**
```bash
curl http://localhost:3001/health
```

## Development

### Run both frontend and API:
```bash
npm run dev:full
```

### API server only:
```bash
npm run api
```

## Error Codes

- `400` - Bad Request (Invalid input data)
- `401` - Unauthorized (Invalid or missing API key)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

## Rate Limiting
API requests are limited to 1000 requests per hour per API key.

## Support
For API support and questions, visit the documentation endpoint at `/api/docs` or contact the development team.