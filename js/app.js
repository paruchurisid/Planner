import { CONFIG, initializeSettings } from './config.js';
import { authService } from './services/authService.js';
import { taskService } from './services/taskService.js';
import { $, createElement, formatDate, toggleElement } from './utils/dom.js';

class TaskFlowApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.initializeApp();
    }

    // Initialize the application
    async initializeApp() {
        try {
            // Initialize settings and auth
            initializeSettings();
            await this.checkAuth();
            
            // Initialize current page
            this.initPage();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            console.log('TaskFlow app initialized');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize the application');
        }
    }

    // Get current page from URL
    getCurrentPage() {
        const path = window.location.pathname.split('/').pop() || 'taskflow.html';
        return path.replace('.html', '');
    }

    // Check authentication status
    async checkAuth() {
        // Skip auth check for login page
        if (this.currentPage === 'login') return;
        
        if (!authService.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Initialize current page
    initPage() {
        // Update active nav item
        this.updateActiveNav();
        
        // Initialize page-specific functionality
        if (typeof this[`init${this.capitalize(this.currentPage)}`] === 'function') {
            this[`init${this.capitalize(this.currentPage)}`]();
        }
    }

    // Set up global event listeners
    setupEventListeners() {
        // Navigation
        $$('a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Logout
        const logoutBtn = $('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authService.logout();
            });
        }

        // Toggle mobile menu
        const menuToggle = $('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-open');
            });
        }
    }

    // Load initial data for the current page
    async loadInitialData() {
        try {
            // Load user data
            const user = authService.getCurrentUser();
            if (user) {
                this.updateUserProfile(user);
            }

            // Load page-specific data
            if (typeof this[`load${this.capitalize(this.currentPage)}Data`] === 'function') {
                await this[`load${this.capitalize(this.currentPage)}Data`]();
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Failed to load application data');
        }
    }

    // Update active navigation item
    updateActiveNav() {
        $$('.nav-link').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Update user profile in the UI
    updateUserProfile(user) {
        const profileName = $('.profile-name');
        const profileEmail = $('.profile-email');
        const profileAvatar = $('.profile-avatar');
        
        if (profileName) profileName.textContent = user.name;
        if (profileEmail) profileEmail.textContent = user.email;
        if (profileAvatar) profileAvatar.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6C63FF&color=fff`;
    }

    // Navigate to a different page
    navigateTo(page) {
        if (page === this.currentPage) return;
        
        // Save any unsaved changes if needed
        if (this.hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
        
        window.location.href = `${page}.html`;
    }

    // Show error message
    showError(message) {
        // Create or update error toast
        let toast = $('.error-toast');
        if (!toast) {
            toast = createElement('div', { class: 'error-toast' });
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    // Show success message
    showSuccess(message) {
        // Create or update success toast
        let toast = $('.success-toast');
        if (!toast) {
            toast = createElement('div', { class: 'success-toast' });
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Helper to capitalize first letter
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ===== Page-Specific Initialization =====
    
    // Initialize Dashboard
    initTaskflow() {
        console.log('Initializing Dashboard');
        // Dashboard-specific initialization
    }
    
    // Initialize Tasks
    initTasks() {
        console.log('Initializing Tasks');
        // Tasks-specific initialization
    }
    
    // Initialize Calendar
    initCalendar() {
        console.log('Initializing Calendar');
        // Calendar-specific initialization
    }
    
    // Initialize Analytics
    initAnalytics() {
        console.log('Initializing Analytics');
        // Analytics-specific initialization
    }
    
    // Initialize Settings
    initSettings() {
        console.log('Initializing Settings');
        // Settings-specific initialization
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TaskFlowApp();
});
