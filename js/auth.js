import { authService } from './services/authService.js';
import { $, showError, showSuccess } from './utils/dom.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = $('#loginForm');
    const emailInput = $('#email');
    const passwordInput = $('#password');
    const togglePassword = $('.toggle-password');
    const rememberMe = $('#remember');
    const loginBtn = $('.btn-primary');
    const googleBtn = $('.btn-google');
    const githubBtn = $('.btn-github');

    // Check if user is already logged in
    if (authService.isAuthenticated()) {
        window.location.href = 'taskflow.html';
    }

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.innerHTML = type === 'password' 
                ? '<i class="far fa-eye"></i>' 
                : '<i class="far fa-eye-slash"></i>';
        });
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const remember = rememberMe.checked;
            
            // Basic validation
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }
            
            // Disable button and show loading state
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="btn-text">Signing in...</span><i class="fas fa-spinner fa-spin"></i>';
            
            try {
                // Attempt login
                const user = await authService.login(email, password);
                
                // Store remember me preference
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
                
                showSuccess('Login successful! Redirecting...');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'taskflow.html';
                }, 1000);
                
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message || 'Invalid email or password');
                
                // Re-enable button and reset text
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span class="btn-text">Sign In</span><i class="fas fa-arrow-right"></i>';
            }
        });
    }
    
    // Social login handlers
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showError('Google login is not implemented yet');
        });
    }
    
    if (githubBtn) {
        githubBtn.addEventListener('click', () => {
            showError('GitHub login is not implemented yet');
        });
    }
    
    // Auto-focus email input on page load
    if (emailInput) {
        emailInput.focus();
    }
});

// Export these functions to make them available in app.js
export function showError(message) {
    // Create or update error toast
    let toast = $('.error-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'error-toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

export function showSuccess(message) {
    // Create or update success toast
    let toast = $('.success-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'success-toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
