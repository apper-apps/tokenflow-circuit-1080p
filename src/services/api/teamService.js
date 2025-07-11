import mockData from "@/services/mockData/team.json";

export const teamService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData;
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const member = mockData.find(m => m.Id === id);
    if (!member) {
      throw new Error("Team member not found");
    }
    return member;
  },

  async create(memberData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newMember = {
      ...memberData,
      Id: Math.max(...mockData.map(m => m.Id)) + 1,
      name: memberData.email.split("@")[0],
      status: "pending",
      joinedAt: new Date().toISOString(),
      lastActive: null
    };
    return newMember;
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const member = mockData.find(m => m.Id === id);
    if (!member) {
      throw new Error("Team member not found");
    }
    return { ...member, ...updateData };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Team member not found");
    }
    return true;
  }
};