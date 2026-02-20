// ============================================
// FORM WIZARD - MULTI-STEP FORMS
// ============================================

class FormWizard {
    constructor(formSelector, options = {}) {
        this.form = document.querySelector(formSelector);
        this.currentStep = 1;
        this.totalSteps = this.form.querySelectorAll('.form-step').length;
        this.options = {
            prevBtnSelector: '#prevBtn, #prevBtnEmpresa, #prevBtnVaga',
            nextBtnSelector: '#nextBtn, #nextBtnEmpresa, #nextBtnVaga',
            submitBtnSelector: '#submitBtn, #submitBtnEmpresa, #submitBtnVaga',
            ...options
        };

        this.init();
    }

    init() {
        // Encontrar botões
        this.prevBtn = document.querySelector(this.options.prevBtnSelector);
        this.nextBtn = document.querySelector(this.options.nextBtnSelector);
        this.submitBtn = document.querySelector(this.options.submitBtnSelector);

        // Event listeners
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevStep());
        }
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Atualizar estado inicial
        this.updateStepDisplay();
    }

    /**
     * Ir para próximo passo
     */
    nextStep() {
        // Validar formulário do passo atual
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.generateConfirmation();
            }
        }
    }

    /**
     * Ir para passo anterior
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    /**
     * Validar passo atual
     */
    validateCurrentStep() {
        const currentFormStep = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentFormStep.querySelectorAll('input, textarea, select');

        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        // if (!isValid) {
        //     window.alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        // }

        return isValid;
    }

    /**
     * Atualizar exibição do passo
     */
    updateStepDisplay() {
        // Ocultar todos os passos
        document.querySelectorAll('.form-step').forEach(step => {
            step.style.display = 'none';
        });

        // Mostrar passo atual
        const currentFormStep = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentFormStep) {
            currentFormStep.style.display = 'block';
        }

        // Atualizar indicadores de passo
        document.querySelectorAll('.step-circle').forEach(circle => {
            const stepNum = parseInt(circle.getAttribute('data-step'));
            circle.classList.remove('active', 'completed');

            if (stepNum === this.currentStep) {
                circle.classList.add('active');
            } else if (stepNum < this.currentStep) {
                circle.classList.add('completed');
            }
        });

        // Mostrar/ocultar botões de navegação
        if (this.prevBtn) {
            this.prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        if (this.nextBtn) {
            this.nextBtn.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        }

        if (this.submitBtn) {
            this.submitBtn.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
        }
    }

    /**
     * Gerar resumo de confirmação
     */
    generateConfirmation() {
        if (this.currentStep === this.totalSteps) {
            const confirmDiv = document.getElementById('confirmationSummary') || 
                              document.getElementById('confirmationSummaryEmpresa') ||
                              document.getElementById('confirmacaoVaga');
            
            if (confirmDiv) {
                const formData = this.getFormData();
                confirmDiv.innerHTML = this.formatConfirmation(formData);
            }
        }
    }

    /**
     * Obter dados do formulário
     */
    getFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (input.checked) {
                    if (formData[input.name]) {
                        if (!Array.isArray(formData[input.name])) {
                            formData[input.name] = [formData[input.name]];
                        }
                        formData[input.name].push(input.value);
                    } else {
                        formData[input.name] = input.value;
                    }
                }
            } else if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else if (input.value) {
                formData[input.name || input.id] = input.value;
            }
        });

        return formData;
    }

    /**
     * Formatar confirmação
     */
    formatConfirmation(data) {
        let html = '<div class="list-group">';

        for (const [key, value] of Object.entries(data)) {
            if (value && key !== 'confirmarSenha' && key !== 'termos' && key !== 'newsletter' && 
                key !== 'termosEmpresa' && key !== 'TermosVaga' && key !== 'confirmacaoCV') {
                
                const label = this.formatLabel(key);
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                
                html += `
                    <div class="list-group-item">
                        <strong>${label}:</strong> ${this.truncateValue(displayValue)}
                    </div>
                `;
            }
        }

        html += '</div>';
        return html;
    }

    /**
     * Formatar label
     */
    formatLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Truncar valor
     */
    truncateValue(value) {
        if (value.length > 50) {
            return value.substring(0, 50) + '...';
        }
        return value;
    }

    /**
     * Lidar com submit
     */
    handleSubmit(e) {
        if (!this.form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.form.classList.add('was-validated');
    }
}

