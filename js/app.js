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
                                <button class="btn btn-primary" onclick="alert('Демо: Создание задачи')">➕ Создать задачу</button>
                                <button class="btn btn-secondary" onclick="alert('Демо: Просмотр статистики')">📊 Статистика</button>
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
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});