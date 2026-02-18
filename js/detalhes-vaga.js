// ============================================
// DETALHES VAGA - JOB DETAILS PAGE (API VERSION)
// ============================================

class VagaDetailsManager {
    constructor() {
        this.vagaId = this.getVagaIdFromUrl();
        this.vaga = null;
        this.authManager = new AuthManager();
        this.favoritesManager = new FavoritesManager();
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
        return parseInt(params.get('id'));
    }

    /**
     * Buscar vaga da API
     */
    async loadVagaDetails() {
        try {
            const response = await fetch(`http://127.0.0.1:3000/vagas/${this.vagaId}`);

            if (!response.ok) {
                throw new Error('Vaga não encontrada');
            }

            const data = await response.json();

            // Normalizar dados da API para o formato usado no frontend
            this.vaga = {
                id: data.id,
                titulo: data.title,
                empresa: data.company?.name || "Empresa não informada",
                tipo: data.type,
                localizacao: data.Location,
                salario_min: data.minSalary,
                salario_max: data.maxSalary,
                descricao: data.description,
                responsabilidades: data.Responsability
                    ? data.Responsability.split(',').map(r => r.trim())
                    : [],
                requisitos: data.requirements
                    ? data.requirements.split(',').map(r => r.trim())
                    : [],
                skills: data.skills
                    ? data.skills.split(',').map(s => s.trim())
                    : [],
                beneficios: data.beneficios
                    ? data.beneficios.split(',').map(b => b.trim())
                    : [],
                sobreEmpresa: data.company?.description || "Sem descrição disponível",
                website: data.company?.website,
                provincia: data.company?.Province,
                endereco: data.company?.address,
                segmento: data.company?.segment
            };

            this.renderVagaDetails();

        } catch (error) {
            console.error(error);
            document.body.innerHTML = `
                <div class="container py-5 text-center">
                    <div class="alert alert-danger">
                        <h5>Vaga não encontrada</h5>
                        <a href="vagas.html" class="btn btn-primary mt-3">Voltar para Vagas</a>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Renderizar dados na página
     */
    renderVagaDetails() {

        document.getElementById('breadcrumbTitle').textContent = this.vaga.titulo;
        document.getElementById('vagaTitulo').textContent = this.vaga.titulo;
        document.getElementById('vagaEmpresa').textContent = this.vaga.empresa;

        const tipo =
            this.vaga.tipo === 'estagio' ? 'Estágio' :
            this.vaga.tipo === 'emprego' ? 'Emprego' :
            'Freelance';

        document.getElementById('vagaTipo').textContent = tipo;
        document.getElementById('vagaLocal').textContent = this.vaga.localizacao;

        let salario = `${this.formatCurrency(this.vaga.salario_min)} - ${this.formatCurrency(this.vaga.salario_max)}/mês`;
        document.getElementById('vagaSalario').textContent = salario;

        document.getElementById('vagaDescricao').textContent = this.vaga.descricao;

        // Responsabilidades
        document.getElementById('vagaResponsabilidades').innerHTML =
            this.vaga.responsabilidades.map(r => `<li>${r}</li>`).join('');

        // Requisitos
        document.getElementById('vagaRequisitos').innerHTML =
            this.vaga.requisitos.map(r => `<li>${r}</li>`).join('');

        // Skills
        document.getElementById('vagaSkills').innerHTML =
            this.vaga.skills.map(s =>
                `<span class="badge bg-light text-dark me-2 mb-2">${s}</span>`
            ).join('');

        // Benefícios
        document.getElementById('vagaBeneficios').innerHTML =
            this.vaga.beneficios.map(b => `
                <div class="col-md-6 mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>${b}
                </div>
            `).join('');

        document.getElementById('vagaSobreEmpresa').textContent = this.vaga.sobreEmpresa;

        document.getElementById('empresaNome').textContent = this.vaga.empresa;
        document.getElementById('empresaLocalizacao').textContent = this.vaga.provincia || '';
        document.getElementById('empresaWebsite').textContent = this.vaga.website || '';
        empresaRamo.textContent = this.vaga.segmento || '';
        empresaAddress.textContent = this.vaga.endereco || '';
        this.setupFavoritarBtn();
    }

    formatCurrency(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'AOA'
        }).format(valor);
    }

    /**
     * Eventos
     */
    setupEventListeners() {
        const aplicarBtn = document.getElementById('aplicarBtn');

        if (aplicarBtn) {
            aplicarBtn.addEventListener('click', () => {
                if (this.authManager.isLoggedIn()) {
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

        const aplicacaoForm = document.getElementById('aplicacaoForm');
        if (aplicacaoForm) {
            aplicacaoForm.addEventListener('submit', (e) => this.handleApplicationSubmit(e));
        }
    }

    checkUserStatus() {
        const notLoggedIn = document.getElementById('notLoggedIn');
        const loggedIn = document.getElementById('loggedIn');

        if (this.authManager.isLoggedIn()) {
            if (notLoggedIn) notLoggedIn.style.display = 'none';
            if (loggedIn) loggedIn.style.display = 'block';
        } else {
            if (notLoggedIn) notLoggedIn.style.display = 'block';
            if (loggedIn) loggedIn.style.display = 'none';
        }
    }

    setupFavoritarBtn() {
        const favoritarBtn = document.getElementById('favoritarBtn');
        if (!favoritarBtn) return;

        const isFavorite = this.favoritesManager.isFavorite(this.vagaId);

        if (isFavorite) {
            favoritarBtn.classList.add('active');
            favoritarBtn.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Remover dos Favoritos';
        }

        favoritarBtn.addEventListener('click', () => {

            if (!this.authManager.isLoggedIn()) {
                showNotification('Faça login para favoritar vagas', 'warning');
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }

            if (this.favoritesManager.isFavorite(this.vagaId)) {
                this.favoritesManager.removeFavorite(this.vagaId);
                favoritarBtn.classList.remove('active');
                favoritarBtn.innerHTML = '<i class="bi bi-heart me-2"></i>Favoritar';
                showNotification('Vaga removida dos favoritos', 'info');
            } else {
                this.favoritesManager.addFavorite(this.vagaId, this.vaga);
                favoritarBtn.classList.add('active');
                favoritarBtn.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Remover dos Favoritos';
                showNotification('Vaga adicionada aos favoritos', 'success');
            }
        });
    }

    handleApplicationSubmit(e) {
        e.preventDefault();

        const form = e.target;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const mensagem = document.getElementById('mensagemAplicacao').value;

        const candidaturas = localStorage.getItem('applications')
            ? JSON.parse(localStorage.getItem('applications'))
            : [];

        candidaturas.push({
            id: 'app_' + Date.now(),
            vagaId: this.vagaId,
            vagaTitulo: this.vaga.titulo,
            empresa: this.vaga.empresa,
            data: new Date().toISOString(),
            mensagem: mensagem,
            status: 'análise'
        });

        localStorage.setItem('applications', JSON.stringify(candidaturas));

        showNotification('Candidatura enviada com sucesso!', 'success');

        const modal = bootstrap.Modal.getInstance(document.getElementById('aplicacaoModal'));
        modal.hide();

        form.reset();
        form.classList.remove('was-validated');

        setTimeout(() => {
            window.location.href = 'vagas.html';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VagaDetailsManager();
});
