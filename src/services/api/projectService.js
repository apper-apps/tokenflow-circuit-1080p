import mockData from "@/services/mockData/projects.json";

export const projectService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockData;
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const project = mockData.find(p => p.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  },

  async create(projectData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject = {
      ...projectData,
      Id: Math.max(...mockData.map(p => p.Id)) + 1,
      status: "active",
      createdAt: new Date().toISOString(),
      monthlyRequests: 0,
      monthlyCost: 0
    };
    return newProject;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const project = mockData.find(p => p.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project, ...updateData };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    return true;
  }
};