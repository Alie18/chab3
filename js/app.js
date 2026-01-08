class App {
    static init() {
        console.log("🚀 Приложение запускается...");
        this.renderAuthInterface();
    }

    static renderAuthInterface() {
        const appElement = document.getElementById('app');
        if (!appElement) {
            console.error("❌ Не найден элемент с id='app'");
            return;
        }
        appElement.innerHTML = AuthUI.renderAuthForm();
        AuthUI.setupAuthHandlers();
    }

    static showMainInterface(userData) {
        console.log("🎉 Пользователь вошел:", userData);
        
        const roles = userData.roles || ['Admin'];
        const isAdmin = roles.includes('Admin');
        const isTeacher = roles.includes('Teacher') || isAdmin;
        const isStudent = roles.includes('Student') || isTeacher || isAdmin;

        // Меню по ролям
        const menuItems = [];
        if (isStudent) menuItems.push({ id: 'dashboard', label: 'Панель', icon: '📊' });
        if (isStudent) menuItems.push({ id: 'tests', label: 'Тесты', icon: '📝' });
        if (isTeacher) menuItems.push({ id: 'users', label: 'Пользователи', icon: '👥' });
        menuItems.push({ id: 'profile', label: 'Профиль', icon: '👤' });
        if (isAdmin) menuItems.push({ id: 'settings', label: 'Настройки', icon: '⚙️' });

        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <div class="main-interface">
                <header class="header">
                    <h1>🎓 Тестирование по программированию</h1>
                    <div class="user-info">
                        <span>${userData.username} 
                            <span class="badge ${roles[0].toLowerCase()}">${roles[0]}</span>
                        </span>
                        <button id="logout-btn" class="btn btn-secondary">
                            Выйти
                        </button>
                    </div>
                    <style>
                        .main-interface {
                            background: var(--primary-light);
                        }
                        .badge {
                            display: inline-block;
                            padding: 3px 10px;
                            border-radius: 20px;
                            font-size: 13px;
                            background: var(--primary-light);
                            color: var(--text);
                            margin-left: 8px;
                        }
                    </style>
                </header>
                
                <div class="main-container">
                    <nav class="sidebar">
                        <ul class="nav-menu">
                            ${menuItems.map(item => `
                                <li>
                                    <a href="#" id="nav-${item.id}" class="nav-link ${item.id === 'dashboard' ? 'active' : ''}">
                                        ${item.icon} ${item.label}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </nav>
                    
                    <main class="content">
                        <div id="content-area">
                            <!-- Контент будет загружен динамически -->
                        </div>
                    </main>
                </div>
            </div>
        `;

        document.getElementById('logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            App.logout();
        });

        this.showSection('dashboard', userData);

        // Навигация
        menuItems.forEach(item => {
            document.getElementById(`nav-${item.id}`)?.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
                e.target.classList.add('active');
                this.showSection(item.id, userData);
            });
        });
    }

    static showSection(sectionId, userData) {
        const content = document.getElementById('content-area');
        if (!content) return;

        let html = '';

        switch (sectionId) {
            case 'dashboard':
                html = this.renderDashboard(userData);
                break;
            case 'tests':
                html = this.renderTestsList();
                break;
            case 'users':
                html = this.renderUsersSection();
                break;
            case 'profile':
                html = this.renderProfileSection(userData);
                break;
            case 'settings':
                html = this.renderSettingsSection(userData);
                break;
            case 'test-python':
                html = this.renderTest('python');
                break;
            case 'test-js':
                html = this.renderTest('js');
                break;
            case 'test-cpp':
                html = this.renderTest('cpp');
                break;
            default:
                html = `<div class="card"><h3>Раздел не найден</h3></div>`;
        }

        content.innerHTML = html;

        if (sectionId.startsWith('test-')) {
            this.setupTestHandlers(sectionId);
        }
    }

    static renderDashboard(userData) {
        const roles = userData.roles || ['Student'];
        return `
            <div class="card">
                <h2>🎯 Добро пожаловать, ${userData.username}!</h2>
                <p>Вы вошли как <strong>${roles.join(', ')}</strong></p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 24px;">
                    <div class="card test-card">
                        <div class="test-title">📝 Тест по Python</div>
                        <div class="test-meta">
                            <span>10 вопросов</span>
                            <span>⭐ Сложность: средняя</span>
                        </div>
                        <button class="btn btn-primary" onclick="App.showSection('test-python')">
                            Начать тест
                        </button>
                    </div>
                    
                    <div class="card test-card">
                        <div class="test-title">📜 Тест по JavaScript</div>
                        <div class="test-meta">
                            <span>8 вопросов</span>
                            <span>⭐ Сложность: высокая</span>
                        </div>
                        <button class="btn btn-primary" onclick="App.showSection('test-js')">
                            Начать тест
                        </button>
                    </div>
                    
                    <div class="card test-card">
                        <div class="test-title">💻 Тест по C++</div>
                        <div class="test-meta">
                            <span>12 вопросов</span>
                            <span>⭐ Сложность: высокая</span>
                        </div>
                        <button class="btn btn-primary" onclick="App.showSection('test-cpp')">
                            Начать тест
                        </button>
                    </div>
                </div>

                <div class="card" style="margin-top: 24px;">
                    <h3>📊 Ваша статистика</h3>
                    <div style="display: flex; gap: 32px; margin-top: 16px;">
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; color: var(--primary);">5</div>
                            <div>Пройдено тестов</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; color: var(--success);">84%</div>
                            <div>Средний результат</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; color: var(--warning);">2</div>
                            <div>К сертификации</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderTestsList() {
        return `
            <div class="card">
                <h2>📝 Доступные тесты</h2>
                <p>Проверьте свои знания по программированию</p>
                
                <div style="display: grid; gap: 20px; margin-top: 24px;">
                    <div class="card">
                        <div class="test-title">🐍 Python Основы</div>
                        <p>Переменные, циклы, функции, списки</p>
                        <div class="test-meta">
                            <span>10 вопросов</span>
                            <span>⏱ 15 минут</span>
                        </div>
                        <button class="btn btn-primary" onclick="App.showSection('test-python')">
                            Начать тест
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="test-title">🌐 JavaScript для фронтенда</div>
                        <p>DOM, события, асинхронность, ES6+</p>
                        <div class="test-meta">
                            <span>8 вопросов</span>
                            <span>⏱ 20 минут</span>
                        </div>
                        <button class="btn btn-primary" onclick="App.showSection('test-js')">
                            Начать тест
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="test-title">⚙️ C++: Указатели и ООП</div>
                        <p>Классы, наследование, шаблоны, STL</p>
                        <div class="test-meta">
                            <span>12 вопросов</span>
                            <span>⏱ 25 минут</span>
                        </div>
                        <button class="btn btn-primary" onclick="App.showSection('test-cpp')">
                            Начать тест
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static renderProfileSection(userData) {
        const roles = userData.roles || ['Student'];
        return `
            <div class="card">
                <h2>👤 Мой профиль</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 32px; margin-top: 24px;">
                    <div>
                        <div class="profile-field">
                            <label>Имя пользователя:</label>
                            <strong>${userData.username}</strong>
                        </div>
                        <div class="profile-field">
                            <label>Email:</label>
                            <span>${userData.email}</span>
                        </div>
                        <div class="profile-field">
                            <label>Роли:</label>
                            <div>
                                ${roles.map(role => 
                                    `<span class="badge ${role.toLowerCase()}">${role}</span>`
                                ).join(' ')}
                            </div>
                        </div>
                        <div class="profile-field">
                            <label>Метод входа:</label>
                            <span>${userData.authMethod}</span>
                        </div>
                        <div class="profile-field">
                            <label>ID пользователя:</label>
                            <code>${userData.id}</code>
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <div style="width: 120px; height: 120px; background: var(--secondary); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                            ${userData.username.charAt(0).toUpperCase()}
                        </div>
                        <button class="btn btn-primary" style="width: 100%;" onclick="alert('Редактирование профиля — в разработке')">
                            🖊 Редактировать
                        </button>
                    </div>
                </div>

                <style>
                    .profile-field { margin-bottom: 16px; }
                    .profile-field label {
                        display: inline-block;
                        width: 180px;
                        font-weight: 600;
                        color: var(--text);
                    }
                    .badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 14px;
                        font-weight: 600;
                        margin-right: 6px;
                    }
                    .badge.student { background: #e0e0e0; color: #555; }
                    .badge.teacher { background: #4caf50; color: white; }
                    .badge.admin { background: #f44336; color: white; }
                </style>
            </div>
        `;
    }

    static renderUsersSection() {
        const users = [
            { name: 'Анна Иванова', roles: ['Student'], email: 'anna@example.com', status: 'active' },
            { name: 'Дмитрий Сидоров', roles: ['Student'], email: 'dmitry@example.com', status: 'pending' },
            { name: 'Елена Петрова', roles: ['Teacher', 'Student'], email: 'elena@example.com', status: 'active' },
            { name: 'Алексей Кузнецов', roles: ['Admin'], email: 'alexey@example.com', status: 'active' }
        ];

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2>👥 Пользователи (${users.length})</h2>
                    <button id="add-user-btn" class="btn btn-primary">➕ Добавить</button>
                </div>

                <div class="users-list">
                    ${users.map(user => `
                        <div class="card" style="padding: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong>${user.name}</strong>
                                    <div style="margin-top: 4px;">
                                        ${user.roles.map(role => 
                                            `<span class="badge ${role.toLowerCase()}">${role}</span>`
                                        ).join('')}
                                    </div>
                                    <div style="color: var(--text-light); font-size: 14px;">${user.email}</div>
                                </div>
                                <div>
                                    <span class="badge ${user.status === 'active' ? 'success' : 'warning'}">
                                        ${user.status === 'active' ? 'Активен' : 'Ожидает'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <style>
                    .users-list { margin-top: 16px; }
                    .badge.success { background: #e8f5e9; color: #2e7d32; }
                    .badge.warning { background: #fff8e1; color: #ef6c00; }
                </style>
            </div>
        `;
    }

    static renderSettingsSection(userData) {
        return `
            <div class="card">
                <h2>⚙️ Настройки системы</h2>
                <p>Управление для администраторов</p>

                <div class="card" style="margin-top: 24px;">
                    <h3>👩‍🏫 Управление ролями</h3>
                    <p>Назначьте роли пользователям для контроля доступа</p>
                    <button class="btn btn-warning" onclick="alert('Функция в разработке')">
                        👥 Управление ролями
                    </button>
                </div>

                <div class="card" style="margin-top: 16px;">
                    <h3>🔒 Безопасность</h3>
                    <button class="btn btn-danger" onclick="App.logout(true)">
                        🚪 Разлогинить все сессии
                    </button>
                </div>

                <div class="card" style="margin-top: 16px;">
                    <h3>📊 Статистика</h3>
                    <p>Общая информация о системе</p>
                    <ul>
                        <li><strong>Пользователей:</strong> 142</li>
                        <li><strong>Активных тестов:</strong> 24</li>
                        <li><strong>Пройденных тестов:</strong> 893</li>
                    </ul>
                </div>
            </div>
        `;
    }

    static renderTasksSection(userData) {
        return `
            <div class="card">
                <h2>Задачи</h2>
                <p>Здесь будут отображаться ваши задания и тесты.</p>
                
                <div style="margin-top: 20px;">
                    <div class="task-item">
                        <h3>Тест по основам Python</h3>
                        <p>Срок сдачи: 15 января 2026</p>
                        <button class="btn btn-primary" onclick="alert('Тест открыт')">
                            Начать тест
                        </button>
                    </div>
                    
                    <div class="task-item" style="margin-top: 16px;">
                        <h3>Домашнее задание №3</h3>
                        <p>Срок сдачи: 20 января 2026</p>
                        <button class="btn btn-secondary" disabled>
                            Ожидает проверки
                        </button>
                    </div>
                </div>

                <style>
                    .task-item {
                        padding: 20px;
                        border: 1px solid var(--border);
                        border-radius: 12px;
                        margin-top: 12px;
                        background: #fafafa;
                    }
                    .task-item h3 {
                        margin: 0 0 8px 0;
                        color: var(--text);
                    }
                    .task-item p {
                        color: var(--text-light);
                        margin: 0 0 16px 0;
                    }
                </style>
            </div>
        `;
    }

    static showEditProfile() {
        const content = document.getElementById('content-area');
        if (!content) return;

        content.innerHTML = `
            <div class="card">
                <h2>Редактирование профиля</h2>
                
                <div style="margin-top: 24px;">
                    <div class="input-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 500;">Имя</label>
                        <input type="text" id="edit-name" class="auth-input" value="Анна">
                    </div>
                    
                    <div class="input-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: 500;">Email</label>
                        <input type="email" id="edit-email" class="auth-input" value="anna@example.com">
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button class="btn btn-primary" onclick="App.saveProfile()">
                            Сохранить
                        </button>
                        <button class="btn btn-secondary" onclick="App.showSection('profile')">
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static saveProfile() {
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;
        alert(`✅ Профиль сохранён!\nИмя: ${name}\nEmail: ${email}`);
        App.showSection('profile');
    }

    static getTests() {
        return {
            python: {
                title: '🐍 Тест по Python',
                description: 'Основы Python: синтаксис, типы данных, функции',
                time: '15 минут',
                questions: [
                    {
                        text: 'Какой тип данных вернёт выражение <code>type(42)</code>?',
                        options: ['int', 'float', 'str', 'bool'],
                        correct: 0
                    },
                    {
                        text: 'Что выведет код: <code>print([1,2,3] * 2)</code>?',
                        options: ['[1,2,3,1,2,3]', '[2,4,6]', 'Ошибка', '[1,2,3,2]'],
                        correct: 0
                    },
                    {
                        text: 'Как правильно объявить функцию?',
                        options: [
                            'def my_func():',
                            'function my_func():',
                            'func my_func():',
                            'define my_func():'
                        ],
                        correct: 0
                    },
                    {
                        text: 'Что такое <code>__init__</code> в классе?',
                        options: [
                            'Конструктор',
                            'Деструктор',
                            'Метод класса',
                            'Статический метод'
                        ],
                        correct: 0
                    },
                    {
                        text: 'Как импортировать модуль <code>math</code>?',
                        options: [
                            'import math',
                            'from math import *',
                            'require math',
                            'include math'
                        ],
                        correct: 0
                    }
                ]
            },
            js: {
                title: '🌐 Тест по JavaScript',
                description: 'Современный JavaScript: ES6+, асинхронность, DOM',
                time: '20 минут',
                questions: [
                    {
                        text: 'Что выведет код: <code>console.log(0.1 + 0.2 == 0.3)</code>?',
                        options: ['true', 'false', 'Ошибка', 'undefined'],
                        correct: 1
                    },
                    {
                        text: 'Как объявить константу в ES6?',
                        options: ['const x = 5;', 'let x = 5;', 'var x = 5;', 'const x := 5;'],
                        correct: 0
                    },
                    {
                        text: 'Что делает <code>async/await</code>?',
                        options: [
                            'Упрощает работу с промисами',
                            'Ускоряет выполнение кода',
                            'Заменяет циклы',
                            'Создаёт новые потоки'
                        ],
                        correct: 0
                    },
                    {
                        text: 'Как выбрать элемент по id в DOM?',
                        options: [
                            'document.getElementById("id")',
                            'document.querySelector("#id")',
                            'Оба варианта верны',
                            'document.find("#id")'
                        ],
                        correct: 2
                    }
                ]
            },
            cpp: {
                title: '💻 Тест по C++',
                description: 'Указатели, классы, шаблоны, STL',
                time: '25 минут',
                questions: [
                    {
                        text: 'Что означает <code>int* p</code>?',
                        options: [
                            'Указатель на int',
                            'Массив int',
                            'Ссылка на int',
                            'Функция, возвращающая int'
                        ],
                        correct: 0
                    },
                    {
                        text: 'Как правильно освободить память, выделенную через <code>new</code>?',
                        options: ['delete p;', 'free(p);', 'delete[] p;', 'release(p);'],
                        correct: 0
                    },
                    {
                        text: 'Что такое наследование?',
                        options: [
                            'Механизм повторного использования кода',
                            'Тип данных',
                            'Ошибка компиляции',
                            'Способ оптимизации'
                        ],
                        correct: 0
                    },
                    {
                        text: 'Какой контейнер STL обеспечивает O(1) доступ по индексу?',
                        options: ['vector', 'list', 'map', 'set'],
                        correct: 0
                    }
                ]
            }
        };
    }

    static renderTest(testId) {
    const tests = this.getTests();
    const test = tests[testId];
    if (!test) return '<div class="card"><h3>Тест не найден</h3></div>';

    return `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <div>
                    <h2>${test.title}</h2>
                    <p>${test.description}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: 600; color: var(--primary);">${test.time}</div>
                    <div>${test.questions.length} вопросов</div>
                </div>
            </div>

            <div id="test-form">
                ${test.questions.map((q, i) => `
                    <div class="question">
                        <div class="question-title">
                            <span>${i + 1}.</span> ${q.text}
                        </div>
                        <div class="options">
                            ${q.options.map((opt, j) => `
                                <label class="option">
                                    <input type="radio" name="q${i}" value="${j}">
                                    <span>${opt}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="text-align: center; margin-top: 32px;">
                <button class="btn btn-primary" id="submit-test-btn">
                    ✅ Завершить тест
                </button>
            </div>
        </div>
    `;
}

    static setupTestHandlers(testId) {
    const form = document.getElementById('test-form');
    const submitBtn = document.getElementById('submit-test-btn');
    
    if (!form || !submitBtn) return;
    
    // Убираем стандартное поведение формы
    form.onsubmit = null;
    
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const tests = this.getTests();
        const test = tests[testId];
        if (!test) return;
        
        let correct = 0;
        const userAnswers = [];
        
        // Собираем ответы пользователя
        test.questions.forEach((q, i) => {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            const userAnswer = selected ? parseInt(selected.value) : null;
            userAnswers.push(userAnswer);
            
            if (userAnswer === q.correct) {
                correct++;
            }
        });
        
        // Проверяем, все ли вопросы отвечены
        const unanswered = userAnswers.filter(a => a === null).length;
        if (unanswered > 0) {
            alert(`Пожалуйста, ответьте на все вопросы!\nОсталось: ${unanswered} вопросов`);
            return;
        }
        
        // Подсвечиваем правильные/неправильные ответы
        test.questions.forEach((q, i) => {
            const options = document.querySelectorAll(`input[name="q${i}"]`);
            options.forEach((opt, j) => {
                const label = opt.closest('label');
                if (label) {
                    label.classList.remove('correct', 'incorrect');
                    
                    if (j === q.correct) {
                        label.classList.add('correct');
                    } else if (userAnswers[i] === j) {
                        label.classList.add('incorrect');
                    }
                }
            });
        });
        
        // Показываем результат
        const score = Math.round((correct / test.questions.length) * 100);
        const content = document.getElementById('content-area');
        
        content.innerHTML = `
            <div class="card results-card">
                <h2>🎉 Тест завершён!</h2>
                <div class="score">${score}%</div>
                <p>Вы ответили правильно на <strong>${correct}</strong> из <strong>${test.questions.length}</strong> вопросов</p>
                
                <div style="margin-top: 32px;">
                    <button class="btn btn-primary" onclick="App.showSection('dashboard')">
                        🏠 На главную
                    </button>
                    <button class="btn btn-secondary" onclick="App.showSection('tests')" style="margin-left: 12px;">
                        📝 Другие тесты
                    </button>
                </div>
            </div>
        `;
    });
}

    static tokens = {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token')
    };

    static setTokens(accessToken, refreshToken) {
        this.tokens.access_token = accessToken;
        this.tokens.refresh_token = refreshToken;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    static clearTokens() {
        this.tokens.access_token = null;
        this.tokens.refresh_token = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    static isAuthenticated() {
        return !!this.tokens.access_token;
    }

    static async apiFetch(url, options = {}) {
        const { access_token, refresh_token } = this.tokens;
        if (access_token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${access_token}`
            };
        }

        let response = await fetch(`http://localhost:8000${url}`, options);

        if (response.status === 401 && refresh_token) {
            try {
                await this.refreshToken();
                options.headers['Authorization'] = `Bearer ${this.tokens.access_token}`;
                response = await fetch(`http://localhost:8000${url}`, options);
            } catch (err) {
                this.clearTokens();
                throw new Error('Сессия истекла');
            }
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

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

    static async getUserInfo() {
        try {
            const data = await this.apiFetch('/me');
            // Для демо добавляем роли, если их нет
            if (!data.roles) {
                data.roles = ['Student'];
                if (data.email?.includes('teacher')) data.roles = ['Teacher', 'Student'];
                if (data.email?.includes('admin')) data.roles = ['Admin'];
            }
            return {
                id: data.id,
                username: data.email?.split('@')[0] || 'Пользователь',
                email: data.email,
                authMethod: data.auth_method,
                roles: data.roles
            };
        } catch (err) {
            console.error('Не удалось получить данные пользователя:', err);
            throw err;
        }
    }

    static async loginByCode(email, code) {
        const response = await fetch('http://localhost:8000/auth/code/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        this.setTokens(data.access_token, data.refresh_token);

        const userInfo = await this.getUserInfo();
        this.showMainInterface(userInfo);
    }

    static async requestCode(email) {
        const response = await fetch('http://localhost:8000/auth/code/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    static logout(logoutAll = false) {
        if (logoutAll && this.tokens.refresh_token) {
            fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: this.tokens.refresh_token })
            }).catch(console.error);
        }

        this.clearTokens();
        this.renderAuthInterface();
    }

    static async checkAuthStatus() {
        if (this.isAuthenticated()) {
            try {
                const userInfo = await this.getUserInfo();
                this.showMainInterface(userInfo);
            } catch (err) {
                this.clearTokens();
            }
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.checkAuthStatus();
});