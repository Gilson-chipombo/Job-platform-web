// ============================================
// MAIN JAVASCRIPT - GLOBAL FUNCTIONS
// ============================================

/**
 * Mostrar notificação flutuante
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo: 'success', 'info', 'warning', 'danger'
 */
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    `;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto-remove após 4 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

/**
 * Validar CPF (simples)
 * @param {string} cpf - CPF a validar
 * @returns {boolean}
 */
function validarCPF(cpf) {
    const cpfClean = cpf.replace(/\D/g, '');
    return cpfClean.length === 11 && cpfClean !== cpfClean.charAt(0).repeat(11);
}

/**
 * Validar CNPJ (simples)
 * @param {string} cnpj - CNPJ a validar
 * @returns {boolean}
 */
function validarCNPJ(cnpj) {
    const cnpjClean = cnpj.replace(/\D/g, '');
    return cnpjClean.length === 14 && cnpjClean !== cnpjClean.charAt(0).repeat(14);
}

/**
 * Salvar dados no localStorage (simulação de sessão)
 * @param {string} key - Chave
 * @param {any} value - Valor
 */
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Obter nome da localização
 * @param {string} localizacao - Código localização
 * @returns {string}
 */
function getLocalizacaoName(localizacao) {
    const localizacoes = {
        'luanda': 'Luanda, Angola',
        'luanda-centro': 'Luanda Centro, Angola',
        'luanda-kilamba': 'Kilamba Kiaxi, Angola',
        'luanda-viana': 'Viana, Angola',
        'luanda-cazenga': 'Cazenga, Angola',
        'remoto': 'Remoto'
    };
    return localizacoes[localizacao] || 'Localização desconhecida';
}

/**
 * Remover dados do localStorage
 * @param {string} key - Chave
 */
function removeData(key) {
    localStorage.removeItem(key);
}

/**
 * Logout - Simular saída
 */
function logout() {
    removeData('user');
    removeData('userType');
    showNotification('Você foi desconectado!', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

/**
 * Verificar se usuário está logado
 * @returns {boolean}
 */
function isLoggedIn() {
    return getData('user') !== null;
}

/**
 * Obter tipo de usuário logado
 * @returns {string} - 'student', 'company' ou null
 */
function getUserType() {
    return getData('userType');
}

/**
 * Obter dados do usuário logado
 * @returns {object}
 */
function getCurrentUser() {
    return getData('user');
}

/**
 * Formatar data (DD/MM/YYYY)
 * @param {Date} date - Data
 * @returns {string}
 */
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Formatar moeda (Real ou Kwanzas)
 * @param {number} value - Valor
 * @param {string} currency - Moeda: 'BRL' ou 'KZS'
 * @returns {string}
 */
function formatCurrency(value, currency = 'BRL') {
    if (!value && value !== 0) return '';
    
    const currencyMap = {
        'BRL': { code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
        'KZS': { code: 'AOA', symbol: 'Kzs', locale: 'pt-BR' }
    };
    
    const config = currencyMap[currency] || currencyMap['BRL'];
    
    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.code
    }).format(value);
}

/**
 * Truncar texto
 * @param {string} text - Texto
 * @param {number} length - Comprimento máximo
 * @returns {string}
 */
function truncateText(text, length = 100) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

/**
 * Animar scroll para elemento
 * @param {string} selector - Seletor CSS
 */
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Debounce function para performance
 * @param {function} func - Função
 * @param {number} wait - Tempo em ms
 * @returns {function}
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Dados fictícios de vagas
 */
const vagasData = [
    {
        id: 1,
        titulo: 'Desenvolvedor Frontend Jr.',
        empresa: 'Tech Innovations',
        tipo: 'estagio',
        localizacao: 'luanda',
        salario_min: 120000,
        salario_max: 180000,
        currency: 'KZS',
        experiencia: 'junior',
        descricao: 'Estamos procurando um desenvolvedor frontend júnior entusiasmado para se juntar à nossa equipe. Você trabalhará em projetos modernos usando React e JavaScript.',
        responsabilidades: [
            'Desenvolver interfaces de usuário responsivas',
            'Colaborar com designers e backend',
            'Otimizar performance das aplicações',
            'Participar de code reviews'
        ],
        requisitos: [
            'Conhecimento em JavaScript e React',
            'HTML5 e CSS3',
            'Git básico',
            'Comunicação em português fluente'
        ],
        skills: ['React', 'JavaScript', 'CSS', 'HTML5', 'Git'],
        beneficios: ['Vale transporte', 'Vale refeição', 'Flexibilidade de horário'],
        sobreEmpresa: 'Tech Innovations é uma empresa de tecnologia focada em soluções inovadoras para empresas.'
    },
    {
        id: 2,
        titulo: 'Analista de Dados Jr.',
        empresa: 'FinanceHub',
        tipo: 'emprego',
        localizacao: 'luanda',
        salario_min: 150000,
        salario_max: 210000,
        currency: 'KZS',
        experiencia: 'junior',
        descricao: 'Procuramos um analista de dados com habilidades em Python e SQL para análise e visualização de dados.',
        responsabilidades: [
            'Analisar grandes volumes de dados',
            'Criar relatórios e dashboards',
            'Otimizar queries SQL',
            'Contribuir para projetos de BI'
        ],
        requisitos: [
            'Python ou R',
            'SQL avançado',
            'Excel avançado',
            'Conhecimento básico de BI'
        ],
        skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Data Analysis'],
        beneficios: ['Plano de saúde', 'Vale refeição', 'Bônus anual'],
        sobreEmpresa: 'FinanceHub é líder em soluções financeiras e análise de dados.'
    },
    {
        id: 3,
        titulo: 'Estagiário de Marketing',
        empresa: 'Digital Solutions',
        tipo: 'estagio',
        localizacao: 'luanda',
        salario_min: 90000,
        salario_max: 120000,
        currency: 'KZS',
        experiencia: 'estagiario',
        descricao: 'Estágio em Marketing Digital com oportunidade de aprender sobre social media, SEO e campanhas.',
        responsabilidades: [
            'Gerenciar redes sociais',
            'Criar conteúdo para blog',
            'Auxiliar em campanhas de marketing',
            'Analisar métricas'
        ],
        requisitos: [
            'Conhecimento em marketing digital',
            'Redes sociais',
            'Comunicação escrita',
            'Disponibilidade para estágio'
        ],
        skills: ['Social Media', 'Content Marketing', 'SEO', 'Copywriting'],
        beneficios: ['Vale transporte', 'Horário flexível', 'Mentoria'],
        sobreEmpresa: 'Digital Solutions especializada em marketing digital e presença online.'
    },
    {
        id: 4,
        titulo: 'Designer Gráfico Jr.',
        empresa: 'Creative Studio',
        tipo: 'emprego',
        localizacao: 'remoto',
        salario_min: 132000,
        salario_max: 192000,
        currency: 'KZS',
        experiencia: 'junior',
        descricao: 'Procuramos designer gráfico criativo para trabalhar em projetos de branding e design digital.',
        responsabilidades: [
            'Criar designs para web e print',
            'Desenvolver identidades visuais',
            'Editar vídeos e imagens',
            'Apresentar conceitos ao cliente'
        ],
        requisitos: [
            'Domínio de Figma ou Adobe XD',
            'Conhecimento em Photoshop e Illustrator',
            'Portfolio com trabalhos',
            'Inglês básico'
        ],
        skills: ['Figma', 'Photoshop', 'Illustrator', 'UI/UX Design'],
        beneficios: ['100% remoto', 'Equipamento fornecido', 'Cursos gratuitos'],
        sobreEmpresa: 'Creative Studio é estúdio de design focado em criatividade e inovação.'
    },
    {
        id: 5,
        titulo: 'Desenvolvedor Backend Python',
        empresa: 'TechCorp Solutions',
        tipo: 'emprego',
        localizacao: 'luanda',
        salario_min: 210000,
        salario_max: 300000,
        currency: 'KZS',
        experiencia: 'pleno',
        descricao: 'Buscamos desenvolvedor backend com experiência em Python e arquitetura de microsserviços.',
        responsabilidades: [
            'Desenvolver APIs REST',
            'Otimizar performance do backend',
            'Implementar testes automatizados',
            'Mentorizar desenvolvedores juniores'
        ],
        requisitos: [
            'Python avançado',
            'Django ou FastAPI',
            'PostgreSQL',
            '3+ anos de experiência'
        ],
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis'],
        beneficios: ['Salário competitivo', 'Stock options', 'Desenvolvimento profissional'],
        sobreEmpresa: 'TechCorp Solutions é empresa de tecnologia com soluções enterprise.'
    },
    {
        id: 6,
        titulo: 'Assistente de RH',
        empresa: 'Recursos Humanos Plus',
        tipo: 'emprego',
        localizacao: 'luanda',
        salario_min: 120000,
        salario_max: 168000,
        currency: 'KZS',
        experiencia: 'junior',
        descricao: 'Auxiliar na gestão de recrutamento, onboarding e desenvolvimento de talentos.',
        responsabilidades: [
            'Triagem de currículos',
            'Agendar entrevistas',
            'Onboarding de novos colaboradores',
            'Administrar folha de pagamento'
        ],
        requisitos: [
            'Graduado em RH ou áreas similares',
            'Excel intermediário',
            'Excelente comunicação',
            'Organização impecável'
        ],
        skills: ['Recrutamento', 'Excel', 'Comunicação', 'Organização'],
        beneficios: ['Vale refeição', 'Vale transporte', 'Treinamentos'],
        sobreEmpresa: 'Recursos Humanos Plus oferece consultoria em gestão de pessoas.',
        currency: 'BRL'
    },
    {
        id: 7,
        titulo: 'Estagiário de Desenvolvimento Web',
        empresa: 'Startup CodeMinds',
        tipo: 'estagio',
        localizacao: 'remoto',
        salario_min: 0,
        salario_max: 0,
        experiencia: 'estagiario',
        descricao: 'Estágio não remunerado com foco em experiência prática, certificado ao final e possibilidade de contratação.',
        responsabilidades: [
            'Desenvolver páginas web responsivas',
            'Aprender novas tecnologias',
            'Contribuir para projetos open source',
            'Participar de workshops e palestras'
        ],
        requisitos: [
            'Conhecimento em HTML, CSS, JavaScript',
            'Motivação para aprender',
            'Disponibilidade 4-6 horas/semana',
            'Interesse em web development'
        ],
        skills: ['HTML', 'CSS', 'JavaScript', 'Web Development'],
        beneficios: ['Certificado de conclusão', 'Mentoria profissional', 'Experiência real', 'Networking'],
        sobreEmpresa: 'Startup CodeMinds é uma startup focada em educação e desenvolvimento de talentos.',
        isPaid: false
    },
    {
        id: 8,
        titulo: 'Estagiário de UI/UX Design',
        empresa: 'Design Academy',
        tipo: 'estagio',
        localizacao: 'luanda',
        salario_min: 0,
        salario_max: 0,
        experiencia: 'estagiario',
        descricao: 'Oportunidade de estágio não remunerado em design com certificação profissional e portfolio building.',
        responsabilidades: [
            'Criar protótipos e wireframes',
            'Pesquisar experiência do usuário',
            'Documentar processos de design',
            'Feedback com mentores'
        ],
        requisitos: [
            'Conhecimento em Figma',
            'Portfolio com trabalhos',
            'Paixão por design',
            'Disponibilidade para o programa'
        ],
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        beneficios: ['Certificado profissional', 'Portfolio boost', 'Experiência em projetos reais', 'Mentoria 1:1'],
        sobreEmpresa: 'Design Academy é uma academia de design focada em formar novos talentos.',
        isPaid: false
    },
    {
        id: 9,
        titulo: 'Estagiário de Análise de Negócios',
        empresa: 'Business Insights',
        tipo: 'estagio',
        localizacao: 'remoto',
        salario_min: 0,
        salario_max: 0,
        experiencia: 'estagiario',
        descricao: 'Estágio não remunerado para estudar análise de negócios com certificado ao final.',
        responsabilidades: [
            'Analisar modelos de negócio',
            'Criar relatórios e apresentações',
            'Pesquisar mercado',
            'Estudar casos de sucesso'
        ],
        requisitos: [
            'Graduação em andamento',
            'Excel básico',
            'Pensamento analítico',
            'Comunicação clara'
        ],
        skills: ['Análise de negócios', 'Excel', 'Pesquisa', 'Apresentações'],
        beneficios: ['Certificado de conclusão', 'Conhecimento prático', 'Rede profissional', 'Recomendação'],
        sobreEmpresa: 'Business Insights é consultoria especializada em análise e estratégia de negócios.',
        isPaid: false
    },
    {
        id: 10,
        titulo: 'Estagiário de Marketing e Social Media',
        empresa: 'Digital Growth Lab',
        tipo: 'estagio',
        localizacao: 'luanda',
        salario_min: 72000,
        salario_max: 108000,
        currency: 'KZS',
        experiencia: 'estagiario',
        descricao: 'Estágio remunerado em marketing digital com oportunidade de aprendizado prático e contatos valiosos.',
        responsabilidades: [
            'Gerenciar redes sociais',
            'Criar calendário editorial',
            'Analisar métricas',
            'Executar campanhas'
        ],
        requisitos: [
            'Conhecimento em marketing digital',
            'Criatividade',
            'Disponibilidade',
            'Comunicação escrita forte'
        ],
        skills: ['Social Media', 'Marketing Digital', 'Copywriting', 'Analytics'],
        beneficios: ['Remuneração', 'Vale transporte', 'Networking', 'Experiência real'],
        sobreEmpresa: 'Digital Growth Lab é agência especializada em crescimento digital.',
        currency: 'KZS'
    }
];

/**
 * Inicializar tooltips do Bootstrap
 */
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
});

/**
 * Função getData para obter dados do localStorage
 * @param {string} key - Chave
 * @returns {any} - Valor
 */
function getData(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}
