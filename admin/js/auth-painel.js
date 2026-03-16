// ============================================
// AUTENTICAÇÃO DO PAINEL ADMINISTRATIVO
// ============================================

class AdminAuthManager {
    constructor() {
        this.adminUser = null;
        this.init();
    }

    init() {
        this.checkAdminAccess();
    }

    /**
     * Verificar acesso administrativo e carregar dados do storage
     */
    checkAdminAccess() {
        const admin = localStorage.getItem('admin');
        const adminRole = localStorage.getItem('adminRole');

        if (admin && adminRole === 'admin') {
            try {
                this.adminUser = JSON.parse(admin);
            } catch (err) {
                console.warn('Falha ao ler dados de admin do localStorage', err);
                this.clearAuth();
            }
        } else {
            this.adminUser = null;
        }
    }

    /**
     * Garantir que o usuário esteja autenticado; caso contrário, redireciona para login
     */
    ensureAuthenticated() {
        if (!this.isAuthenticated()) {
            window.location.href = this.getLoginUrl();
        }
    }

    /**
     * URL relativa para a página de login, dependendo da pasta atual
     */
    getLoginUrl() {
        const path = window.location.pathname;
        return path.includes('/pages/') ? 'login-admin.html' : 'pages/login-admin.html';
    }

    /**
     * Definir dados de autenticação (armazenar no localStorage)
     */
    setAuth({ username, email, name, role = 'admin', token }) {
        const adminData = {
            username: username || 'admin',
            email: email || 'admin@careeirahub.com',
            name: name || 'Administrador',
            role,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('adminRole', role);
        if (token) {
            localStorage.setItem('adminToken', token);
        }

        this.adminUser = adminData;
    }

    /**
     * Remover dados de autenticação
     */
    clearAuth() {
        localStorage.removeItem('admin');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminToken');
        this.adminUser = null;
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated() {
        return !!localStorage.getItem('adminRole');
    }

    /**
     * Logout do administrador
     */
    logoutAdmin() {
        this.clearAuth();
        window.location.href = this.getLoginUrl();
    }

    /**
     * Obter dados do admin
     */
    getAdminUser() {
        return this.adminUser;
    }

    /**
     * Obter nome do admin
     */
    getAdminName() {
        return this.adminUser?.name || 'Admin';
    }
}

// Instância global (usada como "adminAuth")
const adminAuth = new AdminAuthManager();

// Renderizar navbar apenas se autenticado
document.addEventListener('DOMContentLoaded', function() {
    if (adminAuth.isAuthenticated()) {
        renderAdminNavbar();
    }
});

/**
 * Renderizar navbar do painel admin
 */
function renderAdminNavbar() {
    const navbar = document.querySelector('nav.navbar');
    if (!navbar) return;

    const navbarCollapse = navbar.querySelector('.collapse.navbar-collapse');
    if (!navbarCollapse) return;

    const navbarNav = navbarCollapse.querySelector('.navbar-nav');
    if (!navbarNav) return;

    // Remover item antigo de logout
    const oldLogoutItem = navbarNav.querySelector('[data-nav="logout"]');
    if (oldLogoutItem) oldLogoutItem.remove();

    // Adicionar dropdown com info do admin
    const adminName = adminAuth.getAdminName();
    const dropdownHtml = `
        <li class="nav-item dropdown" data-nav="logout">
            <a class="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-shield-lock me-1"></i>${adminName}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
                <li><a class="dropdown-item" href="pages/perfil-admin.html">
                    <i class="bi bi-person me-2"></i>Meu Perfil
                </a></li>
                <li><a class="dropdown-item" href="pages/configuracoes.html">
                    <i class="bi bi-gear me-2"></i>Configurações
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" onclick="logoutAdmin()">
                    <i class="bi bi-box-arrow-right me-2"></i>Sair
                </a></li>
            </ul>
        </li>
    `;

    navbarNav.insertAdjacentHTML('beforeend', dropdownHtml);
}

/**
 * Função de logout
 */
function logoutAdmin() {
    if (confirm('Tem certeza que deseja sair do painel?')) {
        adminAuth.logoutAdmin();
    }
}

/**
 * Mostrar notificação
 */
function showNotification(message, type = 'info') {
    alert(`${type.toUpperCase()}: ${message}`);
}
