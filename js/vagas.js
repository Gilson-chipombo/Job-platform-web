// ============================================
// VAGAS (JOB LISTINGS) - LISTING AND FILTERING
// ============================================

// Declare undeclared variables
const vagasData = []; // Placeholder for vagasData, should be imported or defined elsewhere
const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

const formatCurrency = (value, currency) => {
    // Placeholder for formatCurrency function
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
};

const getLocalizacaoName = (localizacao) => {
    // Placeholder for getLocalizacaoName function
    return localizacao;
};

class VagasManager {
    constructor() {
        this.vagas = vagasData; // Dados do main.js
        this.filtrosTipo = [];
        this.filtrosRemuneracao = [];
        this.filtrosLocalizacao = '';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderVagas(this.vagas);
    }

    /**
     * Setup event listeners para filtros
     */
    setupEventListeners() {
        // Filtros de tipo
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Filtro de localização
        const filterLocation = document.getElementById('filterLocation');
        if (filterLocation) {
            filterLocation.addEventListener('change', () => this.applyFilters());
        }

        // Busca
        const searchVagas = document.getElementById('searchVagas');
        if (searchVagas) {
            searchVagas.addEventListener('input', debounce(() => this.applyFilters(), 300));
        }

        // Limpar filtros
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }
    }

    /**
     * Aplicar filtros
     */
    applyFilters() {
        // Coletar tipos selecionados
        this.filtrosTipo = [];
        document.querySelectorAll('.filter-checkbox:checked').forEach(checkbox => {
            const value = checkbox.value;
            // Separar remuneração dos tipos de vaga
            if (value === 'unpaid' || value === 'paid') {
                this.filtrosRemuneracao.push(value);
            } else {
                this.filtrosTipo.push(value);
            }
        });

        // Localização
        const filterLocation = document.getElementById('filterLocation');
        this.filtrosLocalizacao = filterLocation ? filterLocation.value : '';

        // Busca
        const searchVagas = document.getElementById('searchVagas');
        this.searchTerm = searchVagas ? searchVagas.value.toLowerCase() : '';

        // Filtrar vagas
        let vagasFiltradas = this.vagas.filter(vaga => {
            let passType = this.filtrosTipo.length === 0 || this.filtrosTipo.includes(vaga.tipo);
            let passLocation = !this.filtrosLocalizacao || vaga.localizacao === this.filtrosLocalizacao;
            let passSearch = !this.searchTerm || 
                           vaga.titulo.toLowerCase().includes(this.searchTerm) ||
                           vaga.empresa.toLowerCase().includes(this.searchTerm);
            
            // Filtro de remuneração
            let passRemuneracao = true;
            if (this.filtrosRemuneracao.length > 0) {
                const vagaIsPaid = vaga.isPaid !== false;
                passRemuneracao = 
                    (this.filtrosRemuneracao.includes('unpaid') && vaga.isPaid === false) ||
                    (this.filtrosRemuneracao.includes('paid') && vagaIsPaid);
            }

            return passType && passLocation && passSearch && passRemuneracao;
        });

        this.renderVagas(vagasFiltradas);
    }

    /**
     * Limpar todos os filtros
     */
    clearAllFilters() {
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });

        const filterLocation = document.getElementById('filterLocation');
        if (filterLocation) {
            filterLocation.value = '';
        }

        const searchVagas = document.getElementById('searchVagas');
        if (searchVagas) {
            searchVagas.value = '';
        }

        this.filtrosTipo = [];
        this.filtrosRemuneracao = [];
        this.filtrosLocalizacao = '';
        this.searchTerm = '';

        this.renderVagas(this.vagas);
    }

    /**
     * Renderizar vagas
     */
    renderVagas(vagas) {
        const vagasList = document.getElementById('vagasList');
        if (!vagasList) return;

        if (vagas.length === 0) {
            vagasList.innerHTML = `
                <div class="alert alert-info text-center py-5">
                    <i class="bi bi-search" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                    <h5>Nenhuma vaga encontrada</h5>
                    <p class="text-muted">Tente ajustar seus filtros</p>
                </div>
            `;
            return;
        }

        let html = '<div class="row g-4">';

        vagas.forEach(vaga => {
            const tipo = vaga.tipo === 'estagio' ? 'Estágio' : 
                        vaga.tipo === 'emprego' ? 'Emprego' : 'Freelance';
            
            const localizacao = getLocalizacaoName(vaga.localizacao);

            let salario;
            if (vaga.isPaid === false) {
                salario = '<p class="text-success fw-bold mb-0"><i class="bi bi-award me-2"></i>Oportunidade de Experiência</p>';
            } else {
                const currency = vaga.currency || 'BRL';
                salario = `<p class="text-primary fw-bold mb-0">${formatCurrency(vaga.salario_min, currency)} - ${formatCurrency(vaga.salario_max, currency)}/mês</p>`;
            }

            const badge = vaga.isPaid === false ? 'warning' : 
                         (vaga.tipo === 'estagio' ? 'success' : 
                         (vaga.tipo === 'emprego' ? 'primary' : 'info'));
            
            const badgeText = vaga.isPaid === false ? 'Sem Remuneração' : 'Ativo';

            html += `
                <div class="col-lg-6">
                    <div class="card job-card h-100 shadow-sm hover-shadow">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="company-avatar bg-info text-white rounded-circle p-3">
                                    <i class="bi bi-briefcase"></i>
                                </div>
                                <span class="badge bg-${badge}">${badgeText}</span>
                            </div>
                            <h5 class="card-title">${vaga.titulo}</h5>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-building me-2"></i>${vaga.empresa}
                            </p>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-geo-alt me-2"></i>${localizacao}
                            </p>
                            <div class="d-flex gap-2 mb-3 flex-wrap">
                                ${vaga.skills.slice(0, 3).map(skill => 
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
    }
}

/**
 * Inicializar ao carregar a página
 */
document.addEventListener('DOMContentLoaded', function() {
    new VagasManager();
});
