// ============================================
// NAVBAR COMPONENT - REUTILIZÁVEL
// ============================================

/**
 * Gerenciar Navbar dinâmica com autenticação
 */
class NavbarManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.userType = this.getUserType();
        this.isAuthenticated = this.checkAuthentication();
        this.init();
    }

    init() {
        this.renderNavbar();
        this.setupEventListeners();
    }

    /**
     * Obter usuário atual do localStorage
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Obter tipo de usuário do localStorage
     */
    getUserType() {
        return localStorage.getItem('userType');
    }

    /**
     * Verificar autenticação usando token válido ou authManager
     */
    checkAuthentication() {
        // Verificar primeiro com authManager (sistema novo com tokens válidos)
        if (typeof authManager !== 'undefined') {
            return authManager.isLoggedIn();
        }
        
        // Fallback apenas se authManager não estiver disponível
        const tokenStudent = localStorage.getItem('tokenStudent');
        const user = this.getCurrentUser();
        const authToken = localStorage.getItem('authToken');
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        
        // Se há authToken, validar expiração
        if (authToken && tokenExpiry) {
            return new Date().getTime() < parseInt(tokenExpiry);
        }
        
        // Apenas se houver tanto token quanto usuário
        return !!(tokenStudent && user);
    }

    /**
     * Renderizar navbar baseado no estado de autenticação
     */
    renderNavbar() {
        const navbar = document.querySelector('nav.navbar');
        if (!navbar) return;

        const navbarCollapse = navbar.querySelector('.collapse.navbar-collapse');
        if (!navbarCollapse) return;

        const navbarNav = navbarCollapse.querySelector('.navbar-nav');
        if (!navbarNav) return;

        // Remover itens antigos de login/cadastro
        const oldLoginItem = navbarNav.querySelector('[data-nav="login"]');
        const oldCadastroItem = navbarNav.querySelector('[data-nav="cadastro"]');
        const oldDropdownContainer = navbarNav.querySelector('[data-nav="user-dropdown"]');

        if (oldLoginItem) oldLoginItem.remove();
        if (oldCadastroItem) oldCadastroItem.remove();
        if (oldDropdownContainer) oldDropdownContainer.remove();

        if (this.isAuthenticated) {
            // Usuário logado - Mostrar dropdown
            this.renderAutenticatedNav(navbarNav);
        } else {
            // Não logado - Mostrar login
            this.renderUnauthenticatedNav(navbarNav);
        }
    }

    /**
     * Obter nome do usuário
     */
    getUserName() {
        if (this.currentUser && this.currentUser.nome) {
            return this.currentUser.nome;
        }
        const tokenStudent = localStorage.getItem('tokenStudent');
        return tokenStudent ? 'Minha Conta' : 'Usuário';
    }

    /**
     * Renderizar navbar para usuário autenticado
     */
    renderAutenticatedNav(navbarNav) {
        const userName = this.getUserName();
        const dropdownHtml = `
            <li class="nav-item dropdown" data-nav="user-dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle me-1"></i>${userName}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="perfil.html">
                        <i class="bi bi-person me-2"></i>Perfil
                    </a></li>
                    <li><a class="dropdown-item" href="vagas-salvas.html">
                        <i class="bi bi-heart me-2"></i>Vagas Salvas
                    </a></li>
                    <li><a class="dropdown-item" href="minhas-candidaturas.html">
                        <i class="bi bi-file-earmark-text me-2"></i>Minhas Candidaturas
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">
                        <i class="bi bi-box-arrow-right me-2"></i>Sair
                    </a></li>
                </ul>
            </li>
        `;

        navbarNav.insertAdjacentHTML('beforeend', dropdownHtml);

        // Adicionar evento logout
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    /**
     * Renderizar navbar para usuário não autenticado
     */
    renderUnauthenticatedNav(navbarNav) {
        const loginHtml = `
            <li class="nav-item" data-nav="login">
                <a class="nav-link" href="login.html">
                    <i class="bi bi-box-arrow-in-right me-1"></i>Entrar
                </a>
            </li>
        `;
        navbarNav.insertAdjacentHTML('beforeend', loginHtml);
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Este método pode ser expandido com mais eventos conforme necessário
    }

    /**
     * Logout - Limpar autenticação
     */
    logout() {
        if (typeof authManager !== 'undefined') {
            authManager.logout();
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            localStorage.removeItem('tokenStudent');
            localStorage.removeItem('idStudent');
        }
        showNotification('Você foi desconectado!', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Inicializar navbar quando DOM estiver pronto
// Aguarda um pequeno delay para garantir que auth.js fez a limpeza
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno delay para garantir que cleanupOldAuthData() já executou
    setTimeout(() => {
        new NavbarManager();
    }, 50);
});
