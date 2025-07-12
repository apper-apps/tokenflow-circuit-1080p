import mockWorkspaces from '@/services/mockData/workspaces.json';

let workspaces = [...mockWorkspaces];
let nextId = Math.max(...workspaces.map(w => w.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const workspaceService = {
  async getAll() {
    await delay(300);
    return [...workspaces];
  },

  async getById(id) {
    await delay(200);
    const workspace = workspaces.find(w => w.Id === parseInt(id));
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return { ...workspace };
  },

  async create(workspaceData) {
    await delay(400);
    
    // Validate required fields
    if (!workspaceData.name || !workspaceData.tier) {
      throw new Error('Name and tier are required');
    }

    // Check for duplicate names
    if (workspaces.some(w => w.name.toLowerCase() === workspaceData.name.toLowerCase())) {
      throw new Error('Workspace name already exists');
    }

    const newWorkspace = {
      Id: nextId++,
      name: workspaceData.name,
      description: workspaceData.description || '',
      tier: workspaceData.tier,
      usageQuota: workspaceData.tier === 'free' ? 100000 : 
                  workspaceData.tier === 'pro' ? 1000000 : 5000000,
      currentUsage: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      teamMembers: 1,
      apiKeys: 0,
      status: 'active',
      owner: 'John Doe',
      region: workspaceData.region || 'us-east-1'
    };

    workspaces.push(newWorkspace);
    return { ...newWorkspace };
  },

  async update(id, updateData) {
    await delay(300);
    
    const index = workspaces.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Workspace not found');
    }

    // Check for duplicate names (excluding current workspace)
    if (updateData.name && 
        workspaces.some(w => w.Id !== parseInt(id) && 
                      w.name.toLowerCase() === updateData.name.toLowerCase())) {
      throw new Error('Workspace name already exists');
    }

    const updatedWorkspace = {
      ...workspaces[index],
      ...updateData,
      Id: parseInt(id), // Ensure ID doesn't change
      lastActiveAt: new Date().toISOString()
    };

    workspaces[index] = updatedWorkspace;
    return { ...updatedWorkspace };
  },

  async delete(id) {
    await delay(250);
    
    const index = workspaces.findIndex(w => w.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Workspace not found');
    }

    // Don't allow deleting the last workspace
    if (workspaces.length === 1) {
      throw new Error('Cannot delete the last workspace');
    }

    workspaces.splice(index, 1);
    return true;
  },

  async switchWorkspace(id) {
    await delay(200);
    
    const workspace = workspaces.find(w => w.Id === parseInt(id));
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    // Update last active time
    const index = workspaces.findIndex(w => w.Id === parseInt(id));
    workspaces[index] = {
      ...workspace,
      lastActiveAt: new Date().toISOString()
    };

    return { ...workspaces[index] };
  }
};