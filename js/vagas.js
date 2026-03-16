// ============================================
// VAGAS (JOB LISTINGS) - LISTING AND FILTERING
// AGORA CARREGANDO DA API
// ============================================

class VagasManager {
    constructor() {
        this.vagas = [];
        this.vagasFiltradas = [];
        this.filtrosTipo = [];
        this.filtrosRemuneracao = [];
        this.filtrosLocalizacao = '';
        this.searchTerm = '';
        
        // Paginação
        this.itemsPerPage = 50;
        this.currentPage = 1;
        this.totalPages = 1;
        
        this.init();
    }

    async init() {
        await this.loadVagasFromAPI();
        this.setupEventListeners();
        this.renderVagas(this.vagas);
    }

    async loadVagasFromAPI() {
        try {
            const response = await fetch("http://127.0.0.1:3000/vagas");

            if (!response.ok) {
                throw new Error("Erro ao buscar vagas");
            }

            const data = await response.json();

            this.vagas = data.map(vaga => ({
                id: vaga.id,
                titulo: vaga.title,
                tipo: vaga.type,
                localizacao: vaga.Location,
                empresa: vaga.company?.name || "Empresa",
                salario_min: vaga.minSalary,
                salario_max: vaga.maxSalary,
                currency: "AOA",
                isPaid: vaga.minSalary > 0,
                skills: vaga.skills ? vaga.skills.split(",") : []
            }));

        } catch (error) {
            console.error("Erro ao carregar vagas:", error);
            const vagasList = document.getElementById('vagasList');
            if (vagasList) {
                vagasList.innerHTML = `
                    <div class="alert alert-danger text-center py-5">
                        <h5>Erro ao carregar vagas da API</h5>
                    </div>
                `;
            }
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        const filterLocation = document.getElementById('filterLocation');
        if (filterLocation) {
            filterLocation.addEventListener('change', () => this.applyFilters());
        }

        const searchVagas = document.getElementById('searchVagas');
        if (searchVagas) {
            searchVagas.addEventListener('input', debounce(() => this.applyFilters(), 300));
        }

        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }
    }

    applyFilters() {
        this.filtrosTipo = [];
        this.filtrosRemuneracao = [];

        document.querySelectorAll('.filter-checkbox:checked').forEach(checkbox => {
            const value = checkbox.value;
            if (value === 'unpaid' || value === 'paid') {
                this.filtrosRemuneracao.push(value);
            } else {
                this.filtrosTipo.push(value);
            }
        });

        const filterLocation = document.getElementById('filterLocation');
        this.filtrosLocalizacao = filterLocation ? filterLocation.value : '';

        const searchVagas = document.getElementById('searchVagas');
        this.searchTerm = searchVagas ? searchVagas.value.toLowerCase() : '';

        let vagasFiltradas = this.vagas.filter(vaga => {
            let passType = this.filtrosTipo.length === 0 || this.filtrosTipo.includes(vaga.tipo);
            let passLocation = !this.filtrosLocalizacao || vaga.localizacao === this.filtrosLocalizacao;
            let passSearch = !this.searchTerm ||
                vaga.titulo.toLowerCase().includes(this.searchTerm) ||
                vaga.empresa.toLowerCase().includes(this.searchTerm);

            let passRemuneracao = true;
            if (this.filtrosRemuneracao.length > 0) {
                const vagaIsPaid = vaga.isPaid;
                passRemuneracao =
                    (this.filtrosRemuneracao.includes('unpaid') && !vagaIsPaid) ||
                    (this.filtrosRemuneracao.includes('paid') && vagaIsPaid);
            }

            return passType && passLocation && passSearch && passRemuneracao;
        });

        this.renderVagas(vagasFiltradas);
    }

    clearAllFilters() {
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        const filterLocation = document.getElementById('filterLocation');
        if (filterLocation) filterLocation.value = '';

        const searchVagas = document.getElementById('searchVagas');
        if (searchVagas) searchVagas.value = '';

        this.filtrosTipo = [];
        this.filtrosRemuneracao = [];
        this.filtrosLocalizacao = '';
        this.searchTerm = '';

        this.renderVagas(this.vagas);
    }

