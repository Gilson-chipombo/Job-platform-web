// ============================================
// PERFIL - USER PROFILE PAGE
// ============================================

// Declare variables before using them
function getCurrentUser() {
    // Simulated function to get current user
    return { nome: 'João Silva Santos', email: 'joao@example.com' };
}

function getUserType() {
    // Simulated function to get user type
    return 'student';
}

function getData(key) {
    // Simulated function to get data
    return [];
}

const vagasData = [
    // Simulated vagas data
    { id: 1, titulo: 'Vaga 1', empresa: 'Empresa A', localizacao: 'sao-paulo', salario_min: 3000, salario_max: 5000 },
    { id: 2, titulo: 'Vaga 2', empresa: 'Empresa B', localizacao: 'rio', salario_min: 4000, salario_max: 6000 }
];

function saveData(key, value) {
    // Simulated function to save data
}

function showNotification(message, type) {
    // Simulated function to show notification
    console.log(`Notification: ${message} (${type})`);
}

class PerfilManager {
    constructor() {
        this.user = getCurrentUser();
        this.userType = getUserType();
        this.init();
    }

    init() {
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }

        this.loadUserData();
        this.setupTabNavigation();
        this.loadCandidaturas();
        this.loadVagasSalvas();
        this.adjustUIForUserType();
    }

    /**
     * Carregar dados do usuário
     */
    loadUserData() {
        if (this.userType === 'student') {
            // Dados de estudante (simulados para demo)
            const nomeDisplay = document.getElementById('nomePerfilDisplay');
            const profissaoDisplay = document.getElementById('profissaoDisplay');

            if (nomeDisplay) nomeDisplay.textContent = this.user.nome || 'Estudante';
            if (profissaoDisplay) profissaoDisplay.textContent = 'Estudante';

            // Carregae dados para exibição (simulados)
            document.getElementById('displayNomeCompleto').textContent = this.user.nome || 'João Silva Santos';
            document.getElementById('displayEmail').textContent = this.user.email || 'joao@example.com';
            document.getElementById('displayTelefone').textContent = '(11) 99999-9999';
            document.getElementById('displayCPF').textContent = '123.456.789-00';
            document.getElementById('displayEscola').textContent = 'Escola Estadual João Goulart';
            document.getElementById('displaySerie').textContent = '3º Ano';
            document.getElementById('displayTurno').textContent = 'Matutino';

        } else if (this.userType === 'company') {
            // Dados de empresa
            const nomeDisplay = document.getElementById('nomePerfilDisplay');
            const profissaoDisplay = document.getElementById('profissaoDisplay');

            if (nomeDisplay) nomeDisplay.textContent = this.user.empresa || 'Empresa';
            if (profissaoDisplay) profissaoDisplay.textContent = 'Empresa';
        }
    }

    /**
     * Setup navegação entre abas
     */
    setupTabNavigation() {
        const tabs = [
            { btn: '#tabInfoPessoal', content: '#infoPessoal' },
            { btn: '#tabCandidaturas', content: '#candidaturas' },
            { btn: '#tabVagasSalvas', content: '#vagasSalvas' },
            { btn: '#tabCandidatos', content: '#candidatos' },
            { btn: '#tabMinhasVagas', content: '#minhasVagas' }
        ];

        tabs.forEach(tab => {
            const btn = document.querySelector(tab.btn);
            if (btn) {
                btn.addEventListener('click', () => this.switchTab(tab.content));
            }
        });
    }

    /**
     * Trocar abas
     */
    switchTab(contentSelector) {
        // Remover classe active de todos os botões
        document.querySelectorAll('.list-group-item').forEach(btn => {
            btn.classList.remove('active');
        });

        // Ocultar todo conteúdo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });

        // Ativar botão e mostrar conteúdo
        const activeBtn = document.querySelector(`${contentSelector.replace('#', '#tab')}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        const activeContent = document.querySelector(contentSelector);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    }

    /**
     * Carregar candidaturas
     */
    loadCandidaturas() {
        const candidaturas = getData('minhasCandidaturas') || [];

        if (candidaturas.length === 0) {
            return;
        }

        // Aqui você poderia renderizar as candidaturas do usuário
        // No caso da demo, mantemos os dados estáticos
    }

    /**
     * Carregar vagas salvas
     */
    loadVagasSalvas() {
        const favoritas = getData('vagasFavoritas') || [];
        const vagasSalvasList = document.getElementById('vagasSalvasList');

        if (!vagasSalvasList || favoritas.length === 0) {
            if (vagasSalvasList) {
                vagasSalvasList.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info text-center">
                            <i class="bi bi-bookmark" style="font-size: 2.5rem; display: block; margin-bottom: 1rem;"></i>
                            <h5>Nenhuma vaga salva</h5>
                            <p class="text-muted">Você ainda não salvou nenhuma vaga em favoritos</p>
                            <a href="vagas.html" class="btn btn-primary mt-2">Ver Todas as Vagas</a>
                        </div>
                    </div>
                `;
            }
            return;
        }

        // Filtrar vagas salvas dos dados gerais
        const vagasSalvas = vagasData.filter(vaga => favoritas.includes(vaga.id));

        let html = '';
        vagasSalvas.forEach(vaga => {
            const localizacao = this.getLocalizacaoName(vaga.localizacao);
            const salario = `R$ ${vaga.salario_min.toLocaleString()} - ${vaga.salario_max.toLocaleString()}/mês`;

            html += `
                <div class="col-lg-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">${vaga.titulo}</h5>
                            <p class="text-muted small mb-2">
                                <i class="bi bi-building me-2"></i>${vaga.empresa}
                            </p>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-geo-alt me-2"></i>${localizacao}
                            </p>
                            <p class="text-primary fw-bold mb-3">${salario}</p>
                            <div class="d-flex gap-2">
                                <a href="detalhes-vaga.html?id=${vaga.id}" class="btn btn-sm btn-primary flex-grow-1">
                                    Ver Detalhes
                                </a>
                                <button class="btn btn-sm btn-danger" onclick="removeFavoritaVaga(${vaga.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (vagasSalvasList) {
            vagasSalvasList.innerHTML = html;
        }
    }

    /**
     * Converter código de localização
     */
    getLocalizacaoName(codigo) {
        const localizacoes = {
            'sao-paulo': 'São Paulo, SP',
            'rio': 'Rio de Janeiro, RJ',
            'bh': 'Belo Horizonte, MG',
            'brasilia': 'Brasília, DF',
            'remoto': 'Remoto'
        };
        return localizacoes[codigo] || codigo;
    }

    /**
     * Ajustar UI conforme tipo de usuário
     */
    adjustUIForUserType() {
        if (this.userType === 'student') {
            // Ocultar abas de empresa
            const tabCandidatos = document.getElementById('tabCandidatos');
            const tabMinhasVagas = document.getElementById('tabMinhasVagas');

            if (tabCandidatos) tabCandidatos.style.display = 'none';
            if (tabMinhasVagas) tabMinhasVagas.style.display = 'none';
        } else if (this.userType === 'company') {
            // Ocultar abas de estudante
            const tabVagasSalvas = document.getElementById('tabVagasSalvas');
            if (tabVagasSalvas) tabVagasSalvas.style.display = 'none';
        }
    }
}

/**
 * Remover vaga dos favoritos
 */
function removeFavoritaVaga(vagaId) {
    const favoritas = getData('vagasFavoritas') || [];
    const index = favoritas.indexOf(vagaId);

    if (index > -1) {
        favoritas.splice(index, 1);
        saveData('vagasFavoritas', favoritas);
        showNotification('Vaga removida dos favoritos', 'info');

        // Recarregar vagas salvas
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

/**
 * Inicializar ao carregar página
 */
document.addEventListener('DOMContentLoaded', function() {
    new PerfilManager();
});
