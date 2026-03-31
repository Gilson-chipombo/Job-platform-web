// ============================================
// DETALHES VAGA - JOB DETAILS PAGE (API VERSION)
// ============================================

class VagaDetailsManager {
    constructor() {
        this.vagaId = this.getVagaIdFromUrl();
        this.vaga = null;
        this.userApplication = null;
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
                segmento: data.company?.segment,
                logo: data.company?.logo
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
        
        // Carregar logo da empresa
        this.loadEmpresaLogo();
        
        this.setupFavoritarBtn();
    }

    /**
     * Carregar logo da empresa ou usar imagem padrão da internet
     */
    loadEmpresaLogo() {
        const logoImg = document.getElementById('empresaLogo');
        const defaultLogoUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop';

        if (this.vaga && this.vaga.logo) {
            // Se houver logo definida, carregar da API
            const logoPath = `http://127.0.0.1:3000/uploads/logos/${this.vaga.logo}`;
            logoImg.src = logoPath;
            logoImg.onerror = () => {
                logoImg.src = defaultLogoUrl;
            };
        } else {
            // Se não houver logo, usar imagem padrão da internet
            logoImg.src = defaultLogoUrl;
        }
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
        console.log("Configurando event listeners");
        
        const aplicarBtn = document.getElementById('aplicarBtn');
        console.log("Botão Aplicar encontrado:", aplicarBtn);

        if (aplicarBtn) {
            aplicarBtn.addEventListener('click', () => {
                console.log("Click no botão Aplicar");
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

        const cancelarBtn = document.getElementById('cancelarCandidaturaBtn');
        console.log("Botão Cancelar encontrado:", cancelarBtn);
        
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                console.log("Click no botão Cancelar");
                this.handleCancelApplication();
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
            this.checkUserApplication();
        } else {
            if (notLoggedIn) notLoggedIn.style.display = 'block';
            if (loggedIn) loggedIn.style.display = 'none';
        }
    }

    /**
     * Verificar se o usuário já se candidatou a esta vaga
     */
    async checkUserApplication() {
        try {
            const idStudent = localStorage.getItem("idStudent");
            if (!idStudent) {
                console.log("ID do estudante não encontrado");
                return;
            }

            const response = await fetch(`http://127.0.0.1:3000/applies/student/${idStudent}`);
            const applications = await response.json();

            console.log("Candidaturas do usuário:", applications);
            console.log("Vaga ID procurado:", this.vagaId);

            // Procurar por uma aplicação para esta vaga (tentar múltiplos nomes de campo)
            const myApplication = applications.find(app => {
                return app.vagaId === this.vagaId || 
                       app.idVaga === this.vagaId || 
                       (app.vaga && app.vaga.id === this.vagaId);
            });

            console.log("Candidatura encontrada:", myApplication);

            if (myApplication) {
                this.userApplication = myApplication;
                console.log("Mostrando botão Cancelar Candidatura");
                this.updateApplicationButtonsState(true);
            } else {
                console.log("Mostrando botão Candidatar-se agora");
                this.updateApplicationButtonsState(false);
            }
        } catch (error) {
            console.error('Erro ao verificar candidatura:', error);
            this.updateApplicationButtonsState(false);
        }
    }

    /**
     * Atualizar estado dos botões de candidatura
     */
    updateApplicationButtonsState(hasApplied) {
        const aplicarBtn = document.getElementById('aplicarBtn');
        const cancelarBtn = document.getElementById('cancelarCandidaturaBtn');

        console.log("Atualizando botões - hasApplied:", hasApplied);
        console.log("Botão Aplicar:", aplicarBtn);
        console.log("Botão Cancelar:", cancelarBtn);

        if (hasApplied) {
            if (aplicarBtn) {
                aplicarBtn.style.display = 'none';
                console.log("Escondendo botão Aplicar");
            }
            if (cancelarBtn) {
                cancelarBtn.style.display = 'block';
                console.log("Mostrando botão Cancelar");
            }
        } else {
            if (aplicarBtn) {
                aplicarBtn.style.display = 'block';
                console.log("Mostrando botão Aplicar");
            }
            if (cancelarBtn) {
                cancelarBtn.style.display = 'none';
                console.log("Escondendo botão Cancelar");
            }
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

    /**
     * Cancelar candidatura
     */
    async handleCancelApplication() {
        if (!this.userApplication) {
            showNotification('Erro: candidatura não encontrada', 'danger');
            return;
        }

        // Confirmação
        if (!confirm('Tem certeza que deseja cancelar esta candidatura?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:3000/applies/${this.userApplication.id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Candidatura cancelada com sucesso!', 'success');
                this.userApplication = null;
                this.updateApplicationButtonsState(false);
            } else {
                showNotification(data.message || 'Erro ao cancelar candidatura', 'danger');
            }
        } catch (error) {
            console.error('Erro ao cancelar candidatura:', error);
            showNotification('Erro ao cancelar candidatura. Tente novamente.', 'danger');
        }
    }

    async handleApplicationSubmit(e) {
        e.preventDefault();

        const form = e.target;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const mensagem = document.getElementById('mensagemAplicacao').value;
        const fileInput = document.getElementById('cv');

        const formData = new FormData();

        formData.append("idStudent", parseInt(localStorage.getItem("idStudent")));
        formData.append("idVaga", this.getVagaIdFromUrl());
        formData.append("description", mensagem);

        if (fileInput.files.length > 0) {
            formData.append("cv", fileInput.files[0]);
        }

        //console.log(applicationData);
        
        try{
            const response = await fetch('http://127.0.0.1:3000/applies/create', {
                method: 'POST',
                body: formData
            });

            
            const data = await response.json();
            
            if (data.message)
                showNotification(data.message || `Erro ao enviar candidatura. Tente novamente.`, 'danger');
            else{

                showNotification('Candidatura enviada com sucesso!', 'success');

                // Atualizar estado dos botões
                if (data.id) {
                    this.userApplication = data;
                    this.updateApplicationButtonsState(true);
                }

                const modal = bootstrap.Modal.getInstance(document.getElementById('aplicacaoModal'));
                modal.hide();

                form.reset();
                form.classList.remove('was-validated');

                setTimeout(() => {
                   window.location.href = 'vagas.html';
                }, 2000);
            }
`           `
        }catch(error){
            console.error('Erro ao enviar candidatura:', error);
            showNotification(error.message || `Erro ao enviar candidatura. Tente novamente.`, 'danger');
            return;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VagaDetailsManager();
});
