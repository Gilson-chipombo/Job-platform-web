// ============================================
// DETALHES VAGA - JOB DETAILS PAGE
// ============================================

// Declare variables before using them
const vagasData = []; // This should be populated with actual data
const isLoggedIn = () => false; // This should be implemented to check user login status
const bootstrap = {}; // This should be imported or declared with actual bootstrap Modal functionality
const showNotification = (message, type) => console.log(message, type); // This should be implemented to show notifications
const getData = (key) => localStorage.getItem(key); // This should be implemented to get data from storage
const saveData = (key, value) => localStorage.setItem(key, value); // This should be implemented to save data to storage
const getCurrentUser = () => ({ id: 1, name: 'John Doe' }); // This should be implemented to get current user data
const formatCurrency = (amount, currency) => {
    // Simple currency formatting for demonstration purposes
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency }).format(amount);
};

class VagaDetailsManager {
    constructor() {
        this.vagaId = this.getVagaIdFromUrl();
        this.vaga = null;
        this.init();
    }

    init() {
        this.loadVagaDetails();
        this.setupEventListeners();
        this.checkUserStatus();
    }

    /**
     * Obter ID da vaga da URL
     */
    getVagaIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || 1;
    }

    /**
     * Carregar detalhes da vaga
     */
    loadVagaDetails() {
        this.vaga = vagasData.find(v => v.id === this.vagaId);

        if (!this.vaga) {
            document.body.innerHTML = `
                <div class="container py-5 text-center">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle" style="font-size: 2.5rem; display: block; margin-bottom: 1rem;"></i>
                        <h5>Vaga não encontrada</h5>
                        <a href="vagas.html" class="btn btn-primary mt-3">Voltar para Vagas</a>
                    </div>
                </div>
            `;
            return;
        }

        this.renderVagaDetails();
    }

    /**
     * Renderizar detalhes da vaga
     */
    renderVagaDetails() {
        // Navegação por breadcrumb
        document.getElementById('breadcrumbTitle').textContent = this.vaga.titulo;

        // Informações principais
        document.getElementById('vagaTitulo').textContent = this.vaga.titulo;
        document.getElementById('vagaEmpresa').textContent = this.vaga.empresa;

        // Tipo, Localização, Salário, Data
        const tipo = this.vaga.tipo === 'estagio' ? 'Estágio' : 
                    this.vaga.tipo === 'emprego' ? 'Emprego' : 'Freelance';
        document.getElementById('vagaTipo').textContent = tipo;

        const localizacao = this.getLocalizacaoName(this.vaga.localizacao);
        document.getElementById('vagaLocal').textContent = localizacao;

        let salario;
        if (this.vaga.isPaid === false) {
            salario = 'Oportunidade de Experiência (Sem Remuneração)';
        } else {
            const currency = this.vaga.currency || 'BRL';
            salario = `${formatCurrency(this.vaga.salario_min, currency)} - ${formatCurrency(this.vaga.salario_max, currency)}/mês`;
        }
        document.getElementById('vagaSalario').textContent = salario;

        document.getElementById('vagaData').textContent = 'Recentemente';

        // Descrição
        document.getElementById('vagaDescricao').textContent = this.vaga.descricao;

        // Responsabilidades
        const responsabilidadesHtml = this.vaga.responsabilidades
            .map(r => `<li>${r}</li>`)
            .join('');
        document.getElementById('vagaResponsabilidades').innerHTML = responsabilidadesHtml;

        // Requisitos
        const requisitosHtml = this.vaga.requisitos
            .map(r => `<li>${r}</li>`)
            .join('');
        document.getElementById('vagaRequisitos').innerHTML = requisitosHtml;

        // Skills
        const skillsHtml = this.vaga.skills
            .map(s => `<span class="badge bg-light text-dark">${s}</span>`)
            .join('');
        document.getElementById('vagaSkills').innerHTML = skillsHtml;

        // Benefícios
        const beneficiosHtml = this.vaga.beneficios
            .map(b => `
                <div class="col-md-6 mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>${b}
                </div>
            `)
            .join('');
        document.getElementById('vagaBeneficios').innerHTML = beneficiosHtml;

        // Sobre empresa
        document.getElementById('vagaSobreEmpresa').textContent = this.vaga.sobreEmpresa;

        // Empresa info
        document.getElementById('empresaNome').textContent = this.vaga.empresa;
        document.getElementById('empresaLocalizacao').textContent = localizacao;

        // Favoritar
        this.setupFavoritarBtn();
    }

    /**
     * Converter código de localização para nome
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
     * Setup event listeners
     */
    setupEventListeners() {
        const aplicarBtn = document.getElementById('aplicarBtn');
        if (aplicarBtn) {
            aplicarBtn.addEventListener('click', () => {
                if (isLoggedIn()) {
                    const modal = new bootstrap.Modal(document.getElementById('aplicacaoModal'));
                    modal.show();
                } else {
                    showNotification('Faça login para se candidatar', 'warning');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }
            });
        }

        // Form de aplicação
        const aplicacaoForm = document.getElementById('aplicacaoForm');
        if (aplicacaoForm) {
            aplicacaoForm.addEventListener('submit', (e) => this.handleApplicationSubmit(e));
        }
    }

    /**
     * Verificar status do usuário e mostrar opções apropriadas
     */
    checkUserStatus() {
        const notLoggedIn = document.getElementById('notLoggedIn');
        const loggedIn = document.getElementById('loggedIn');

        if (isLoggedIn()) {
            if (notLoggedIn) notLoggedIn.style.display = 'none';
            if (loggedIn) loggedIn.style.display = 'block';
        } else {
            if (notLoggedIn) notLoggedIn.style.display = 'block';
            if (loggedIn) loggedIn.style.display = 'none';
        }
    }

    /**
     * Setup botão favoritar
     */
    setupFavoritarBtn() {
        const favoritarBtn = document.getElementById('favoritarBtn');
        if (!favoritarBtn) return;

        // Verificar se já está favoritado
        const favoritas = getData('vagasFavoritas') ? JSON.parse(getData('vagasFavoritas')) : [];
        if (favoritas.includes(this.vagaId)) {
            favoritarBtn.classList.add('active');
            favoritarBtn.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Removido dos Favoritos';
        }

        favoritarBtn.addEventListener('click', () => {
            if (!isLoggedIn()) {
                showNotification('Faça login para favoritar vagas', 'warning');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }

            const favoritas = getData('vagasFavoritas') ? JSON.parse(getData('vagasFavoritas')) : [];
            const index = favoritas.indexOf(this.vagaId);

            if (index > -1) {
                favoritas.splice(index, 1);
                favoritarBtn.classList.remove('active');
                favoritarBtn.innerHTML = '<i class="far fa-heart me-2"></i>Favoritar';
                showNotification('Vaga removida dos favoritos', 'info');
            } else {
                favoritas.push(this.vagaId);
                favoritarBtn.classList.add('active');
                favoritarBtn.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Removido dos Favoritos';
                showNotification('Vaga adicionada aos favoritos', 'success');
            }

            saveData('vagasFavoritas', JSON.stringify(favoritas));
        });
    }

    /**
     * Lidar com envio de candidatura
     */
    handleApplicationSubmit(e) {
        e.preventDefault();

        const form = e.target;
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const mensagem = document.getElementById('mensagemAplicacao').value;
        const usuario = getCurrentUser();

        // Salvar candidatura
        const candidaturas = getData('minhasCandidaturas') ? JSON.parse(getData('minhasCandidaturas')) : [];
        candidaturas.push({
            vagaId: this.vagaId,
            vagaTitulo: this.vaga.titulo,
            empresa: this.vaga.empresa,
            data: new Date().toISOString(),
            mensagem: mensagem,
            status: 'análise'
        });
        saveData('minhasCandidaturas', JSON.stringify(candidaturas));

        showNotification('Candidatura enviada com sucesso!', 'success');

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('aplicacaoModal'));
        modal.hide();

        // Resetar form
        form.reset();
        form.classList.remove('was-validated');

        // Voltar para vagas após 2 segundos
        setTimeout(() => {
            window.location.href = 'vagas.html';
        }, 2000);
    }
}

/**
 * Inicializar ao carregar
 */
document.addEventListener('DOMContentLoaded', function() {
    new VagaDetailsManager();
});
