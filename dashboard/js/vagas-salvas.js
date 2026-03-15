// ============================================
// PAGE - VAGAS SALVAS (FAVORITAS)
// ============================================

/**
 * Gerenciar página de vagas salvas
 */
class FavoritesPage {
    constructor() {
        this.authManager = new AuthManager();
        this.favoritesManager = new FavoritesManager();
        this.init();
    }

    init() {
        // Verificar se usuário está logado
        if (!this.authManager.isLoggedIn()) {
            this.redirectToLogin();
            return;
        }

        this.renderFavorites();
        this.setupSearchListener();
    }

    /**
     * Redirecionar para login se não estiver logado
     */
    redirectToLogin() {
        const container = document.getElementById('favoritesContainer');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-warning text-center py-5">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Você precisa estar logado</h5>
                    <p class="text-muted mb-3">Faça login ou crie uma conta para ver suas vagas salvas</p>
                    <a href="login.html" class="btn btn-primary me-2">
                        <i class="bi bi-sign-in-alt me-2"></i>Fazer Login
                    </a>
                    <a href="cadastro-estudante.html" class="btn btn-outline-primary">
                        <i class="bi bi-user-plus me-2"></i>Criar Conta
                    </a>
                </div>
            `;
        }
    }

    /**
     * Renderizar vagas salvas
     */
    renderFavorites() {
        const container = document.getElementById('favoritesContainer');
        if (!container) return;

        const favorites = this.favoritesManager.getFavorites();

        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center py-5">
                    <i class="bi bi-heart" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Nenhuma vaga salva ainda</h5>
                    <p class="text-muted mb-3">Clique no ícone de coração em uma vaga para salvá-la aqui</p>
                    <a href="vagas.html" class="btn btn-primary">
                        <i class="bi bi-search me-2"></i>Explorar Vagas
                    </a>
                </div>
            `;
            return;
        }

        let html = '<div class="row g-4">';

        favorites.forEach(vaga => {
            const tipo = vaga.tipo === 'estagio' ? 'Estágio' : 
                        vaga.tipo === 'emprego' ? 'Emprego' : 'Freelance';
            
            const localizacao = getLocalizacaoName(vaga.localizacao);

            let salario;
            if (vaga.isPaid === false) {
                salario = '<p class="text-success fw-bold mb-0"><i class="bi bi-award me-2"></i>Oportunidade de Experiência</p>';
            } else {
                const currency = vaga.currency || 'KZS';
                const formattedMin = formatCurrency(vaga.salario_min, currency);
                const formattedMax = formatCurrency(vaga.salario_max, currency);
                salario = `<p class="text-primary fw-bold mb-0">${formattedMin} - ${formattedMax}/mês</p>`;
            }

            const badge = vaga.isPaid === false ? 'warning' : 
                         (vaga.tipo === 'estagio' ? 'success' : 
                         (vaga.tipo === 'emprego' ? 'primary' : 'info'));
            
            const badgeText = vaga.isPaid === false ? 'Sem Remuneração' : 'Ativo';
            const savedDate = new Date(vaga.savedAt).toLocaleDateString('pt-BR');

            html += `
                <div class="col-lg-6">
                    <div class="card job-card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="company-avatar bg-info text-white rounded-circle p-3">
                                    <i class="bi bi-briefcase"></i>
                                </div>
                                <div>
                                    <span class="badge bg-${badge}">${badgeText}</span>
                                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="replaceFavoritesPageInstance().removeFavorite(${vaga.id})">
                                        <i class="bi bi-heart-fill"></i>
                                    </button>
                                </div>
                            </div>
                            <h5 class="card-title">${vaga.titulo || 'Vaga sem título'}</h5>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-building me-2"></i>${vaga.empresa || 'Empresa'}
                            </p>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-geo-alt me-2"></i>${localizacao}
                            </p>
                            <div class="d-flex gap-2 mb-3">
                                <span class="badge bg-light text-dark">${tipo}</span>
                                <small class="text-muted">Salvo em ${savedDate}</small>
                            </div>
                            ${salario}
                            <div class="mt-3">
                                <a href="detalhes-vaga.html?id=${vaga.id}" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-arrow-right me-2"></i>Ver Detalhes
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Remover vaga dos favoritos
     */
    removeFavorite(jobId) {
        this.favoritesManager.removeFavorite(jobId);
        showNotification('Vaga removida dos favoritos!', 'info');
        this.renderFavorites();
    }

    /**
     * Configurar listener de busca
     */
    setupSearchListener() {
        const searchInput = document.getElementById('searchFavorites');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const favorites = this.favoritesManager.getFavorites();
            
            const filtered = favorites.filter(vaga => 
                vaga.titulo.toLowerCase().includes(searchTerm) ||
                vaga.empresa.toLowerCase().includes(searchTerm)
            );

            this.renderFilteredFavorites(filtered);
        });
    }

    /**
     * Renderizar vagas filtradas
     */
    renderFilteredFavorites(filtered) {
        const container = document.getElementById('favoritesContainer');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center py-5">
                    <i class="bi bi-search" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Nenhuma vaga encontrada</h5>
                    <p class="text-muted">Tente buscar por outro termo</p>
                </div>
            `;
            return;
        }

        let html = '<div class="row g-4">';

        filtered.forEach(vaga => {
            const tipo = vaga.tipo === 'estagio' ? 'Estágio' : 'Emprego';
            const localizacao = getLocalizacaoName(vaga.localizacao);
            const savedDate = new Date(vaga.savedAt).toLocaleDateString('pt-BR');

            let salario;
            if (vaga.isPaid === false) {
                salario = '<p class="text-success fw-bold mb-0"><i class="bi bi-award me-2"></i>Oportunidade de Experiência</p>';
            } else {
                const currency = vaga.currency || 'KZS';
                const formattedMin = formatCurrency(vaga.salario_min, currency);
                const formattedMax = formatCurrency(vaga.salario_max, currency);
                salario = `<p class="text-primary fw-bold mb-0">${formattedMin} - ${formattedMax}/mês</p>`;
            }

            html += `
                <div class="col-lg-6">
                    <div class="card job-card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${vaga.titulo}</h5>
                            <p class="text-muted small mb-2">${vaga.empresa}</p>
                            <p class="text-muted small mb-3"><i class="bi bi-geo-alt me-2"></i>${localizacao}</p>
                            ${salario}
                            <div class="mt-3">
                                <a href="detalhes-vaga.html?id=${vaga.id}" class="btn btn-sm btn-outline-primary">Ver Detalhes</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }
}

// Variável global para acesso à instância
let favoritesPageInstance = null;

function replaceFavoritesPageInstance() {
    return favoritesPageInstance;
}

// Inicializar página quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    favoritesPageInstance = new FavoritesPage();
});
