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
     * Verificar acesso administrativo
     */
    checkAdminAccess() {
        const admin = localStorage.getItem('admin');
        const adminRole = localStorage.getItem('adminRole');

        if (!admin || adminRole !== 'admin') {
            // Modo permissivo: criar um admin de exemplo para permitir acesso em ambiente local/demo
            const adminData = {
                username: 'admin',
                email: 'admin@careeirahub.com',
                name: 'Administrador Demo',
                role: 'admin',
                loginAt: new Date().toISOString(),
                demo: true
            };

            localStorage.setItem('admin', JSON.stringify(adminData));
            localStorage.setItem('adminRole', 'admin');
            localStorage.setItem('adminToken', 'token_demo_' + Date.now());

            this.adminUser = adminData;
            // Não redirecionamos — o painel ficará acessível imediatamente
        } else {
            this.adminUser = JSON.parse(admin);
        }
    }

    /**
     * Login do administrador
     */
    loginAdmin(username, password) {
        // Modo permissivo/demo: aceitar qualquer credencial e criar/admin de exemplo
        const uname = username || 'admin';
        const adminData = {
            username: uname,
            email: `${uname}@careeirahub.com`,
            name: 'Administrador',
            role: 'admin',
            loginAt: new Date().toISOString(),
            demo: true
        };

        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('adminRole', 'admin');
        localStorage.setItem('adminToken', 'token_' + Date.now());

        this.adminUser = adminData;
        return true;
    }

    /**
     * Logout do administrador
     */
    logoutAdmin() {
        localStorage.removeItem('admin');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminToken');
        this.adminUser = null;
        window.location.href = 'pages/login-admin.html';
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated() {
        return !!localStorage.getItem('adminRole');
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

// Instância global
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
