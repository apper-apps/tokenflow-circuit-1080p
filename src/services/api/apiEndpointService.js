// API Endpoint Service for managing HTTP API configurations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let endpoints = [];
let nextEndpointId = 1;

export const apiEndpointService = {
  async getAll() {
    await delay(200);
    return [...endpoints];
  },

  async getById(id) {
    await delay(200);
    const endpoint = endpoints.find(e => e.Id === parseInt(id));
    if (!endpoint) {
      throw new Error(`Endpoint with ID ${id} not found`);
    }
    return { ...endpoint };
  },

  async create(endpointData) {
    await delay(300);
    const newEndpoint = {
      Id: nextEndpointId++,
      ...endpointData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    endpoints.push(newEndpoint);
    return { ...newEndpoint };
  },

  async update(id, data) {
    await delay(300);
    const index = endpoints.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Endpoint with ID ${id} not found`);
    }
    
    endpoints[index] = {
      ...endpoints[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...endpoints[index] };
  },

  async delete(id) {
    await delay(300);
    const index = endpoints.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Endpoint with ID ${id} not found`);
    }
    endpoints.splice(index, 1);
    return true;
  },

  async getEndpointDocs() {
    await delay(200);
    return {
      title: 'TokenFlow Pro API Endpoints',
      baseUrl: 'http://localhost:3001/api',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      endpoints: endpoints.map(endpoint => ({
        ...endpoint,
        fullUrl: `http://localhost:3001/api${endpoint.path}`
      }))
    };
  }
};