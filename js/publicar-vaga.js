// ============================================
// PUBLICAR VAGA - PUBLISH JOB PAGE
// ============================================

function getUserType() {
    // Placeholder implementation for getUserType
    return 'company'; // This should be replaced with actual logic to determine user type
}

function truncateText(text, maxLength) {
    // Placeholder implementation for truncateText
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se empresa está logada
    const userType = getUserType();
    if (userType !== 'company') {
        // Se não é empresa, mostrar mensagem e redirecionar
        const form = document.getElementById('publicarVagaForm');
        if (form) {
            form.style.display = 'none';
            const container = document.querySelector('.container');
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning alert-dismissible fade show mt-5';
            alertDiv.innerHTML = `
                <i class="bi bi-exclamation-circle me-2"></i>
                <strong>Acesso Negado!</strong> Apenas empresas podem publicar vagas.
                <a href="login.html" class="alert-link">Faça login como empresa</a>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            container.appendChild(alertDiv);
        }
    } else {
        // Empresa está logada, permitir publicação
        setupPublishVagaForm();
    }
});

/**
 * Setup form de publicação de vaga
 */
function setupPublishVagaForm() {
    const form = document.getElementById('publicarVagaForm');

    // Evento para gerar confirmação
    const steps = form.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        step.addEventListener('change', function() {
            if (document.querySelector('.form-step:not([style*="display: none"])') === steps[2]) {
                generatePublishConfirmation();
            }
        });
    });

    // Validação de salários
    const salarioMin = document.getElementById('salarioMin');
    const salarioMax = document.getElementById('salarioMax');

    if (salarioMin && salarioMax) {
        const validateSalaries = () => {
            const min = parseInt(salarioMin.value) || 0;
            const max = parseInt(salarioMax.value) || 0;

            if (max < min && max !== 0) {
    // Submissão do formulário: valida, monta payload e simula envio com console.log
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('tituloVaga').value.trim();
            const type = document.getElementById('tipoVagaPublicar').value;
            const location = document.getElementById('localizacaoVaga').value;
            const minSalary = parseInt(document.getElementById('salarioMin').value, 10) || 0;
            const maxSalary = parseInt(document.getElementById('salarioMax').value, 10) || 0;
            const experience = document.getElementById('experienciaVaga').value;
            const description = document.getElementById('descricaoVaga').value.trim();
            const responsibilities = document.getElementById('responsabilidades').value;
            const requirements = document.getElementById('requisitos').value;
            const skills = document.getElementById('competenciasVaga').value;
            const benefits = document.getElementById('beneficiosVaga').value;
            const termsChecked = document.getElementById('TermosVaga').checked;

            // Validações simples
            if (!title) return alert('Por favor, insira o título da vaga.');
            if (!type) return alert('Por favor, selecione o tipo de vaga.');
            if (!location) return alert('Por favor, selecione a localização.');
            if (!experience) return alert('Por favor, selecione o nível de experiência.');
            if (!description) return alert('Por favor, insira a descrição da vaga.');
            if (!responsibilities.trim()) return alert('Por favor, insira as responsabilidades.');
            if (!requirements.trim()) return alert('Por favor, insira os requisitos.');
            if (!skills.trim()) return alert('Por favor, insira as competências.');
            if (minSalary > 0 && maxSalary > 0 && maxSalary < minSalary) return alert('O salário máximo deve ser maior ou igual ao mínimo.');
            if (!termsChecked) return alert('Você deve confirmar que as informações estão corretas.');

            // Montar arrays a partir dos campos livres
            const responsibilitiesArr = responsibilities.split('\n').map(s => s.trim()).filter(Boolean);
            const requirementsArr = requirements.split('\n').map(s => s.trim()).filter(Boolean);
            const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
            const benefitsArr = benefits ? benefits.split(',').map(s => s.trim()).filter(Boolean) : [];

            // Montar payload (simulação) - valores numéricos em Kzs
            const payload = {
                title,
                type,
                location,
                minSalary: minSalary || null,
                maxSalary: maxSalary || null,
                currency: 'Kzs',
                experience,
                description,
                responsibilities: responsibilitiesArr,
                requirements: requirementsArr,
                skills: skillsArr,
                benefits: benefitsArr,
                companyId: 1
            };

            // Simular envio para API
            console.log('Simulando envio para API - payload:', payload);

            // Mostrar mensagem de sucesso e redirecionar (simulado)
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.classList.remove('d-none');
            }
            setTimeout(() => {
                window.location.href = 'painel-empresa.html';
            }, 1200);
        });
    }
                salarioMax.classList.add('is-invalid');
                salarioMax.setCustomValidity('O salário máximo deve ser maior que o mínimo');
            } else {
                salarioMax.classList.remove('is-invalid');
                salarioMax.setCustomValidity('');
            }
        };

        salarioMin.addEventListener('change', validateSalaries);
        salarioMax.addEventListener('change', validateSalaries);
    }
}

/**
 * Gerar resumo de confirmação para publicação de vaga
 */
function generatePublishConfirmation() {
    const confirmDiv = document.getElementById('confirmacaoVaga');
    if (!confirmDiv) return;

    const titulo = document.getElementById('tituloVaga').value;
    const tipo = document.getElementById('tipoVagaPublicar').value;
    const localizacao = document.getElementById('localizacaoVaga').value;
    const experiencia = document.getElementById('experienciaVaga').value;
    const salarioMin = document.getElementById('salarioMin').value;
    const salarioMax = document.getElementById('salarioMax').value;
    const descricao = document.getElementById('descricaoVaga').value;

    const tipoLabels = { 'estagio': 'Estágio', 'emprego': 'Emprego', 'freelance': 'Freelance' };
    const locLabels = {
        'sao-paulo': 'São Paulo',
        'rio': 'Rio de Janeiro',
        'bh': 'Belo Horizonte',
        'remoto': 'Remoto',
        'hibrido': 'Híbrido'
    };

    const html = `
        <div class="list-group">
            <div class="list-group-item">
                <strong>Título:</strong> ${titulo}
            </div>
            <div class="list-group-item">
                <strong>Tipo:</strong> ${tipoLabels[tipo]}
            </div>
            <div class="list-group-item">
                <strong>Localização:</strong> ${locLabels[localizacao]}
            </div>
            <div class="list-group-item">
                <strong>Nível de Experiência:</strong> ${experiencia}
            </div>
            <div class="list-group-item">
                <strong>Faixa Salarial:</strong> ${salarioMin ? salarioMin + ' Kzs' : '—'} - ${salarioMax ? salarioMax + ' Kzs' : '—'}
            </div>
            <div class="list-group-item">
                <strong>Descrição:</strong> ${truncateText(descricao, 100)}
            </div>
        </div>
    `;

    confirmDiv.innerHTML = html;
}
