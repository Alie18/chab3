class AuthIntegration {
    constructor(config = {}) {
        this.config = {
            apiBaseUrl: 'http://localhost:8000',
            ...config
        };
    }

    static initForWebClient() {
        return this;
    }
}

// Глобальный объект для совместимости
window.AuthIntegration = AuthIntegration;
window.authSystem = AuthIntegration.initForWebClient();
