import { CONFIG } from '../config.js';
import { authService } from '../services/authService.js';

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {Object} [data] - Request body (for POST, PUT, PATCH)
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export async function apiRequest(endpoint, method = 'GET', data = null, headers = {}, requiresAuth = true) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        credentials: 'include'
    };

    // Add Authorization header if required
    if (requiresAuth) {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            requestOptions.headers['Authorization'] = `Bearer ${user.token}`;
        }
    }

    // Add request body for non-GET requests
    if (data && method !== 'GET') {
        requestOptions.body = JSON.stringify(data);
    } else if (data && method === 'GET') {
        // For GET requests, append data as query parameters
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value);
            }
        });
        const queryString = params.toString();
        if (queryString) {
            url = `${url}?${queryString}`;
        }
    }

    try {
        const response = await fetch(url, requestOptions);
        
        // Handle 204 No Content
        if (response.status === 204) {
            return {};
        }
        
        const responseData = await response.json();
        
        if (!response.ok) {
            // Handle 401 Unauthorized
            if (response.status === 401) {
                // If we have a refresh token, try to refresh it
                if (authService.refreshToken) {
                    try {
                        await authService.refreshAccessToken();
                        // Retry the original request with the new token
                        return apiRequest(endpoint, method, data, headers, requiresAuth);
                    } catch (refreshError) {
                        // If refresh fails, log the user out
                        authService.logout();
                        throw new Error('Session expired. Please log in again.');
                    }
                } else {
                    authService.logout();
                    throw new Error('Session expired. Please log in again.');
                }
            }
            
            // Handle other errors
            const error = new Error(responseData.message || 'Something went wrong');
            error.status = response.status;
            error.data = responseData;
            throw error;
        }
        
        return responseData;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} [params] - Query parameters
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export function get(endpoint, params = {}, headers = {}, requiresAuth = true) {
    return apiRequest(endpoint, 'GET', params, headers, requiresAuth);
}

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} [data] - Request body
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export function post(endpoint, data = {}, headers = {}, requiresAuth = true) {
    return apiRequest(endpoint, 'POST', data, headers, requiresAuth);
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} [data] - Request body
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export function put(endpoint, data = {}, headers = {}, requiresAuth = true) {
    return apiRequest(endpoint, 'PUT', data, headers, requiresAuth);
}

/**
 * PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} [data] - Request body
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export function patch(endpoint, data = {}, headers = {}, requiresAuth = true) {
    return apiRequest(endpoint, 'PATCH', data, headers, requiresAuth);
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} [data] - Request body
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export function del(endpoint, data = {}, headers = {}, requiresAuth = true) {
    return apiRequest(endpoint, 'DELETE', data, headers, requiresAuth);
}

/**
 * Upload a file
 * @param {string} endpoint - API endpoint
 * @param {File} file - File to upload
 * @param {Object} [additionalData] - Additional form data to include
 * @param {Function} [onProgress] - Progress callback
 * @param {Object} [headers] - Additional headers
 * @param {boolean} [requiresAuth=true] - Whether the request requires authentication
 * @returns {Promise<Object>} - Response data
 */
export async function uploadFile(endpoint, file, additionalData = {}, onProgress = null, headers = {}, requiresAuth = true) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const formData = new FormData();
    
    // Append the file
    formData.append('file', file);
    
    // Append additional data
    Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });
    
    const requestOptions = {
        method: 'POST',
        headers: {
            ...headers
        },
        body: formData,
        credentials: 'include'
    };
    
    // Add Authorization header if required
    if (requiresAuth) {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            requestOptions.headers['Authorization'] = `Bearer ${user.token}`;
        }
    }
    
    // Add progress tracking if supported
    if (onProgress && window.XMLHttpRequest) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    onProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Failed to parse response'));
                    }
                } else {
                    let errorMessage = 'Upload failed';
                    try {
                        const errorResponse = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                        errorMessage = errorResponse.message || errorMessage;
                    } catch (e) {
                        // Ignore JSON parse error
                    }
                    const error = new Error(errorMessage);
                    error.status = xhr.status;
                    reject(error);
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error'));
            });
            
            xhr.addEventListener('abort', () => {
                reject(new Error('Upload cancelled'));
            });
            
            xhr.open('POST', url, true);
            
            // Set headers
            Object.entries(requestOptions.headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
            
            // Set withCredentials for CORS
            xhr.withCredentials = true;
            
            xhr.send(formData);
        });
    }
    
    // Fallback to fetch if progress tracking is not needed or not supported
    return apiRequest(endpoint, 'POST', formData, headers, requiresAuth);
}
