class App {
    static init() {
        console.log("🚀 Приложение запускается...");
        
        // Всегда показываем форму аутентификации
        this.renderAuthInterface();
    }

    static renderAuthInterface() {
        const appElement = document.getElementById('app');
        
        if (!appElement) {
            console.error("❌ Не найден элемент с id='app'");
            return;
        }

        // Показываем ТОЛЬКО форму аутентификации
        appElement.innerHTML = AuthUI.renderAuthForm();
        AuthUI.setupAuthHandlers();
    }
    
    // Публичные методы для интеграции
    static showMainInterface(userData) {
        console.log("🎉 Пользователь вошел:", userData);
        
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <div class="main-interface">
                <header class="header">
                    <h1>Task Manager</h1>
                    <div class="user-info">
                        <span>Добро пожаловать, ${userData.username || 'Пользователь'}!</span>
                        <button id="logout-btn" class="btn btn-secondary">
                            Выйти
                        </button>
                    </div>
                </header>
                
                <div class="main-container">
                    <nav class="sidebar">
                        <ul class="nav-menu">
                            <li><a href="#" onclick="alert('Функционал в разработке')">👥 Пользователи</a></li>
                            <li><a href="#" onclick="alert('Функционал в разработке')">✅ Задачи</a></li>
                            <li><a href="#" onclick="alert('Функционал в разработке')">👤 Профиль</a></li>
                            <li><a href="#" onclick="alert('Функционал в разработке')">⚙️ Настройки</a></li>
                        </ul>
                    </nav>
                    
                    <main class="content">
                        <div class="card fade-in">
                            <h2>🎯 Добро пожаловать в Task Manager!</h2>
                            <p>Вы успешно вошли в систему как <strong>${userData.username || 'Пользователь'}</strong>.</p>
                            
                            <div class="user-info-card">
                                <h3>📊 Информация о сессии:</h3>
                                <p><strong>Имя пользователя:</strong> ${userData.username || 'Не указано'}</p>
                                <p><strong>Email:</strong> ${userData.email || 'Не указан'}</p>
                                <p><strong>Метод входа:</strong> ${userData.authMethod || 'Неизвестно'}</p>
                                <p><strong>Время входа:</strong> ${new Date().toLocaleTimeString()}</p>
                            </div>
                            
                            <div class="demo-actions">
                                <h3>🔧 Демо-функции:</h3>
                                <button class="btn btn-primary" onclick="App.handleCrossDeviceAuth()">📱 Кросс-девайс авторизация</button>
                                <button class="btn btn-secondary" onclick="App.logout(true)">🚪 Выйти со всех устройств</button>
                            </div>
                        </div>
                    </main>
                </div>
                
                <style>
                    .main-interface {
                        background: white;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                    }
                    
                    .user-info-card {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                        margin: 20px 0;
                        color: #333;
                    }
                    
                    .user-info-card h3 {
                        color: #333;
                        margin-bottom: 15px;
                    }
                    
                    .user-info-card p {
                        margin: 8px 0;
                        color: #555;
                    }
                    
                    .user-info-card strong {
                        color: #333;
                        min-width: 150px;
                        display: inline-block;
                    }
                    
                    .demo-actions {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                    }
                    
                    .demo-actions h3 {
                        color: #333;
                        margin-bottom: 15px;
                    }
                    
                    .demo-actions button {
                        margin-right: 10px;
                    }
                </style>
            </div>
        `;
        
        // Обработчик выхода
        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Если разработчик подключил свою систему
            if (window.authSystem && typeof authSystem.logout === 'function') {
                authSystem.logout();
            } else {
                // Запасной вариант
                App.showAuthInterface();
            }
        });
    }
    
    static showAuthInterface() {
        console.log("🔄 Возврат к форме аутентификации");
        this.renderAuthInterface();
    }

    // ================ ДОБАВЛЕННЫЙ КОД НИЖЕ ================
    // Вся логика авторизации — без изменения старого кода

    // Хранилище токенов
    static tokens = {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token')
    };

    // Сохранение токенов
    static setTokens(accessToken, refreshToken) {
        this.tokens.access_token = accessToken;
        this.tokens.refresh_token = refreshToken;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    // Очистка токенов
    static clearTokens() {
        this.tokens.access_token = null;
        this.tokens.refresh_token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    // Проверка, авторизован ли пользователь
    static isAuthenticated() {
        return !!this.tokens.access_token;
    }

    // Универсальный fetch с поддержкой авторизации и auto-refresh
    static async apiFetch(url, options = {}) {
        const { access_token, refresh_token } = this.tokens;

        // Добавляем заголовок Authorization
        if (access_token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${access_token}`
            };
        }

        let response = await fetch(`http://localhost:8000${url}`, options);

        // Если токен устарел — обновляем
        if (response.status === 401 && refresh_token) {
            try {
                await this.refreshToken();
                // Повторяем запрос с новым токеном
                options.headers['Authorization'] = `Bearer ${this.tokens.access_token}`;
                response = await fetch(`http://localhost:8000${url}`, options);
            } catch (err) {
                console.error('Не удалось обновить токен:', err);
                this.clearTokens();
                throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    // Обновление access_token
    static async refreshToken() {
        if (!this.tokens.refresh_token) {
            throw new Error('Нет refresh_token');
        }

        const result = await this.apiFetch('/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: this.tokens.refresh_token })
        });

        this.setTokens(result.access_token, result.refresh_token);
        return result;
    }

    // Получение данных пользователя
    static async getUserInfo() {
        try {
            const data = await this.apiFetch('/me');
            return {
                id: data.id,
                username: data.email?.split('@')[0] || 'Пользователь',
                email: data.email,
                authMethod: data.auth_method
            };
        } catch (err) {
            console.error('Не удалось получить данные пользователя:', err);
            throw err;
        }
    }

    // Вход по коду (email + код)
    static async loginByCode(email, code) {
        try {
            const result = await this.apiFetch('/auth/code/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            this.setTokens(result.access_token, result.refresh_token);
            
            const userInfo = await this.getUserInfo();
            this.showMainInterface(userInfo);
        } catch (err) {
            throw err;
        }
    }

    // Запрос кода на email
    static async requestCode(email) {
        try {
            await this.apiFetch('/auth/code/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return true;
        } catch (err) {
            throw err;
        }
    }

    // Кросс-девайс: подтвердить код с другого устройства
    static async submitCrossCode(code) {
        if (!this.tokens.refresh_token) {
            throw new Error('Нужен refresh_token для кросс-девайс авторизации');
        }

        try {
            const result = await this.apiFetch('/auth/code/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, refresh_token: this.tokens.refresh_token })
            });
            return result;
        } catch (err) {
            throw err;
        }
    }

    // Выход из системы
    static logout(logoutAll = false) {
        if (logoutAll && this.tokens.refresh_token) {
            // Выход со всех устройств
            fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: this.tokens.refresh_token })
            }).catch(console.error);
        }

        this.clearTokens();
        this.showAuthInterface();
    }

    // Обработка кросс-девайс авторизации (из UI)
    static async handleCrossDeviceAuth() {
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

    // Проверка состояния при загрузке (можно вызывать извне)
    static async checkAuthStatus() {
        if (this.isAuthenticated()) {
            try {
                const userInfo = await this.getUserInfo();
                this.showMainInterface(userInfo);
            } catch (err) {
                console.warn('Сессия недействительна:', err.message);
                this.clearTokens();
            }
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    // Автоматически проверяем сессию
    App.checkAuthStatus();
});
