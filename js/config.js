// Application configuration
export const CONFIG = {
    API_BASE_URL: 'https://api.taskflow.app',
    LOCAL_STORAGE_KEYS: {
        USER: 'taskflow_user',
        TASKS: 'taskflow_tasks',
        THEME: 'taskflow_theme',
        SETTINGS: 'taskflow_settings'
    },
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
    },
    TASK_PRIORITIES: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    },
    TASK_STATUS: {
        TODO: 'todo',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed'
    }
};

// Initialize default settings if not exists
export function initializeSettings() {
    if (!localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS)) {
        const defaultSettings = {
            theme: CONFIG.THEMES.LIGHT,
            notifications: {
                email: true,
                push: true,
                sound: true
            },
            dateFormat: 'MM/DD/YYYY',
            timeFormat: '12h',
            startOfWeek: 0 // 0 = Sunday, 1 = Monday
        };
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
}

// Get current settings
export function getSettings() {
    const settings = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : null;
}

// Update settings
export function updateSettings(newSettings) {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    return updatedSettings;
}
