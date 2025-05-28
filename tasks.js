// Task Management System
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
    }

    addTask(task) {
        const newTask = {
            id: Date.now().toString(),
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate || null,
            priority: task.priority || 'medium',
            completed: false,
            category: task.category || 'personal',
            createdAt: new Date().toISOString()
        };
        this.tasks.unshift(newTask);
        this.saveTasks();
        return newTask;
    }

    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
            this.saveTasks();
            return this.tasks[taskIndex];
        }
        return null;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    getTask(id) {
        return this.tasks.find(task => task.id === id);
    }

    getFilteredTasks(filter = this.currentFilter) {
        this.currentFilter = filter;
        switch (filter) {
            case 'today':
                return this.getTasksDueToday();
            case 'upcoming':
                return this.getUpcomingTasks();
            case 'completed':
                return this.getCompletedTasks();
            default:
                return [...this.tasks];
        }
    }

    getTasksDueToday() {
        const today = new Date().toDateString();
        return this.tasks.filter(task => {
            if (!task.dueDate) return false;
            return new Date(task.dueDate).toDateString() === today;
        });
    }

    getUpcomingTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.tasks.filter(task => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate > today && !task.completed;
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    getCompletedTasks() {
        return this.tasks.filter(task => task.completed);
    }

    toggleTaskCompletion(id) {
        const task = this.getTask(id);
        if (task) {
            return this.updateTask(id, { completed: !task.completed });
        }
        return null;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// UI Components
class TaskUI {
    constructor() {
        this.taskManager = new TaskManager();
        this.setupEventListeners();
        this.renderTasks();
    }

    setupEventListeners() {
        // Task form submission
        document.getElementById('taskForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Task filter buttons
        document.querySelectorAll('[data-filter]').forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setActiveFilter(filter);
                this.renderTasks();
            });
        });
    }

    setActiveFilter(filter) {
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('bg-blue-50', 'text-blue-600');
            btn.classList.add('text-gray-600', 'hover:bg-gray-50');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
            activeBtn.classList.add('bg-blue-50', 'text-blue-600');
        }
    }

    async handleAddTask() {
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');
        const dueDateInput = document.getElementById('taskDueDate');
        const priorityInput = document.getElementById('taskPriority');

        if (!titleInput.value.trim()) return;

        const task = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            dueDate: dueDateInput.value || null,
            priority: priorityInput.value
        };

        this.taskManager.addTask(task);
        this.renderTasks();
        
        // Reset form
        titleInput.value = '';
        descriptionInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'medium';
        
        // Close modal if open
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    renderTasks() {
        const tasksContainer = document.getElementById('tasksContainer');
        if (!tasksContainer) return;

        const tasks = this.taskManager.getFilteredTasks();
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                    <div class="mt-6">
                        <button onclick="document.getElementById('taskModal').classList.remove('hidden')" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                            </svg>
                            New Task
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        tasksContainer.innerHTML = tasks.map(task => this.renderTask(task)).join('');
        
        // Add event listeners to the rendered tasks
        tasks.forEach(task => {
            const checkbox = document.getElementById(`task-${task.id}`);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.toggleTaskCompletion(task.id));
            }
            
            const deleteBtn = document.getElementById(`delete-${task.id}`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteTask(task.id);
                });
            }
        });
    }

    renderTask(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const formattedDate = dueDate ? dueDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        }) : 'No due date';

        const priorityColors = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };

        return `
            <div class="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer" onclick="taskUI.viewTask('${task.id}')">
                <div class="flex items-start">
                    <div class="flex items-center h-5">
                        <input id="task-${task.id}" type="checkbox" ${task.completed ? 'checked' : ''} 
                            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                    </div>
                    <div class="ml-3 flex-1">
                        <div class="flex justify-between items-start">
                            <p class="text-sm font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}">
                                ${this.escapeHtml(task.title)}
                            </p>
                            <div class="flex space-x-2">
                                ${task.dueDate ? `
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${dueDate < new Date() && !task.completed ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                                        <svg class="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        ${formattedDate}
                                    </span>
                                ` : ''}
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[task.priority] || 'bg-gray-100 text-gray-800'}">
                                    ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                                <button id="delete-${task.id}" class="text-gray-400 hover:text-red-500" onclick="event.stopPropagation();">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        ${task.description ? `
                            <p class="mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500'} line-clamp-2">
                                ${this.escapeHtml(task.description)}
                            </p>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    async toggleTaskCompletion(taskId) {
        const task = this.taskManager.toggleTaskCompletion(taskId);
        if (task) {
            this.renderTasks();
            // Add animation for task completion
            const taskElement = document.getElementById(`task-${taskId}`)?.closest('div[onclick]');
            if (taskElement) {
                taskElement.classList.add('opacity-50');
                setTimeout(() => {
                    taskElement.classList.remove('opacity-50');
                    this.renderTasks();
                }, 300);
            }
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.taskManager.deleteTask(taskId);
            this.renderTasks();
        }
    }

    viewTask(taskId) {
        const task = this.taskManager.getTask(taskId);
        if (!task) return;

        // In a real app, you would show a detailed view modal here
        // For now, we'll just toggle completion
        this.toggleTaskCompletion(taskId);
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the task UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskUI = new TaskUI();
});
