import helpData from '@/services/mockData/helpArticles.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const helpService = {
  async getAll() {
    await delay(300);
    return [...helpData];
  },

  async getById(id) {
    await delay(200);
    const article = helpData.find(item => item.Id === parseInt(id));
    if (!article) {
      throw new Error(`Help article with id ${id} not found`);
    }
    return { ...article };
  },

  async getByCategory(category) {
    await delay(300);
    return helpData.filter(article => article.category === category);
  },

  async search(query) {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return helpData.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  async create(article) {
    await delay(400);
    const newId = Math.max(...helpData.map(a => a.Id)) + 1;
    const newArticle = {
      ...article,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    helpData.push(newArticle);
    return { ...newArticle };
  },

  async update(id, data) {
    await delay(400);
    const index = helpData.findIndex(article => article.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Help article with id ${id} not found`);
    }
    
    const updatedArticle = {
      ...helpData[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    helpData[index] = updatedArticle;
    return { ...updatedArticle };
  },

  async delete(id) {
    await delay(300);
    const index = helpData.findIndex(article => article.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Help article with id ${id} not found`);
    }
    
    helpData.splice(index, 1);
    return { success: true };
  }
};

export default helpService;