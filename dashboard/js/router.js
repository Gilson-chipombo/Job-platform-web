// ============================================
// ROUTER GLOBAL - Páginas públicas, usuário e admin
// ============================================

const API_BASE_URL = 'http://127.0.0.1:3000';
const API_AUTH = {
    loginUser: `${API_BASE_URL}/auth/login`,
    loginAdmin: `${API_BASE_URL}/auth/admin/login`,
    vagasPublicas: `${API_BASE_URL}/vagas`,
    vagasDestaque: `${API_BASE_URL}/vagas/destaques`,
    vagasRecentes: `${API_BASE_URL}/vagas/recentes`,
};

const AppRoutes = {
    public: [
        'index.html', 'vagas.html', 'empresas.html', 'blog.html', 'sobre.html',
        'contato.html', 'login.html', 'cadastro-estudante.html', 'cadastro-empresa.html', 'escolher-conta.html',
        'detalhes-vaga.html'
    ],
    user: [
        'perfil.html', 'minhas-candidaturas.html', 'vagas-salvas.html', 'publicar-vaga.html', 'minhas-vagas-empresa.html'
    ],
    admin: [
        'dashboard/index.html', 'dashboard/pages/dashboard.html', 'dashboard/pages/usuarios.html',
        'dashboard/pages/configuracoes.html', 'dashboard/pages/perfil-admin.html'
    ],
};

function getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName || 'index.html';
}

function severityRedirect(target) {
    if (target) window.location.href = target;
}

function ensureAppRouteAuth() {
    const page = getCurrentPageName();

    if (AppRoutes.admin.some(p => page.endsWith(p))) {
        if (!authManager?.isAdmin()) {
            showNotification('Acesso restrito ao painel administrativo. Faça login.', 'warning');
            setTimeout(() => { window.location.href = '/dashboard/pages/login-admin.html'; }, 1100);
        }
        return;
    }

    if (AppRoutes.user.some(p => p === page)) {
        if (!authManager?.isLoggedIn()) {
            showNotification('Você precisa estar logado para acessar esta página.', 'warning');
            setTimeout(() => { window.location.href = '/login.html'; }, 1100);
        }
        return;
    }

    // páginas públicas não precisam de guard
}

function isCurrentRoute(route) {
    const page = getCurrentPageName();
    return page.toLowerCase() === route.toLowerCase();
}

function homeRoute() {
    window.location.href = '/index.html';
}

function adminRoute() {
    window.location.href = '/dashboard/pages/dashboard.html';
}

function logoutGlobal() {
    authManager.logout();
    localStorage.removeItem('admin');
    localStorage.removeItem('adminRole');
    showNotification('Logout realizado!', 'success');
    setTimeout(homeRoute, 900);
}

function getBaseUrl() {
    return API_BASE_URL;
}

function getRouteList() {
    return AppRoutes;
}

window.AppRouter = {
    getBaseUrl,
    getRouteList,
    ensureAppRouteAuth,
    homeRoute,
    adminRoute,
    logoutGlobal,
    API_AUTH
};

document.addEventListener('DOMContentLoaded', () => {
    if (typeof authManager !== 'undefined') {
        ensureAppRouteAuth();
    }
});
