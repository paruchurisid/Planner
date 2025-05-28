import { CONFIG } from '../config.js';

class TaskService {
    constructor() {
        this.tasks = this.getTasks();
    }

    // Get all tasks from localStorage
    getTasks() {
        const tasks = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.TASKS);
        return tasks ? JSON.parse(tasks) : [];
    }

    // Save tasks to localStorage
    saveTasks(tasks) {
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        this.tasks = tasks;
    }

    // Get task by ID
    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    // Create a new task
    createTask(taskData) {
        return new Promise((resolve) => {
            const newTask = {
                id: Date.now().toString(),
                ...taskData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: taskData.status || CONFIG.TASK_STATUS.TODO
            };

            const updatedTasks = [...this.tasks, newTask];
            this.saveTasks(updatedTasks);
            resolve(newTask);
        });
    }

    // Update an existing task
    updateTask(id, updates) {
        return new Promise((resolve, reject) => {
            const taskIndex = this.tasks.findIndex(task => task.id === id);
            
            if (taskIndex === -1) {
                reject(new Error('Task not found'));
                return;
            }

            const updatedTask = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            const updatedTasks = [...this.tasks];
            updatedTasks[taskIndex] = updatedTask;
            this.saveTasks(updatedTasks);
            
            resolve(updatedTask);
        });
    }

    // Delete a task
    deleteTask(id) {
        return new Promise((resolve) => {
            const updatedTasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks(updatedTasks);
            resolve(true);
        });
    }

    // Get tasks filtered by status
    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    // Get tasks due today
    getTasksDueToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return this.tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        });
    }

    // Get upcoming tasks
    getUpcomingTasks(days = 7) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        futureDate.setHours(23, 59, 59, 999);

        return this.tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate >= today && taskDate <= futureDate;
        });
    }

    // Toggle task completion status
    toggleTaskStatus(id) {
        const task = this.getTaskById(id);
        if (!task) return Promise.reject(new Error('Task not found'));
        
        const newStatus = task.status === CONFIG.TASK_STATUS.COMPLETED 
            ? CONFIG.TASK_STATUS.TODO 
            : CONFIG.TASK_STATUS.COMPLETED;
            
        return this.updateTask(id, { status: newStatus });
    }
}

export const taskService = new TaskService();
