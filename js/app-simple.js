import dataService from './services/dataService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  loadTasks();
  setupEventListeners();
  updateTaskCounters();
  initializeTheme();
  
  // Set up navigation
  setupNavigation();
});

// Navigation
function setupNavigation() {
  // Highlight current page in navigation
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Theme management
function initializeTheme() {
  const settings = dataService.getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme);
  
  // Update theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.checked = settings.theme === 'dark';
    themeToggle.addEventListener('change', toggleTheme);
  }
}

function toggleTheme(e) {
  const theme = e.target.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  dataService.updateSettings({ theme });
}

// Task management
function loadTasks(filters = {}) {
  const tasks = dataService.getTasks(filters);
  const taskList = document.getElementById('taskList');
  
  if (!taskList) return;
  
  if (tasks.length === 0) {
    taskList.innerHTML = '<div class="empty-state">No tasks found. Add a new task to get started!</div>';
    return;
  }
  
  taskList.innerHTML = tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <label class="task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="checkmark"></span>
      </label>
      <div class="task-content">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
          ${task.dueDate ? `<span class="task-due">
            <i class="far fa-calendar"></i> ${formatDate(task.dueDate)}
          </span>` : ''}
          ${task.category ? `<span class="task-category">${escapeHtml(task.category)}</span>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-icon edit-task" title="Edit">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn-icon delete-task" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  updateTaskCounters();
}

function setupEventListeners() {
  // Add new task form
  const taskForm = document.getElementById('taskForm');
  if (taskForm) {
    taskForm.addEventListener('submit', handleAddTask);
  }
  
  // Task actions (using event delegation)
  document.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    
    const taskId = taskItem.dataset.id;
    
    // Toggle task completion
    if (e.target.closest('.task-checkbox') || e.target.closest('.task-checkbox input')) {
      const checkbox = taskItem.querySelector('input[type="checkbox"]');
      const completed = checkbox.checked;
      
      dataService.updateTask(taskId, { 
        completed,
        completedAt: completed ? new Date().toISOString() : null
      });
      
      taskItem.classList.toggle('completed', completed);
      updateTaskCounters();
    }
    
    // Delete task
    if (e.target.closest('.delete-task')) {
      if (confirm('Are you sure you want to delete this task?')) {
        if (dataService.deleteTask(taskId)) {
          taskItem.remove();
          updateTaskCounters();
          showNotification('Task deleted successfully', 'success');
        }
      }
    }
    
    // Edit task
    if (e.target.closest('.edit-task')) {
      // Implement edit functionality here
      console.log('Edit task:', taskId);
    }
  });
  
  // Filter tasks
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      applyTaskFilter(filter);
    });
  });
}

function handleAddTask(e) {
  e.preventDefault();
  
  const titleInput = document.getElementById('taskTitle');
  const descriptionInput = document.getElementById('taskDescription');
  const dueDateInput = document.getElementById('taskDueDate');
  const categoryInput = document.getElementById('taskCategory');
  
  if (titleInput.value.trim()) {
    const newTask = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      dueDate: dueDateInput.value || null,
      category: categoryInput.value || null
    };
    
    dataService.addTask(newTask);
    
    // Reset form
    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    
    // Reload tasks
    loadTasks();
    showNotification('Task added successfully', 'success');
  }
}

function applyTaskFilter(filter) {
  let filters = {};
  
  switch (filter) {
    case 'active':
      filters.completed = false;
      break;
    case 'completed':
      filters.completed = true;
      break;
    case 'today':
      const today = new Date().toISOString().split('T')[0];
      filters.dueDate = today;
      break;
    // Add more filters as needed
  }
  
  loadTasks(filters);
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

function updateTaskCounters() {
  const tasks = dataService.getTasks();
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  
  // Update counters in the UI
  const pendingCounter = document.getElementById('pendingCounter');
  const completedCounter = document.getElementById('completedCounter');
  
  if (pendingCounter) pendingCounter.textContent = pendingCount;
  if (completedCounter) completedCounter.textContent = completedCount;
}

// Utility functions
function formatDate(dateString) {
  if (!dateString) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
