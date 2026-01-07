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
                        <input type="text" id="login-username" placeholder="Имя пользователя или Email" class="auth-input">
                        <div class="input-icon">👤</div>
                    </div>
                    
                    <div class="input-group">
                        <input type="password" id="login-password" placeholder="Пароль" class="auth-input">
                        <div class="input-icon">🔒</div>
                    </div>
                    
                    <button id="login-btn" class="btn-primary auth-btn">
                        <span class="btn-text">Войти</span>
                    </button>
                    
                    <div class="divider">
                        <span class="divider-text">или войти через</span>
                    </div>
                    
                    <div class="social-auth">
                        <!-- GitHub кнопка -->
                        <a href="#" id="github-login" class="btn-github social-btn" onclick="return false;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <span>Войти через GitHub</span>
                        </a>
                        
                        <!-- Яндекс кнопка -->
                        <a href="#" id="yandex-login" class="btn-yandex social-btn" onclick="return false;">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#FF0000" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6 17.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-6-10c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.8 0 5-2.2 5-5s-2.2-5-5-5z"/>
                            </svg>
                            <span>Войти через Яндекс</span>
                        </a>

                        <!-- Код-вход -->
                        <button id="code-login-btn" class="btn-code social-btn" style="background: #007bff; color: white;">
                            <span>📧 Войти по email-коду</span>
                        </button>
                    </div>
                    
                    <!-- Форма email-кода (скрыта по умолчанию) -->
                    <div id="code-form" class="auth-form" style="display: none; margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                        <h3>Войти по email-коду</h3>
                        <div class="input-group">
                            <input type="email" id="code-email" placeholder="Ваш email" class="auth-input">
                            <div class="input-icon">📧</div>
                        </div>
                        <div class="input-group">
                            <input type="text" id="code-input" placeholder="Код (6 цифр)" class="auth-input" maxlength="6">
                            <div class="input-icon">#</div>
                        </div>
                        <button id="request-code-btn" class="btn-secondary auth-btn" style="margin: 10px 5px;">
                            Отправить код
                        </button>
                        <button id="verify-code-btn" class="btn-primary auth-btn" style="margin: 10px 5px;">
                            Подтвердить
                        </button>
                        <div id="code-status" style="margin-top: 10px; font-size: 14px;"></div>
                    </div>
                </div>
                
                <!-- Форма регистрации -->
                <div id="register-form" class="auth-form" style="display: none;">
                    <h2>Регистрация</h2>
                    
                    <div class="register-options">
                        <!-- Email регистрация -->
                        <div class="option-card">
                            <h3>📧 Через Email</h3>
                            <p class="option-description">
                                Традиционная регистрация с email и паролем
                            </p>
                            
                            <div class="input-group">
                                <input type="text" id="register-username" placeholder="Имя пользователя" class="auth-input" disabled>
                                <div class="input-icon">👤</div>
                            </div>
                            
                            <div class="input-group">
                                <input type="email" id="register-email" placeholder="Email" class="auth-input" disabled>
                                <div class="input-icon">📧</div>
                            </div>
                            
                            <div class="input-group">
                                <input type="password" id="register-password" placeholder="Пароль (минимум 6 символов)" class="auth-input" disabled>
                                <div class="input-icon">🔒</div>
                            </div>
                            
                            <div class="input-group">
                                <input type="password" id="register-confirm" placeholder="Повторите пароль" class="auth-input" disabled>
                                <div class="input-icon">🔒</div>
                            </div>
                            
                            
                            <button id="register-btn" class="btn-primary auth-btn" disabled>
                                <span class="btn-text">Зарегистрироваться</span>
                            </button>
                        </div>
                        
                        <div class="divider">
                            <span class="divider-text">или</span>
                        </div>
                        
                        <!-- GitHub регистрация -->
                        <div class="option-card">
                            <h3>🐙 Через GitHub</h3>
                            <p class="option-description">
                                Быстрая регистрация в один клик. Мы получим только ваш публичный профиль.
                            </p>
                            
                            <ul class="github-benefits">
                                <li>Не нужно запоминать пароль</li>
                                <li>Автоматическая верификация email</li>
                                <li>Можно привязать позже к email</li>
                            </ul>
                            
                            <button id="github-register-btn" class="btn-github social-btn" disabled>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>Зарегистрироваться через GitHub</span>
                            </button>
                        </div>
                        
                        <!-- Яндекс регистрация -->
                        <div class="option-card">
                            <h3>🔴 Через Яндекс</h3>
                            <p class="option-description">
                                Вход через Яндекс ID. Быстро и безопасно.
                            </p>
                            
                            <ul class="yandex-benefits">
                                <li>Не нужно запоминать пароль</li>
                                <li>Двухфакторная аутентификация</li>
                                <li>Верифицированный аккаунт</li>
                            </ul>
                            
                            <button id="yandex-register-btn" class="btn-yandex social-btn" disabled>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="#FF0000" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm6 17.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-6-10c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.8 0 5-2.2 5-5s-2.2-5-5-5z"/>
                                </svg>
                                <span>Зарегистрироваться через Яндекс</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="terms">
                        <label class="checkbox-label">
                            <input type="checkbox" id="agree-terms" disabled>
                            <span>Я согласен с <a href="#" class="terms-link" onclick="return false;">Условиями использования</a> и <a href="#" class="terms-link" onclick="return false;">Политикой конфиденциальности</a></span>
                        </label>
                    </div>
                    
                    <div class="auth-links">
                        <p>Уже есть аккаунт? <a href="#" class="switch-to-login" onclick="return false;">Войти</a></p>
                    </div>
                </div>
            </div>
        `;
    }

    static setupAuthHandlers() {
        // ТОЛЬКО переключение между вкладками (вся логика у разработчика)
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                
                // Снимаем активный класс со всех вкладок
                document.querySelectorAll('.auth-tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // Добавляем активный класс текущей вкладке
                e.target.classList.add('active');
                
                // Показываем соответствующую форму
                document.getElementById('login-form').style.display =
                    tabName === 'login' ? 'block' : 'none';
                document.getElementById('register-form').style.display =
                    tabName === 'register' ? 'block' : 'none';
            });
        });
        
        // Обработчик для переключения на вход с регистрации
        document.querySelector('.switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.auth-tab[data-tab="login"]').click();
        });
        
        // Обработчик кнопки входа
        document.getElementById('login-btn')?.addEventListener('click', async () => {
            const username = document.getElementById('login-username')?.value;
            const password = document.getElementById('login-password')?.value;
            
            if (!username || !password) {
                console.log('Пожалуйста, введите имя пользователя и пароль');
                return;
            }
            
            try {
                const result = await AuthUI.login(username, password);
                console.log('Успешный вход:', result);
                
                // Передаем управление основному приложению
                if (window.App && typeof window.App.showMainInterface === 'function') {
                    window.App.showMainInterface(result);
                }
            } catch (error) {
                console.error('Ошибка аутентификации:', error);
            }
        });
        
        console.log('✅ UI обработчики настроены. Ожидание интеграции от разработчика...');
        
        document.querySelectorAll('#register-form input, #register-form button').forEach(el => {
        el.removeAttribute('disabled');
        });

        document.getElementById('github-register-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/github';
        });

        document.getElementById('yandex-register-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/yandex';
        });

        // Кнопка "Зарегистрироваться" (по email-коду)
        document.getElementById('register-btn')?.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = document.getElementById('register-email')?.value.trim();
            if (!email) {
                alert('Введите email');
                return;
            }

            try {
                if (window.authSystem) {
                    await authSystem.requestCode(email);
                    alert(`Код отправлен на ${email}\nВведите его в форме "Вход по email-коду"`);

                    // Автоматически переключаемся на вкладку "Вход"
                    document.querySelector('.auth-tab[data-tab="login"]').click();
                    document.getElementById('code-email').value = email;
                    document.getElementById('code-form').style.display = 'block';
                } else {
                    throw new Error('App.requestCode не найден — проверьте app.js');
                }
            } catch (err) {
                alert('Ошибка: ' + err.message);
            }
        });

        // GitHub и Яндекс — редирект
        document.getElementById('github-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/github';
        });

        document.getElementById('yandex-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'http://localhost:8000/auth/yandex';
        });

        // Кнопка "Войти по email-коду"
        document.getElementById('code-login-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            const codeForm = document.getElementById('code-form');
            codeForm.style.display = codeForm.style.display === 'none' ? 'block' : 'none';
        });

        // Запрос кодa
        document.getElementById('request-code-btn')?.addEventListener('click', async () => {
            const email = document.getElementById('code-email')?.value.trim();
            if (!email) {
                AuthUI.updateCodeStatus('Введите email', 'error'); // ✅ AuthUI., а не this
                return;
            }

            try {
                console.log('Проверка App.requestCode:', typeof App.requestCode);
                if (typeof App.requestCode === 'function') {
                    await App.requestCode(email);
                    AuthUI.updateCodeStatus('Код отправлен (см. консоль сервера)', 'success'); // ✅
                } else {
                    throw new Error('App.requestCode не найден. Доступные методы: ' + Object.keys(App).join(', '));
                }
            } catch (err) {
                console.error('Ошибка в request-code-btn:', err);
                AuthUI.updateCodeStatus(err.message, 'error');
            }
        });

        // Подтверждение кодa
        document.getElementById('verify-code-btn')?.addEventListener('click', async () => {
            const email = document.getElementById('code-email')?.value.trim();
            const code = document.getElementById('code-input')?.value.trim();

            if (!email || !code) {
                alert('Заполните email и код');
                return;
            }

            try {
                console.log('Вызываем App.loginByCode...');
                await App.loginByCode(email, code);
                alert('✅ Успешный вход!');
            } catch (err) {
                console.error('Ошибка loginByCode:', err);
                alert('❌ Ошибка: ' + (err.message || 'Неизвестная ошибка'));
            }
        });
    }

    // Вспомогательные методы

    static updateCodeStatus(message, type = 'info') {
        const el = document.getElementById('code-status');
        if (el) {
            el.textContent = message;
            el.style.color = type === 'error' ? '#d32f2f' : '#2e7d32';
        }
    }

    // Совместимость с существующим API (для парольного входа — пока заглушка)
    static async login(username, password) {
        return {
            id: 'demo_123',
            username: username,
            email: username.includes('@') ? username : `${username}@example.com`,
            authMethod: 'password'
        };
    }
}
