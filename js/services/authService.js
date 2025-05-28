import { CONFIG } from '../config.js';

class AuthService {
    constructor() {
        this.currentUser = this.getCurrentUser();
    }

    // Get current user from localStorage
    getCurrentUser() {
        const user = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Login user
    async login(email, password) {
        // In a real app, this would be an API call
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                if (email === 'siddhartha@example.com' && password === 'password') {
                    const user = {
                        id: '1',
                        name: 'Siddhartha Paruchuri',
                        email: email,
                        avatar: `https://ui-avatars.com/api/?name=Siddhartha+Paruchuri&background=6C63FF&color=fff`
                    };
                    
                    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
                    this.currentUser = user;
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 500);
        });
    }

    // Logout user
    logout() {
        localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER);
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('Not authenticated');
        }

        const updatedUser = { ...this.currentUser, ...updates };
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        this.currentUser = updatedUser;
        return updatedUser;
    }
}

export const authService = new AuthService();
