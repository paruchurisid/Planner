import { CONFIG } from '../config.js';

/**
 * Get item from localStorage
 * @param {string} key - The key to get from localStorage
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*}
 */
export function getItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error getting item ${key} from localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Set item in localStorage
 * @param {string} key - The key to set in localStorage
 * @param {*} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting item ${key} in localStorage:`, error);
        return false;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - The key to remove from localStorage
 * @returns {boolean} - True if successful, false otherwise
 */
export function removeItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing item ${key} from localStorage:`, error);
        return false;
    }
}

/**
 * Clear all application data from localStorage
 * @returns {boolean} - True if successful, false otherwise
 */
export function clearAppData() {
    try {
        Object.values(CONFIG.LOCAL_STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing app data from localStorage:', error);
        return false;
    }
}

/**
 * Get the current user from localStorage
 * @returns {Object|null} - The current user object or null if not found
 */
export function getCurrentUser() {
    return getItem(CONFIG.LOCAL_STORAGE_KEYS.USER);
}

/**
 * Set the current user in localStorage
 * @param {Object} user - The user object to store
 * @returns {boolean} - True if successful, false otherwise
 */
export function setCurrentUser(user) {
    return setItem(CONFIG.LOCAL_STORAGE_KEYS.USER, user);
}

/**
 * Remove the current user from localStorage
 * @returns {boolean} - True if successful, false otherwise
 */
export function removeCurrentUser() {
    return removeItem(CONFIG.LOCAL_STORAGE_KEYS.USER);
}

/**
 * Get tasks from localStorage
 * @returns {Array} - Array of tasks
 */
export function getTasks() {
    return getItem(CONFIG.LOCAL_STORAGE_KEYS.TASKS, []);
}

/**
 * Save tasks to localStorage
 * @param {Array} tasks - Array of tasks to save
 * @returns {boolean} - True if successful, false otherwise
 */
export function saveTasks(tasks) {
    return setItem(CONFIG.LOCAL_STORAGE_KEYS.TASKS, tasks);
}

/**
 * Get the current theme from localStorage
 * @returns {string} - The current theme ('light', 'dark', or 'system')
 */
export function getTheme() {
    return getItem(CONFIG.LOCAL_STORAGE_KEYS.THEME, CONFIG.THEMES.LIGHT);
}

/**
 * Set the current theme in localStorage
 * @param {string} theme - The theme to set ('light', 'dark', or 'system')
 * @returns {boolean} - True if successful, false otherwise
 */
export function setTheme(theme) {
    if (Object.values(CONFIG.THEMES).includes(theme)) {
        return setItem(CONFIG.LOCAL_STORAGE_KEYS.THEME, theme);
    }
    return false;
}

/**
 * Get user settings from localStorage
 * @returns {Object} - User settings object
 */
export function getUserSettings() {
    return getItem(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS, {
        theme: CONFIG.THEMES.LIGHT,
        notifications: {
            email: true,
            push: true,
            sound: true
        },
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        startOfWeek: 0
    });
}

/**
 * Save user settings to localStorage
 * @param {Object} settings - User settings object
 * @returns {boolean} - True if successful, false otherwise
 */
export function saveUserSettings(settings) {
    return setItem(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Update specific user settings
 * @param {Object} updates - Partial settings object with updates
 * @returns {Object} - Updated settings object
 */
export function updateUserSettings(updates) {
    const currentSettings = getUserSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    saveUserSettings(updatedSettings);
    return updatedSettings;
}
