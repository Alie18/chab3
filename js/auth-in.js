class AuthIntegration {
    constructor(config = {}) {
        // Настройки по умолчанию
        this.config = {
            apiBaseUrl: 'http://localhost:8000',
            tokenStorageKey: 'auth_token',
            userStorageKey: 'auth_user',
            refreshStorageKey: 'auth_refresh',
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
        this.refresh_token = localStorage.getItem(this.config.refreshStorageKey);
        this.user = JSON.parse(localStorage.getItem(this.config.userStorageKey) || 'null');
        this.isInitialized = false;

        // Автоматическая проверка сессии при инициализации
        if (this.config.validateOnInit && (this.token || this.refresh_token)) {
            this.checkAuthStatus().catch(console.warn);
        }
    }

    // Проверка состояния (токен жив? нужно обновить?)
    async checkAuthStatus() {
        if (this.token) {
            try {
                await this.fetchCurrentUser();
                return true;
            } catch (err) {
                console.warn('Токен недействителен, пробуем обновить...');
            }
        }

        if (this.refresh_token) {
            try {
                await this.refreshToken();
                await this.fetchCurrentUser();
                return true;
            } catch (err) {
                console.warn('Не удалось обновить сессию');
                this.clearAuth();
            }
        }

        return false;
    }

    init() {
        console.log('🔧 Инициализация системы аутентификации...');
        
        try {
            if (this.config.autoBind) {
                this.bindToButtons();
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

        // Кросс-девайс
        this.bindButton('cross-device-btn', () => this.startCrossDeviceAuth()); // ← ДОБАВЛЕНО

        // Выход
        this.bindButton('logout-btn', () => this.logout());
        this.bindButton('logout-all-btn', () => this.logout(true)); // ← ДОБАВЛЕНО
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

    // Кросс-девайс авторизация
    async startCrossDeviceAuth() {
        const code = prompt('Введите код из Telegram (6 цифр):');
        if (!code || code.length !== 6) {
            alert('Неверный формат кода');
            return;
        }

        try {
            const result = await this.submitCrossCode(code);
            alert(result.message || 'Авторизация завершена');
        } catch (err) {
            alert('Ошибка: ' + (err.message || 'Не удалось подтвердить код'));
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
        
        this.setTokens(data.access_token, data.refresh_token);
        await this.fetchCurrentUser();
        
        return data;
    }

    // Обновление токена
    async refreshToken() {
        if (!this.refresh_token) {
            throw new Error('Нет refresh_token для обновления');
        }

        const response = await fetch(`${this.config.apiBaseUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.config.customHeaders
            },
            body: JSON.stringify({ refresh_token: this.refresh_token })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Не удалось обновить токен`);
        }

        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);
        return data;
    }

    // Кросс-девайс подтверждение
    async submitCrossCode(code) {
        if (!this.refresh_token) {
            throw new Error('Нужен refresh_token для кросс-девайс авторизации');
        }

        const response = await fetch(`${this.config.apiBaseUrl}/auth/code/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.config.customHeaders
            },
            body: JSON.stringify({ code, refresh_token: this.refresh_token })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
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
            // Aвтообновление при 401
            if (response.status === 401 && this.refresh_token) {
                await this.refreshToken();
                return this.fetchCurrentUser();
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const user = await response.json();
        this.setUser(user);
        
        return user;
    }

    // Управление обоими токенами
    setTokens(accessToken, refreshToken) {
        this.token = accessToken;
        this.refresh_token = refreshToken;
        localStorage.setItem(this.config.tokenStorageKey, accessToken);
        localStorage.setItem(this.config.refreshStorageKey, refreshToken); // сохраняем refresh
    }

    setToken(token) {
        this.setTokens(token, this.refresh_token);
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

    // Выход со всех устройств
    async logout(logoutAll = false) {
        if (logoutAll && this.refresh_token) {
            try {
                await fetch(`${this.config.apiBaseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.config.customHeaders
                    },
                    body: JSON.stringify({ refresh_token: this.refresh_token })
                });
            } catch (err) {
                console.warn('Не удалось выйти со всех устройств:', err);
            }
        }

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
        this.refresh_token = null;
        this.user = null;
        localStorage.removeItem(this.config.tokenStorageKey);
        localStorage.removeItem(this.config.refreshStorageKey);
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
            this.setTokens(token, null);
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

    // Универсальный API-запрос с поддержкой авторизации и auto-refresh
    async apiRequest(url, options = {}) {
        if (this.token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${this.token}`
            };
        }

        let response = await fetch(`${this.config.apiBaseUrl}${url}`, options);

        // Автообновление при 401
        if (response.status === 401 && this.refresh_token) {
            try {
                await this.refreshToken();
                // Повторяем запрос
                options.headers['Authorization'] = `Bearer ${this.token}`;
                response = await fetch(`${this.config.apiBaseUrl}${url}`, options);
            } catch (err) {
                this.clearAuth();
                throw new Error('Сессия истекла');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    // Геттеры
    getCurrentUser() {
        return this.user;
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    // Получить refresh_token (для кросс-девайса)
    getRefreshToken() {
        return this.refresh_token;
    }

    // Инициализация для Web Client
    static initForWebClient() {
        return new AuthIntegration({
            apiBaseUrl: 'http://localhost:8000',
            autoBind: true,
            validateOnInit: true,
            onLoginSuccess: (user) => {
                if (window.App && App.showMainInterface) {
                    App.showMainInterface({
                        username: user.email?.split('@')[0] || 'Пользователь',
                        email: user.email,
                        authMethod: user.auth_method,
                        id: user.id
                    });
                }
            },
            onLogout: () => {
                if (window.App && App.showAuthInterface) {
                    App.showAuthInterface();
                }
            }
        }).init();
    }
}

// Экспортируем глобально
window.AuthIntegration = AuthIntegration;

//Автоинициализация при загрузке (опционально)
document.addEventListener('DOMContentLoaded', () => {
    if (!window.authSystem) {
        window.authSystem = AuthIntegration.initForWebClient();
    }
});
