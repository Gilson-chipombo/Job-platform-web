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

        if (this.currentUser && this.userType) {
            // Usuário logado - Mostrar dropdown
            this.renderAutenticatedNav(navbarNav);
        } else {
            // Não logado - Mostrar login e cadastro
            this.renderUnauthenticatedNav(navbarNav);
        }
    }

    /**
     * Renderizar navbar para usuário autenticado
     */
    renderAutenticatedNav(navbarNav) {
        const dropdownHtml = `
            <li class="nav-item dropdown" data-nav="user-dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle me-1"></i>${this.currentUser.nome || 'Minha Conta'}
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
        const loginItem = `
            <li class="nav-item" data-nav="login">
                <a class="nav-link" href="login.html">Login</a>
            </li>
        `;
        const cadastroItem = `
            <li class="nav-item ms-2" data-nav="cadastro">
                <a class="btn btn-primary btn-sm" href="cadastro-estudante.html">Cadastro</a>
            </li>
        `;

        navbarNav.insertAdjacentHTML('beforeend', loginItem);
        navbarNav.insertAdjacentHTML('beforeend', cadastroItem);
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Este método pode ser expandido com mais eventos conforme necessário
    }

    /**
     * Logout - Simular saída
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        showNotification('Você foi desconectado!', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Inicializar navbar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    new NavbarManager();
});
