// auth-ui.js
class AuthUI {
    static renderAuthForm() {
        return `
            <div class="auth-container">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Вход</button>
                    <button class="auth-tab" data-tab="register">Регистрация</button>
                </div>
                
                <!-- Форма входа -->
                <div id="login-form" class="auth-form">
                    <h2>Вход в систему</h2>
                    
                    <div class="input-group">
                        <input type="text" id="login-username" placeholder="Email или имя пользователя" class="auth-input">
                        <div class="input-icon"></div>
                    </div>
                    
                    <div class="input-group">
                        <input type="password" id="login-password" placeholder="Пароль" class="auth-input">
                        <div class="input-icon"></div>
                    </div>
                    
                    <button id="login-btn" class="btn-primary auth-btn">
                        Войти
                    </button>
                    
                    <div class="divider">
                        <span class="divider-text">или</span>
                    </div>
                    
                    <div class="social-auth">
                        <a href="#" id="github-login" class="btn-github social-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>Войти через GitHub</span>
                        </a>
                        
                        <a href="#" id="yandex-login" class="btn-yandex social-btn">
                            <span>Войти через Яндекс</span>
                        </a>

                        <button id="code-login-btn" class="btn-code social-btn">
                            <span>📧 Войти по email-коду</span>
                        </button>
                    </div>

                    <div id="code-form" class="auth-form" style="display: none; margin-top: 20px;">
                        <h3>Введите код</h3>
                        <div class="input-group">
                            <input type="email" id="code-email" placeholder="Ваш email" class="auth-input">
                            <div class="input-icon"></div>
                        </div>
                        <div class="input-group">
                            <input type="text" id="code-input" placeholder="Код из письма (6 цифр)" class="auth-input" maxlength="6">
                            <div class="input-icon"></div>
                        </div>
                        <button id="request-code-btn" class="btn-secondary auth-btn">Отправить код</button>
                        <button id="verify-code-btn" class="btn-primary auth-btn">Подтвердить</button>
                        <div id="code-status"></div>
                    </div>
                </div>
                
                <!-- Форма регистрации -->
                <div id="register-form" class="auth-form" style="display: none;">
                    <h2>Регистрация</h2>
                    
                    <div class="option-card">
                        <h3>📧 Через Email</h3>
                        <div class="input-group">
                            <input type="email" id="register-email" placeholder="Ваш email" class="auth-input">
                            <div class="input-icon"></div>
                        </div>
                        <button id="register-btn" class="btn-primary auth-btn">Зарегистрироваться</button>
                    </div>
                    
                    <div class="divider">
                        <span class="divider-text">или</span>
                    </div>
                    
                    <!-- GitHub регистрация -->
                    <div class="option-card">
                        <h3>🐙 Регистрация через GitHub</h3>
                        <p class="option-description">
                            Быстро и безопасно. Не нужно запоминать пароль.
                        </p>
                        <button id="github-register-btn" class="btn-github social-btn">
                            <span>Зарегистрироваться через GitHub</span>
                        </button>
                    </div>

                    <!-- Яндекс регистрация -->
                    <div class="option-card">
                        <h3>🔴 Регистрация через Яндекс</h3>
                        <p class="option-description">
                            Надёжно и удобно. Подтверждение через Яндекс ID.
                        </p>
                        <button id="yandex-register-btn" class="btn-yandex social-btn">
                            <span>Зарегистрироваться через Яндекс</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static setupAuthHandlers() {
        // Переключение вкладок
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.getElementById('login-form').style.display = tabName === 'login' ? 'block' : 'none';
                document.getElementById('register-form').style.display = tabName === 'register' ? 'block' : 'none';
            });
        });

        // Разблокируем поля
        document.querySelectorAll('#register-form input, #register-form button').forEach(el => {
            el.removeAttribute('disabled');
        });

        // GitHub
        document.getElementById('github-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/github';
        });

        document.getElementById('github-register-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/github';
        });

        // Яндекс
        document.getElementById('yandex-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/yandex';
        });

        document.getElementById('yandex-register-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/yandex';
        });

        // По коду
        document.getElementById('code-login-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            const form = document.getElementById('code-form');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        });

        // Запрос кода
        document.getElementById('request-code-btn')?.addEventListener('click', async () => {
            const email = document.getElementById('code-email')?.value.trim();
            if (!email) {
                AuthUI.updateCodeStatus('Введите email', 'error');
                return;
            }

            try {
                if (typeof App.requestCode === 'function') {
                    await App.requestCode(email);
                    AuthUI.updateCodeStatus('Код отправлен (см. консоль сервера)', 'success');
                } else {
                    throw new Error('App.requestCode не найден');
                }
            } catch (err) {
                AuthUI.updateCodeStatus(err.message, 'error');
            }
        });

        // Подтверждение кода
        document.getElementById('verify-code-btn')?.addEventListener('click', async () => {
            const email = document.getElementById('code-email')?.value.trim();
            const code = document.getElementById('code-input')?.value.trim();

            if (!email || !code) {
                alert('Заполните email и код');
                return;
            }

            try {
                await App.loginByCode(email, code);
            } catch (err) {
                alert('Ошибка: ' + (err.message || 'Не удалось войти'));
            }
        });

        // Регистрация по email
        document.getElementById('register-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email')?.value.trim();
            if (!email) {
                alert('Введите email');
                return;
            }

            try {
                if (typeof App.requestCode === 'function') {
                    await App.requestCode(email);
                    alert(`Код отправлен на ${email}\nВведите его в форме "Вход по email-коду"`);
                    
                    document.querySelector('.auth-tab[data-tab="login"]').click();
                    document.getElementById('code-email').value = email;
                    document.getElementById('code-form').style.display = 'block';
                } else {
                    throw new Error('App.requestCode не найден');
                }
            } catch (err) {
                alert('Ошибка: ' + err.message);
            }
        });
    }

    static updateCodeStatus(message, type = 'info') {
        const el = document.getElementById('code-status');
        if (el) {
            el.innerHTML = `<div class="status ${type === 'error' ? 'error' : 'success'}">${message}</div>`;
        }
    }

    static async login(username, password) {
        return {
            id: 'demo_123',
            username: username,
            email: username.includes('@') ? username : `${username}@example.com`,
            authMethod: 'password',
            roles: ['Student']
        };
    }
}