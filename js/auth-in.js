// AuthIntegration.js - Публичный API для интеграции
class AuthIntegration {
    constructor(config = {}) {
        // Настройки по умолчанию
        this.config = {
            apiBaseUrl: 'http://localhost:8000',
            tokenStorageKey: 'auth_token',
            userStorageKey: 'auth_user',
            onLoginSuccess: null,
            onLogout: null,
            onError: null,
            autoBind: true,
            validateOnInit: true,
            requestTimeout: 10000,
            customHeaders: {},
            ...config
        };
        
        this.token = localStorage.getItem(this.config.tokenStorageKey);
        this.user = JSON.parse(localStorage.getItem(this.config.userStorageKey) || 'null');
        this.isInitialized = false;
    }

    // Основные методы (оставляем только основные)
    init() {
        console.log('🔧 Инициализация системы аутентификации...');
        
        try {
            if (this.config.autoBind) {
                this.bindToButtons();
            }
            
            if (this.config.validateOnInit && this.token) {
                this.validateToken().catch(() => {
                    this.clearAuth();
                });
            }
            
            this.handleOAuthCallback();
            this.isInitialized = true;
            
            console.log('✅ Система аутентификации готова');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.handleError('init', error);
        }
        
        return this;
    }

    bindToButtons() {
        // GitHub
        this.bindButton('github-login', () => this.startGitHubAuth());
        this.bindButton('github-register-btn', () => this.startGitHubAuth('register'));

        // Яндекс
        this.bindButton('yandex-login', () => this.startYandexAuth());
        this.bindButton('yandex-register-btn', () => this.startYandexAuth('register'));

        // Email
        this.bindButton('login-btn', () => this.startEmailAuth());
        this.bindButton('register-btn', () => this.startEmailRegistration());

        // Выход
        this.bindButton('logout-btn', () => this.logout());
    }
    
    bindButton(id, handler) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
            
            if (element.disabled) {
                element.disabled = false;
            }
        }
    }

    // OAuth методы
    async startGitHubAuth(action = 'login') {
        const authUrl = `${this.config.apiBaseUrl}/auth/github`;
        window.location.href = authUrl;
    }

    async startYandexAuth(action = 'login') {
        const authUrl = `${this.config.apiBaseUrl}/auth/yandex`;
        window.location.href = authUrl;
    }

    // Email аутентификация
    async startEmailAuth() {
        try {
            const email = document.getElementById('login-username')?.value;
            const password = document.getElementById('login-password')?.value;
            
            if (!email || !password) {
                this.showMessage('login-message', 'Заполните все поля', 'error');
                return;
            }

            const codeResponse = await this.requestCode(email);
            this.showMessage('login-message', 'Код отправлен на email', 'success');
            this.showCodeVerification(email, 'login');
            
        } catch (error) {
            this.handleError('Email auth', error);
        }
    }

    async startEmailRegistration() {
        try {
            const username = document.getElementById('register-username')?.value;
            const email = document.getElementById('register-email')?.value;
            const password = document.getElementById('register-password')?.value;
            const confirmPassword = document.getElementById('register-confirm')?.value;
            
            if (password !== confirmPassword) {
                this.showMessage('register-message', 'Пароли не совпадают', 'error');
                return;
            }

            if (!document.getElementById('agree-terms')?.checked) {
                this.showMessage('register-message', 'Примите условия использования', 'error');
                return;
            }

            const codeResponse = await this.requestCode(email);
            this.showMessage('register-message', 'Код отправлен на email', 'success');
            this.showCodeVerification(email, 'register');
            
        } catch (error) {
            this.handleError('Email registration', error);
        }
    }

    // API методы
    async requestCode(email) {
        const response = await fetch(`${this.config.apiBaseUrl}/auth/code/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.config.customHeaders
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    }

    async verifyCode(email, code) {
        const response = await fetch(`${this.config.apiBaseUrl}/auth/code/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.config.customHeaders
            },
            body: JSON.stringify({ email, code })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        this.setToken(data.access_token);
        await this.fetchCurrentUser();
        
        return data;
    }

    async fetchCurrentUser() {
        if (!this.token) {
            throw new Error('Токен не найден');
        }
        
        const response = await fetch(`${this.config.apiBaseUrl}/me`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                ...this.config.customHeaders
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const user = await response.json();
        this.setUser(user);
        
        return user;
    }

    // Управление сессией
    setToken(token) {
        this.token = token;
        localStorage.setItem(this.config.tokenStorageKey, token);
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem(this.config.userStorageKey, JSON.stringify(user));
        
        if (this.config.onLoginSuccess) {
            this.config.onLoginSuccess(user);
        }
        
        if (typeof App !== 'undefined' && App.showMainInterface) {
            App.showMainInterface({
                username: user.email?.split('@')[0] || 'Пользователь',
                email: user.email,
                authMethod: user.auth_method || 'unknown',
                id: user.id
            });
        }
    }

    logout() {
        this.clearAuth();
        
        if (this.config.onLogout) {
            this.config.onLogout();
        }
        
        if (typeof App !== 'undefined' && App.showAuthInterface) {
            App.showAuthInterface();
        }
    }

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem(this.config.tokenStorageKey);
        localStorage.removeItem(this.config.userStorageKey);
    }

    // Вспомогательные методы
    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');
        
        if (error) {
            this.showMessage('login-message', `Ошибка: ${error}`, 'error');
            this.cleanUrl();
            return;
        }
        
        if (token) {
            this.setToken(token);
            this.fetchCurrentUser().then(() => {
                this.cleanUrl();
            }).catch(err => {
                this.handleError('OAuth callback', err);
            });
        }
    }
    
    cleanUrl() {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    showMessage(elementId, message, type = 'info') {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.className = `auth-message ${type}`;
            element.style.display = 'block';
            
            if (type !== 'error') {
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5000);
            }
        }
    }

    handleError(context, error) {
        console.error(`Ошибка в ${context}:`, error);
        
        if (this.config.onError) {
            this.config.onError(error, context);
        }
        
        this.showMessage('login-message', `Ошибка: ${error.message}`, 'error');
    }

    // Геттеры
    getCurrentUser() {
        return this.user;
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getToken() {
        return this.token;
    }
}

// Экспортируем глобально
window.AuthIntegration = AuthIntegration;