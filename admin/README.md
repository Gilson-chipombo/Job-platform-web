# 🛡️ PAINEL ADMINISTRATIVO - CarreiraHub

Sistema de gerenciamento administrativo para controle de usuários da plataforma CarreiraHub.

---

## 📋 Estrutura do Painel

```
painel/
├── pages/                    # Páginas HTML
│   ├── login-admin.html     # Login administrativo
│   ├── dashboard.html       # Dashboard/Página inicial
│   ├── usuarios.html        # Gerenciamento de usuários
│   ├── perfil-admin.html    # Perfil do administrador
│   └── configuracoes.html   # Configurações do sistema
│
├── js/                       # Scripts JavaScript
│   ├── auth-painel.js       # Autenticação do admin
│   └── usuarios-manager.js  # Gerenciador de usuários
│
├── css/                      # Estilos
│   └── painel-styles.css    # CSS do painel
│
└── README.md                 # Este arquivo
```

---

## 🔑 Credenciais de Acesso

**Para acessar o painel administrativo:**

- **Usuário:** `admin`
- **Senha:** `admin123`

> ⚠️ **IMPORTANTE:** Em produção, alterar IMEDIATAMENTE as credenciais padrão!

---

## 🚀 Como Acessar

1. Acesse: `http://localhost/painel/pages/login-admin.html`
2. Use as credenciais acima
3. Você será redirecionado para o dashboard

---

## 📊 Funcionalidades Principais

### 1. **Dashboard**
- Visão geral do sistema
- Estatísticas de usuários
- Últimos registros pendentes de aprovação
- Links rápidos para ações comuns

### 2. **Gerenciamento de Usuários**
- Listar todos os usuários (estudantes e empresas)
- Filtrar por:
  - Tipo (estudante/empresa)
  - Status (aprovado/pendente/rejeitado)
  - Bloqueio (bloqueado/ativo)
- Buscar por nome, email ou telefone
- Aprovar/rejeitar usuários pendentes
- Bloquear/desbloquear contas
- Ver detalhes do usuário

### 3. **Filtros de Usuários**
- **Por Tipo:** Estudante ou Empresa
- **Por Status:** 
  - ✅ Aprovado
  - ⏳ Pendente
  - ❌ Rejeitado
- **Por Bloqueio:** Ativos ou Bloqueados

### 4. **Perfil do Admin**
- Informações pessoais
- Alterar senha
- Histórico de atividades
- Status de acesso

### 5. **Configurações**
- Configurações gerais da plataforma
- Políticas de aprovação
- Segurança (2FA, sessões, etc.)
- Informações do sistema
- Backup e sincronização

---

## 👥 Estados dos Usuários

### Status
- **Aprovado** ✅ - Usuário aprovado, pode usar a plataforma
- **Pendente** ⏳ - Aguardando aprovação do admin
- **Rejeitado** ❌ - Cadastro rejeitado

### Bloqueio
- **Bloqueado** 🔒 - Usuário bloqueado, não pode acessar
- **Ativo** 🔓 - Usuário ativo, pode acessar normalmente

---

## 📈 Fluxo de Aprovação

```
Novo Usuário Registra
        ↓
   Status: Pendente
        ↓
   Admin Revisa
        ↓
   ┌───┴───┐
   ↓       ↓
Aprovado  Rejeitado
   ↓       ↓
Ativo  Bloqueado
```

---

## 🔐 Segurança

### Proteção Implementada
- Verificação de autenticação em todas as páginas
- Redirecionamento automático para login se desautenticado
- localStorage para armazenamento seguro
- Roles (Admin)

### Recomendações
1. **Mudar credenciais padrão** em produção
2. **Usar HTTPS** para todas as conexões
3. **Implementar JWT** para tokens de sessão
4. **Validar no backend** todas as ações do admin
5. **Logs de auditoria** para todas as ações administrativas

---

## 💾 Armazenamento de Dados

### localStorage Keys
- `admin` - Dados do admin autenticado
- `adminRole` - Função do admin ('admin')
- `adminToken` - Token de sessão
- `painel_users` - Lista de usuários gerenciados

### Estrutura do Usuário
```javascript
{
  id: 1,
  nome: "João Silva",
  email: "joao@example.com",
  tipo: "estudante" | "empresa",
  telefone: "923456789",
  status: "aprovado" | "pendente" | "rejeitado",
  dataCadastr: "2026-02-15",
  bloqueado: false,
  escola: "Universidade ABC" // para estudantes
  segmento: "Tecnologia" // para empresas
}
```

---

## 🎨 Paleta de Cores

- **Primário:** #0d6efd (Azul)
- **Sucesso:** #198754 (Verde)
- **Perigo:** #dc3545 (Vermelho)
- **Aviso:** #ffc107 (Amarelo)
- **Informação:** #0dcaf0 (Ciano)
- **Secundário:** #6c757d (Cinzento)

---

## 📱 Responsividade

O painel é totalmente responsivo:
- Desktop (≥768px) - Sidebar estável
- Tablet (≥768px) - Sidebar colapsável
- Mobile (<768px) - Sidebar hamburger menu

---

## 🔧 Extensões Futuras

1. **Auditoria completa** - Log de todas as ações
2. **Relatórios** - Gráficos e estatísticas avançadas
3. **Notificações** - Sistema de alerts real-time
4. **Integração com Backend** - API REST
5. **2FA** - Autenticação de dois fatores
6. **Múltiplos Admins** - Com diferentes permissões
7. **Email** - Notificação de aprovação/rejeição
8. **Moderação** - Denúncias e revisões de conteúdo

---

## ⚠️ Limitações Atuais

- Usa localStorage (não persistente em longo prazo)
- Sem autenticação real no backend
- Sem logs de auditoria
- Sem notificações por email
- Sem 2FA
- Lista de usuários simulada para demo

---

## 📞 Suporte

Para dúvidas ou bugs, contate:
- **Email:** suporte@careeirahub.com
- **Telefone:** +244 923 000 000

---

**Última Atualização:** 15 de Fevereiro de 2026
**Versão:** 1.0.0
**Status:** ✅ Desenvolvimento Completo
