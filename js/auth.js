// ============================================
// AUTHENTICATION MANAGER
// ============================================

/**
 * Gerenciar autenticação de usuários
 */
class AuthManager {
    constructor() {
        this.storageKey = 'user';
        this.userTypeKey = 'userType';
        this.currentUser = this.getCurrentUser();
        this.userType = this.getUserType();
    }

    /**
     * Realizar login de estudante
     */
    loginStudent(email, senha) {
        // Em produção, isto seria uma chamada para o backend
        const user = {
            id: 'user_' + Date.now(),
            email: email,
            nome: email.split('@')[0],
            tipo: 'estudante',
            loginAt: new Date().toISOString()
        };

        this.saveUser(user, 'estudante');
        return user;
    }

    /**
     * Realizar login de empresa
     */
    loginCompany(email, senha) {
        // Em produção, isto seria uma chamada para o backend
        const user = {
            id: 'company_' + Date.now(),
            email: email,
            nome: email.split('@')[0],
            tipo: 'empresa',
            loginAt: new Date().toISOString()
        };

        this.saveUser(user, 'empresa');
        return user;
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

        this.saveUser(user, 'estudante');
        return user;
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

        this.saveUser(user, 'empresa');
        return user;
    }

    /**
     * Salvar usuário no localStorage
     */
    saveUser(user, userType) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        localStorage.setItem(this.userTypeKey, userType);
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
     * Verificar se está logado
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Logout - Limpar todos os dados de autenticação
     */
    logout() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.userTypeKey);
        localStorage.removeItem("tokenStudent");
        localStorage.removeItem("idStudent");
        this.currentUser = null;
        this.userType = null;
    }

    /**
     * Verificar se usuário está autenticado (via tokenStudent ou user)
     */
    isTokenValid() {
        const tokenStudent = localStorage.getItem('tokenStudent');
        return tokenStudent || this.isLoggedIn();
    }

    /**
     * Atualizar informações do usuário
     */
    updateUser(data) {
        if (this.currentUser) {
            const updatedUser = { ...this.currentUser, ...data };
            this.saveUser(updatedUser, this.userType);
            return updatedUser;
        }
        return null;
    }
}

// Criar instância global de autenticação
const authManager = new AuthManager();

/**
 * Verificar se página requer autenticação e redirecionar se necessário
 * Use data-require-auth="true" no <body> para proteger a página
 */
function checkProtectedPageAccess() {
    const body = document.querySelector('body[data-require-auth]');
    if (body && !authManager.isLoggedIn()) {
        showNotification('Você precisa estar logado para acessar esta página!', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Chamar verificação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', checkProtectedPageAccess);
