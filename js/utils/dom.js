// DOM utility functions
export const $ = (selector, parent = document) => parent.querySelector(selector);
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Create HTML element with attributes and children
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'text') {
            element.textContent = value;
        } else if (key === 'html') {
            element.innerHTML = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2), value);
        } else if (value !== null && value !== undefined) {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child instanceof Node) {
                element.appendChild(child);
            } else if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(child));
            }
        });
    }
    
    return element;
}

// Toggle element visibility
export function toggleElement(element, show) {
    if (show === undefined) {
        show = element.style.display === 'none';
    }
    element.style.display = show ? '' : 'none';
    return show;
}

// Debounce function for performance optimization
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date to string
export function formatDate(date, format = 'MM/DD/YYYY') {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const pad = num => num.toString().padStart(2, '0');
    const map = {
        YYYY: date.getFullYear(),
        MM: pad(date.getMonth() + 1),
        DD: pad(date.getDate()),
        HH: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds())
    };
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match]);
}

// Parse date from string
export function parseDate(dateString) {
    if (!dateString) return new Date();
    
    // Handle ISO format
    if (dateString.includes('T') || dateString.includes('Z')) {
        return new Date(dateString);
    }
    
    // Handle MM/DD/YYYY format
    const parts = dateString.split(/[\/\-.]/);
    if (parts.length === 3) {
        // Note: months are 0-indexed in JS Date
        return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    
    return new Date(dateString);
}

// Get the start of the day
export function startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

// Add days to a date
export function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

// Check if two dates are the same day
export function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// Format time duration
// Format time duration
export function formatDuration(minutes) {
    if (!minutes && minutes !== 0) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${mins}m`;
    }
}