    /**
     * Calcular páginas e renderizar vagas da página atual
     */
    renderVagas(vagas) {
        const vagasList = document.getElementById('vagasList');
        if (!vagasList) return;

        // Armazenar vagas filtradas
        this.vagasFiltradas = vagas;
        this.currentPage = 1;
        this.totalPages = Math.ceil(vagas.length / this.itemsPerPage);

        if (vagas.length === 0) {
            vagasList.innerHTML = `
                <div class="alert alert-info text-center py-5">
                    <i class="bi bi-search" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Nenhuma vaga encontrada</h5>
                </div>
            `;
            this.renderPaginationControls();
            return;
        }

        this.renderCurrentPage();
    }

    /**
     * Renderizar página atual de vagas
     */
    renderCurrentPage() {
        const vagasList = document.getElementById('vagasList');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const vagasPage = this.vagasFiltradas.slice(startIndex, endIndex);

        let html = '<div class="row g-4">';

        vagasPage.forEach(vaga => {
            const tipo = vaga.tipo === 'estagio' ? 'Estágio' :
                         vaga.tipo === 'emprego' ? 'Emprego' : 'Freelance';

            let salario;
            if (!vaga.isPaid) {
                salario = '<p class="text-success fw-bold mb-0"><i class="bi bi-award me-2"></i>Oportunidade de Experiência</p>';
            } else {
                salario = `<p class="text-primary fw-bold mb-0">
                    Kzs ${vaga.salario_min} - ${vaga.salario_max || vaga.salario_min}/mês
                </p>`;
            }

            html += `
                <div class="col-lg-6">
                    <div class="card job-card h-100 shadow-sm hover-shadow">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="company-avatar bg-info text-white rounded-circle p-3">
                                    <i class="bi bi-briefcase"></i>
                                </div>
                                <span class="badge bg-primary">${tipo}</span>
                            </div>
                            <h5 class="card-title">${vaga.titulo}</h5>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-building me-2"></i>${vaga.empresa}
                            </p>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-geo-alt me-2"></i>${vaga.localizacao}
                            </p>
                            <div class="d-flex gap-2 mb-3 flex-wrap">
                                ${vaga.skills.slice(0,3).map(skill =>
                                    `<span class="badge bg-light text-dark">${skill}</span>`
                                ).join('')}
                            </div>
                            ${salario}
                            <a href="detalhes-vaga.html?id=${vaga.id}" class="btn btn-primary btn-sm mt-3 w-100">
                                Saiba Mais
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        vagasList.innerHTML = html;

        // Renderizar controles de paginação
        this.renderPaginationControls();

        // Scroll para o topo da lista
        vagasList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Renderizar controles de paginação
     */
    renderPaginationControls() {
        const paginationControls = document.getElementById('paginationControls');
        if (!paginationControls) return;

        if (this.totalPages <= 1) {
            paginationControls.innerHTML = '';
            return;
        }

        let html = `<div class="pagination-info">
            <small class="text-muted">
                Página <strong>${this.currentPage}</strong> de <strong>${this.totalPages}</strong>
                (${this.vagasFiltradas.length} vagas encontradas)
            </small>
        </div>`;

        if (this.currentPage > 1) {
            html += `
                <button class="btn btn-outline-primary" id="btnVoltar">
                    <i class="bi bi-arrow-left me-2"></i>Voltar
                </button>
            `;
        }

        if (this.currentPage < this.totalPages) {
            html += `
                <button class="btn btn-primary" id="btnVerMais">
                    <i class="bi bi-arrow-right me-2"></i>Ver Mais
                </button>
            `;
        }

        paginationControls.innerHTML = html;

        // Adicionar event listeners aos botões
        const btnVerMais = document.getElementById('btnVerMais');
        if (btnVerMais) {
            btnVerMais.addEventListener('click', () => this.goToNextPage());
        }

        const btnVoltar = document.getElementById('btnVoltar');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => this.goToPreviousPage());
        }
    }

    /**
     * Ir para próxima página
     */
    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderCurrentPage();
        }
    }

    /**
     * Ir para página anterior
     */
    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderCurrentPage();
        }
    }
}

/**
 *  Inicializar automaticamente
 */
document.addEventListener('DOMContentLoaded', function() {
    new VagasManager();
});
