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
                <strong>Faixa Salarial:</strong> R$ ${salarioMin} - R$ ${salarioMax}
            </div>
            <div class="list-group-item">
                <strong>Descrição:</strong> ${truncateText(descricao, 100)}
            </div>
        </div>
    `;

    confirmDiv.innerHTML = html;
}
