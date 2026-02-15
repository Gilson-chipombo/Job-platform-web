// ============================================
// CANDIDATURAS - APLICAÇÕES DE VAGAS
// ============================================

/**
 * Gerenciar página de minhas candidaturas
 */
class ApplicationsManager {
    constructor() {
        this.authManager = new AuthManager();
        this.applications = [];
        this.filteredApplications = [];
        this.statusFilter = ['análise', 'aceito', 'rejeitado'];
        this.searchTerm = '';
        this.init();
    }

    init() {
        // Verificar se usuário está logado
        if (!this.authManager.isLoggedIn()) {
            this.redirectToLogin();
            return;
        }

        this.loadApplications();
        this.renderApplications();
        this.setupEventListeners();
    }

    /**
     * Redirecionar para login se não estiver logado
     */
    redirectToLogin() {
        const container = document.getElementById('applicationsContainer');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-warning text-center py-5">
                    <i class="bi bi-exclamation-triangle" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Você precisa estar logado</h5>
                    <p class="text-muted mb-3">Faça login ou crie uma conta para ver suas candidaturas</p>
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
     * Carregar candidaturas do localStorage
     */
    loadApplications() {
        const data = localStorage.getItem('applications');
        this.applications = data ? JSON.parse(data) : [];
    }

    /**
     * Renderizar candidaturas
     */
    renderApplications() {
        const container = document.getElementById('applicationsContainer');
        if (!container) return;

        this.filteredApplications = this.applications.filter(app => {
            const matchesStatus = this.statusFilter.includes(app.status);
            const matchesSearch = !this.searchTerm || 
                                 app.vagaTitulo.toLowerCase().includes(this.searchTerm) ||
                                 app.empresa.toLowerCase().includes(this.searchTerm);
            return matchesStatus && matchesSearch;
        });

        if (this.filteredApplications.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center py-5">
                    <i class="bi bi-inbox" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Nenhuma candidatura encontrada</h5>
                    <p class="text-muted mb-3">Você ainda não se candidatou a nenhuma vaga</p>
                    <a href="vagas.html" class="btn btn-primary">
                        <i class="bi bi-search me-2"></i>Explorar Vagas
                    </a>
                </div>
            `;
            return;
        }

        let html = '<div class="row g-4">';

        this.filteredApplications.forEach(app => {
            const statusBadgeClass = this.getStatusBadgeClass(app.status);
            const statusText = this.getStatusText(app.status);
            const appDate = new Date(app.data).toLocaleDateString('pt-BR');

            let statusColor = 'info';
            if (app.status === 'aceito') statusColor = 'success';
            if (app.status === 'rejeitado') statusColor = 'danger';

            html += `
                <div class="col-lg-6">
                    <div class="card h-100 shadow-sm border-left-primary" style="border-left: 4px solid var(--primary-color);">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h5 class="card-title mb-1">${app.vagaTitulo}</h5>
                                    <p class="text-muted small mb-0">
                                        <i class="bi bi-building me-2"></i>${app.empresa}
                                    </p>
                                </div>
                                <span class="badge bg-${statusColor}">${statusText}</span>
                            </div>

                            <p class="text-muted small mb-3">
                                <i class="bi bi-calendar me-2"></i>Candidatado em ${appDate}
                            </p>

                            <div class="card-text mb-3">
                                <p class="small mb-0"><strong>Sua mensagem:</strong></p>
                                <p class="text-muted small mt-1">"${this.truncateMessage(app.mensagem, 100)}"</p>
                            </div>

                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary" onclick="applicationsManagerInstance().viewApplication(${app.id})">
                                    <i class="bi bi-eye me-1"></i>Ver Detalhes
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="applicationsManagerInstance().withdrawApplication(${app.id})">
                                    <i class="bi bi-x me-1"></i>Cancelar
                                </button>
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
     * Obter classe de badge de status
     */
    getStatusBadgeClass(status) {
        switch(status) {
            case 'aceito':
                return 'success';
            case 'rejeitado':
                return 'danger';
            default:
                return 'info';
        }
    }

    /**
     * Obter texto de status
     */
    getStatusText(status) {
        switch(status) {
            case 'análise':
                return 'Em Análise';
            case 'aceito':
                return 'Aceito ✓';
            case 'rejeitado':
                return 'Rejeitado ✗';
            default:
                return status;
        }
    }

    /**
     * Truncar mensagem
     */
    truncateMessage(msg, length) {
        if (msg.length > length) {
            return msg.substring(0, length) + '...';
        }
        return msg;
    }

    /**
     * Ver detalhes da candidatura
     */
    viewApplication(appId) {
        const app = this.applications.find(a => a.id === appId);
        if (!app) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'detailsModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${app.vagaTitulo}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Empresa:</strong> ${app.empresa}</p>
                        <p><strong>Data:</strong> ${new Date(app.data).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Status:</strong> <span class="badge bg-${this.getStatusBadgeClass(app.status)}">${this.getStatusText(app.status)}</span></p>
                        <hr>
                        <p><strong>Sua Mensagem:</strong></p>
                        <p class="text-muted">${app.mensagem}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const detailsModal = new bootstrap.Modal(modal);
        detailsModal.show();
        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }

    /**
     * Cancelar candidatura
     */
    withdrawApplication(appId) {
        if (confirm('Tem certeza que deseja cancelar esta candidatura?')) {
            this.applications = this.applications.filter(a => a.id !== appId);
            localStorage.setItem('applications', JSON.stringify(this.applications));
            showNotification('Candidatura cancelada com sucesso!', 'info');
            this.renderApplications();
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Filtro de status
        const statusCheckboxes = document.querySelectorAll('.filter-status');
        statusCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateStatusFilter());
        });

        // Busca
        const searchInput = document.getElementById('searchApplications');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderApplications();
            });
        }

        // Limpar filtros
        const clearBtn = document.getElementById('clearFiltersApp');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }

    /**
     * Atualizar filtro de status
     */
    updateStatusFilter() {
        const checkboxes = document.querySelectorAll('.filter-status:checked');
        this.statusFilter = Array.from(checkboxes).map(cb => cb.value);
        this.renderApplications();
    }

    /**
     * Limpar todos os filtros
     */
    clearFilters() {
        this.statusFilter = ['análise', 'aceito', 'rejeitado'];
        this.searchTerm = '';
        
        document.querySelectorAll('.filter-status').forEach(cb => cb.checked = true);
        document.getElementById('searchApplications').value = '';
        
        this.renderApplications();
    }
}

// Variável global para acesso à instância
let applicationsManagerInstance_var = null;

function applicationsManagerInstance() {
    return applicationsManagerInstance_var;
}

// Inicializar página quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    applicationsManagerInstance_var = new ApplicationsManager();
});
