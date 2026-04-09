// ============================================
// AUTHENTICATION MANAGER - IMPROVED
// ============================================

/**
 * Gerenciar autenticação de usuários com sistema de tokens robusto
 */
class AuthManager {
    constructor() {
        this.storageKey = 'user';
        this.userTypeKey = 'userType';
        this.tokenKey = 'authToken';
        this.tokenExpiryKey = 'tokenExpiry';
        this.currentUser = this.getCurrentUser();
        this.userType = this.getUserType();
    }

    /**
     * Gerar token único para o usuário
     */
    generateToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        return `token_${timestamp}_${random}`;
    }

    /**
     * Realizar login de estudante
     */
    loginStudent(email, senha) {
        const user = {
            id: 'user_' + Date.now(),
            email: email,
            nome: email.split('@')[0],
            tipo: 'estudante',
            loginAt: new Date().toISOString()
        };

        const token = this.generateToken();
        this.saveUser(user, 'estudante', token);
        return { user, token };
    }

    /**
     * Realizar login de empresa
     */
    loginCompany(email, senha) {
        const user = {
            id: 'company_' + Date.now(),
            email: email,
            nome: email.split('@')[0],
            tipo: 'empresa',
            loginAt: new Date().toISOString()
        };

        const token = this.generateToken();
        this.saveUser(user, 'empresa', token);
        return { user, token };
    }

    /**
     * Registrar novo estudante
     */
    registerStudent(data) {
        const user = {
            id: 'user_' + Date.now(),
            email: data.email,
            nome: data.nomeCompleto,
            telefone: data.telefone,
            cpf: data.cpf,
            tipo: 'estudante',
            escola: data.escola,
            serie: data.serie,
            createdAt: new Date().toISOString()
        };

        const token = this.generateToken();
        this.saveUser(user, 'estudante', token);
        return { user, token };
    }

    /**
     * Registrar nova empresa
     */
    registerCompany(data) {
        const user = {
            id: 'company_' + Date.now(),
            email: data.email,
            nome: data.nomeEmpresa,
            telefone: data.telefone,
            cnpj: data.cnpj,
            tipo: 'empresa',
            website: data.website,
            createdAt: new Date().toISOString()
        };

        const token = this.generateToken();
        this.saveUser(user, 'empresa', token);
        return { user, token };
    }

    /**
     * Salvar usuário no localStorage com token
     */
    saveUser(user, userType, token = null) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        localStorage.setItem(this.userTypeKey, userType);
        
        if (token) {
            localStorage.setItem(this.tokenKey, token);
            // Token expira em 24 horas
            const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem(this.tokenExpiryKey, expiry.toString());
        }
        
        this.currentUser = user;
        this.userType = userType;
    }

    /**
     * Obter usuário atual
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.storageKey);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Obter tipo de usuário
     */
    getUserType() {
        return localStorage.getItem(this.userTypeKey);
    }

    /**
     * Obter token atual
     */
    getToken() {
        if (!this.isTokenValid()) {
            return null;
        }
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Verificar se token é válido (não expirado)
     */
    isTokenValid() {
        const token = localStorage.getItem(this.tokenKey);
        const expiry = localStorage.getItem(this.tokenExpiryKey);
        
        if (!token || !expiry) return false;
        
        return new Date().getTime() < parseInt(expiry);
    }

    /**
     * Verificar se está logado
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null && this.isTokenValid();
    }

    /**
     * Logout - Limpar todos os dados de autenticação
     */
    logout() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.userTypeKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenExpiryKey);
        localStorage.removeItem("tokenStudent");
        localStorage.removeItem("idStudent");
        this.currentUser = null;
        this.userType = null;
    }

    /**
     * Atualizar informações do usuário
     */
    updateUser(data) {
        if (this.currentUser) {
            const updatedUser = { ...this.currentUser, ...data };
            this.saveUser(updatedUser, this.userType, this.getToken());
            return updatedUser;
        }
        return null;
    }

    /**
     * Verificar autenticação e retornar dados seguros
     */
    getAuthData() {
        if (!this.isLoggedIn()) {
            return null;
        }
        return {
            user: this.currentUser,
            userType: this.userType,
            token: this.getToken()
        };
    }
}

// Criar instância global de autenticação
const authManager = new AuthManager();

/**
 * Limpar dados antigos/expirados do localStorage
 * Remove user órfão (sem token válido) para evitar navbar falsamente logado
 */
function cleanupOldAuthData() {
    try {
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        const authToken = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        const userType = localStorage.getItem('userType');

        // Se há tokenExpiry, verificar se expirou
        if (tokenExpiry && new Date().getTime() >= parseInt(tokenExpiry)) {
            console.log('[v0] Token expirado - limpando dados');
            authManager.logout();
            return;
        }

        // Se há user/userType MAS SEM token válido, remover user
        // Isto evita mostrar dropdown para dados órfãos do localStorage
        if (user && userType && !authToken) {
            console.log('[v0] Dados órfãos encontrados - limpando');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
        }
    } catch (error) {
        console.error('[v0] Erro ao limpar dados de autenticação:', error);
    }
}

/**
 * Exibir notificação com fallback caso showNotification não exista
 */
function safeShowNotification(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type);
        return;
    }
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Verificar se página requer autenticação e redirecionar se necessário
 * Use data-require-auth="true" no <body> para proteger a página
 */
function checkProtectedPageAccess() {
    const body = document.querySelector('body[data-require-auth]');
    if (body && !authManager.isLoggedIn()) {
        safeShowNotification('Você precisa estar logado para acessar esta página!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

/**
 * Esconder elementos que não devem aparecer para usuários já autenticados
 * Use data-hide-when-authenticated nos elementos que devem ficar ocultos.
 */
function hideAuthenticatedOnlyElements() {
    if (!authManager.isLoggedIn()) {
        return;
    }

    document.querySelectorAll('[data-hide-when-authenticated]').forEach((element) => {
        element.style.display = 'none';
    });
}

/**
 * Redirecionar usuários autenticados que tentarem abrir páginas de cadastro/login
 * Use data-guest-only-page="true" no <body> das páginas que devem ser inacessíveis.
 */
function redirectAuthenticatedUsersFromGuestPages() {
    const body = document.querySelector('body[data-guest-only-page]');
    if (body && authManager.isLoggedIn()) {
        safeShowNotification('Você já está logado. Redirecionando...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Executar limpeza e verificações quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    cleanupOldAuthData();
    checkProtectedPageAccess();
    hideAuthenticatedOnlyElements();
    redirectAuthenticatedUsersFromGuestPages();
});
