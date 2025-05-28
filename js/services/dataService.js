class DataService {
  constructor() {
    this.tasks = this.loadFromStorage('tasks') || [];
    this.categories = this.loadFromStorage('categories') || ['Work', 'Personal', 'Health', 'Learning'];
    this.settings = this.loadFromStorage('settings') || {
      theme: 'light',
      notifications: true,
      defaultView: 'week',
      startOfDay: '09:00',
      endOfDay: '17:00',
      timeFormat: '12h',
      weekStartsOn: 0 // 0 = Sunday, 1 = Monday
    };
  }

  // Load data from localStorage
  loadFromStorage(key) {
    const data = localStorage.getItem(`taskflow_${key}`);
    return data ? JSON.parse(data) : null;
  }

  // Save data to localStorage
  saveToStorage(key, data) {
    localStorage.setItem(`taskflow_${key}`, JSON.stringify(data));
  }

  // Task methods
  getTasks(filters = {}) {
    let tasks = [...this.tasks];
    
    // Apply filters
    if (filters.completed !== undefined) {
      tasks = tasks.filter(task => task.completed === filters.completed);
    }
    
    if (filters.category) {
      tasks = tasks.filter(task => task.category === filters.category);
    }
    
    if (filters.dueDate) {
      const targetDate = new Date(filters.dueDate).toDateString();
      tasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toDateString();
        return taskDate === targetDate;
      });
    }
    
    return tasks;
  }

  getTask(id) {
    return this.tasks.find(task => task.id === id);
  }

  addTask(task) {
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...task
    };
    this.tasks.push(newTask);
    this.saveToStorage('tasks', this.tasks);
    return newTask;
  }

  updateTask(id, updates) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex] = { 
        ...this.tasks[taskIndex], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage('tasks', this.tasks);
      return this.tasks[taskIndex];
    }
    return null;
  }

  deleteTask(id) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks.splice(taskIndex, 1);
      this.saveToStorage('tasks', this.tasks);
      return true;
    }
    return false;
  }

  // Category methods
  getCategories() {
    return this.categories;
  }

  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
      this.saveToStorage('categories', this.categories);
    }
    return this.categories;
  }

  // Settings methods
  getSettings() {
    return this.settings;
  }

  updateSettings(updates) {
    this.settings = { ...this.settings, ...updates };
    this.saveToStorage('settings', this.settings);
    return this.settings;
  }

  // Analytics methods
  getTaskStats() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const allTasks = this.tasks;
    const completedTasks = allTasks.filter(task => task.completed);
    const pendingTasks = allTasks.filter(task => !task.completed);
    
    // Completion rate
    const completionRate = allTasks.length > 0 
      ? Math.round((completedTasks.length / allTasks.length) * 100) 
      : 0;
    
    // Completed this week
    const completedThisWeek = completedTasks.filter(task => 
      new Date(task.completedAt) >= oneWeekAgo
    ).length;
    
    // Tasks by category
    const tasksByCategory = {};
    allTasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      tasksByCategory[category] = (tasksByCategory[category] || 0) + 1;
    });
    
    // Completion trend (last 7 days)
    const completionTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = completedTasks.filter(task => {
        return task.completedAt && task.completedAt.startsWith(dateStr);
      }).length;
      
      completionTrend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }
    
    return {
      total: allTasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      completionRate,
      completedThisWeek,
      tasksByCategory,
      completionTrend
    };
  }
}

// Create a singleton instance
const dataService = new DataService();
export default dataService;
