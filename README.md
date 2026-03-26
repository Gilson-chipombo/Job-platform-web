# VagasAo - Plataforma de Estágios e Empregos

Uma plataforma web profissional de estágios e empregos voltada para estudantes que concluíram o Ensino Médio e Ensino Superio.

## 📋 Descrição

VagasAo é uma aplicação frontend-only que permite:
- **Estudantes**: Criar conta, visualizar vagas e se candidatar
- **Empresas**: Cadastrar vagas e visualizar candidatos

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Styling responsivo
- **JavaScript Puro (Vanilla JS)** - Interatividade e lógica
- **Bootstrap 5** - Framework CSS para componentes
- **Font Awesome 6** - Ícones

## 📁 Estrutura de Pastas

```
/public
├── index.html                 # Página inicial
├── login.html                # Login para estudantes e empresas
├── cadastro-estudante.html   # Cadastro de estudante (wizard)
├── cadastro-empresa.html     # Cadastro de empresa (wizard)
├── vagas.html                # Listagem de vagas com filtros
├── detalhes-vaga.html        # Detalhes da vaga e candidatura
├── publicar-vaga.html        # Publicação de nova vaga (wizard)
├── perfil.html               # Perfil do usuário
│
├── css/
│   └── styles.css            # Estilos globais e personalizações
│
└── js/
    ├── main.js               # Funções globais e dados fictícios
    ├── wizard.js             # Gerenciador de formulários multi-etapa
    ├── vagas.js              # Gerenciador de listagem e filtros de vagas
    ├── detalhes-vaga.js      # Lógica da página de detalhes da vaga
    ├── publicar-vaga.js      # Lógica de publicação de vaga
    └── perfil.js             # Lógica do perfil do usuário
```

## 🚀 Funcionalidades

### Home Page
- Hero section com call-to-action
- Estatísticas da plataforma
- Vagas em destaque
- Empresas parceiras
- Footer com links úteis

### Autenticação
- Login com abas para estudante/empresa
- Validação frontend
- Simulação de sessão com localStorage

### Cadastro
- Wizard de 3 etapas para estudantes
- Wizard de 3 etapas para empresas
- Validação em tempo real
- Confirmação de dados antes do envio

### Vagas
- Listagem com filtros por:
  - Tipo (estágio, emprego, freelance)
  - Localização
  - Busca por texto
- Cards responsivos com informações principais
- Link para detalhes da vaga

### Detalhes da Vaga
- Informações completas da vaga
- Descrição, responsabilidades e requisitos
- Skills necessárias e benefícios
- Botão para candidatura (com modal)
- Sistema de favoritos
- Informações da empresa

### Perfil do Usuário
- Visualização de informações pessoais
- Minhas candidaturas (com status)
- Vagas salvas (favoritos)
- Para empresas: candidatos e vagas publicadas
- Navegação por abas

### Publicação de Vaga
- Wizard de 3 etapas
- Validação de salários
- Confirmação antes da publicação
- Acesso exclusivo para empresas

## 💾 Armazenamento de Dados

Todos os dados são armazenados em **localStorage** para simular uma sessão:
- Dados do usuário logado
- Tipo de usuário (estudante/empresa)
- Candidaturas realizadas
- Vagas favoritas

## 🎨 Design

- **Mobile First**: Layout otimizado para mobile
- **Responsivo**: Funciona em todos os tamanhos de tela
- **Moderno e Profissional**: Design clean com gradientes
- **Acessível**: Semântica HTML adequada e ARIA labels
- **Cores**: Paleta consistente com primária (#667eea)

## 📱 Responsividade

- Desktop: Layout completo com sidebar
- Tablet: Adaptação de colunas
- Mobile: Stack vertical, menu hamburger

## ✨ Destaques

- ✅ Formulários com validação
- ✅ Modais intermodais para ações importantes
- ✅ Notificações flutuantes
- ✅ Sistema de filtros funcionais
- ✅ Busca em tempo real
- ✅ Favoritos/Salvos
- ✅ Multi-step forms com progresso visual
- ✅ Dados fictícios realistas
- ✅ Bootstrap Tooltips e Popovers
- ✅ Animações suaves

## 🎯 Próximas Etapas (Backend)

Para transformar isso em produção:
1. Implementar backend com Node.js/Python/etc
2. Criar banco de dados (PostgreSQL/MongoDB)
3. Implementar autenticação real (JWT)
4. Integrar email para notificações
5. Implementar dashboard de empresas
6. Adicionar sistema de recomendações
7. Deploy em servidor

## 👨‍💻 Como Usar

1. Abra `index.html` em um navegador
2. Explore a página inicial
3. Crie uma conta (dados simulados)
4. Visualize e filtre vagas
5. Candidiate-se a uma vaga
6. Acesse seu perfil

## 📝 Notas

- Todos os dados são fictícios e armazenados localmente
- Sem conexão real com servidor
- Ideal para prototipagem e demonstração
- Pronto para integração com backend

## 📄 Licença

Projeto educacional - Use livremente!