/**
 * Inicializar wizards quando página carregar
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wizard para cadastro de estudante
    const cadastroEstudanteForm = document.getElementById('cadastroEstudanteForm');
    if (cadastroEstudanteForm) {
        new FormWizard('#cadastroEstudanteForm', {
            prevBtnSelector: '#prevBtn',
            nextBtnSelector: '#nextBtn',
            submitBtnSelector: '#submitBtn'
        });

        // Listener para submit
        cadastroEstudanteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.checkValidity() === false) {
                e.stopPropagation();
                this.classList.add('was-validated');
            } else {
                const formData = {
                    nomeCompleto: document.getElementById('nomeCompleto').value,
                    email: document.getElementById('emailCadastro').value,
                    telefone: document.getElementById('telefone').value,
                    cpf: document.getElementById('NIF').value,
                    escola: document.getElementById('escola').value,
                    serie: document.getElementById('serie').value
                };

                // Usar authManager para registrar
                const user = authManager.registerStudent(formData);

                // showNotification('Cadastro realizado com sucesso! Bem-vindo!', 'success');
                // setTimeout(() => {
                //     window.location.href = 'perfil.html';
                // }, 1500);
            }
        });
    }

    // Wizard para cadastro de empresa
    const cadastroEmpresaForm = document.getElementById('cadastroEmpresaForm');
    if (cadastroEmpresaForm) {
        new FormWizard('#cadastroEmpresaForm', {
            prevBtnSelector: '#prevBtnEmpresa',
            nextBtnSelector: '#nextBtnEmpresa',
            submitBtnSelector: '#submitBtnEmpresa'
        });

        // Listener para submit
        cadastroEmpresaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.checkValidity() === false) {
                e.stopPropagation();
                this.classList.add('was-validated');
            } else {
                const formData = {
                    nomeEmpresa: document.getElementById('nomeEmpresa').value,
                    email: document.getElementById('emailEmpresaCad').value,
                    telefone: document.getElementById('telefoneEmpresa').value || '',
                    cnpj: document.getElementById('cnpj').value || '',
                    website: document.getElementById('siteEmpresa').value || ''
                };

                // Usar authManager para registrar
                const user = authManager.registerCompany(formData);

                showNotification('Cadastro da empresa realizado com sucesso! Bem-vindo!', 'success');
                setTimeout(() => {
                    window.location.href = 'painel-empresa.html';
                }, 1500);
            }
        });
    }

    // Wizard para publicar vaga
    const publicarVagaForm = document.getElementById('publicarVagaForm');
     if (publicarVagaForm) {
        new FormWizard('#publicarVagaForm', {
            prevBtnSelector: '#prevBtnVaga',
            nextBtnSelector: '#nextBtnVaga',
            //submitBtnSelector: '#submitBtnVaga'
        });

        //window.alert('Estou Caht');
        // //Listener para submit
        // publicarVagaForm.addEventListener('submit', function(e) {
        //     e.preventDefault();
        //     if (this.checkValidity() === false) {
        //         e.stopPropagation();
        //         this.classList.add('was-validated');
        //     } else {
        //         window.alert('Estou aqui');
        //         setTimeout(() => {
        //             window.location.href = 'perfil.html';
        //         }, 1500);
        //     }
        // });
    }
});

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showNotification(message, type) {
    window.alert(`${type.toUpperCase()}: ${message}`);
}
