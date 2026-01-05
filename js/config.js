// Конфигурация для подключения к Python бэкенду
const AuthConfig = {
    // Адрес её Python сервера (локально)
    API_BASE_URL: 'http://localhost:8000',
    
    // OAuth ключи из её .env файла
    GITHUB_CLIENT_ID: 'Ov23liO5hl4Y1NxtvxMN',
    YANDEX_CLIENT_ID: '3831a7f092e8433784378aabe92d27ce',
    
    // Маршруты API (должны совпадать с её routes.py)
    ENDPOINTS: {
        REQUEST_CODE: '/auth/code/request',
        VERIFY_CODE: '/auth/code/verify',
        GITHUB_AUTH: '/auth/github',
        YANDEX_AUTH: '/auth/yandex',
        GET_USER: '/me',
        LOGOUT: '/auth/logout'  // если есть
    }
};