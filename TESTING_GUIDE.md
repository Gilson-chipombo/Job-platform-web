# Guia de Testes - CarreiraHub

## Testes de Autenticação e Funcionalidade

### 1. Teste de Login e Token

**Passos:**
1. Abra `login.html`
2. Insira um email válido e qualquer senha
3. Clique em "Entrar" (Estudante ou Empresa)
4. Verifique no console se o token foi gerado

**Verificação:**
```javascript
// No console do navegador (F12):
console.log(authManager.getToken()); // Deve mostrar o token
console.log(authManager.isLoggedIn()); // Deve ser true
console.log(authManager.getAuthData()); // Deve mostrar dados com token
```

**Resultado Esperado:** Redirecionamento para a página de perfil

---

### 2. Teste de Navbar Dinâmica

**Passos:**
1. Acesse `index.html` sem estar logado
2. Verifique navbar - deve ter "Login" e "Registrar"
3. Acesse `login.html` e faça login
4. Volte para `index.html` (abra em nova aba)
5. Navbar deve mostrar nome do usuário com dropdown

**Verificação:**
- Sem login: Botões "Login" e "Registrar" visíveis
- Com login: Dropdown com nome do usuário e "Sair"

---

### 3. Teste de Verificação de Token Expirado

**Passos:**
1. Faça login normalmente
2. Abra DevTools (F12) → Console
3. Execute:
```javascript
// Forçar expiração do token
const now = new Date().getTime();
localStorage.setItem('tokenExpiry', (now - 1000).toString());
```
4. Recarregue a página
5. Tente acessar uma página protegida

**Resultado Esperado:** Redirecionamento para login.html

---

### 4. Teste de Logout

**Passos:**
1. Faça login
2. Clique no menu de usuário (dropdown na navbar)
3. Clique em "Sair"
4. Verifique localStorage

**Verificação:**
```javascript
// No console:
console.log(localStorage.getItem('user')); // Deve ser null
console.log(localStorage.getItem('authToken')); // Deve ser null
console.log(authManager.isLoggedIn()); // Deve ser false
```

---

### 5. Teste de Painel Admin

**Passos:**
1. Acesse `admin/pages/login-admin.html`
2. Insira admin@careeirahub.com e qualquer senha
3. Clique "Entrar"
4. Verifique dashboard

**Resultado Esperado:**
- Navbar com cor #1A3960 (azul escuro)
- Sidebar com icons bootstrap
- Cards de estatísticas com cor de fundo #fef5f4
- Dropdown com nome "Administrador"

**Verificação de Autenticação Admin:**
```javascript
// No console do painel admin:
console.log(adminAuth.isAuthenticated()); // Deve ser true
console.log(adminAuth.getAdminToken()); // Deve mostrar token
console.log(adminAuth.getAdminName()); // Deve mostrar "Administrador"
```

---

### 6. Teste de Cores

**Página Principal (index.html):**
- Logo/Brand em navbar: cor padrão (texto)
- Botão "Ver Vagas": fundo #E21912 (vermelho)
- Botão "Criar Conta": fundo #1A3960 (azul escuro)
- Background geral: #f5f5f5 (cinza claro)
- Footer: #1A3960 (azul escuro)

**Painel Admin:**
- Navbar: #1A3960 (azul escuro) - SEM gradients
- Buttons primários: #E21912 (vermelho)
- Stat cards background: #fef5f4 (rosa muito claro)
- Tables header: #fef5f4 (rosa muito claro)

**Verificação CSS:**
```javascript
// No console:
const btn = document.querySelector('.btn-primary');
const styles = window.getComputedStyle(btn);
console.log(styles.backgroundColor); // rgb(226, 25, 18) = #E21912
```

---

### 7. Teste de Icons Bootstrap

**Verificar presença de icons em:**
- ✓ Navbar brand (briefcase)
- ✓ Login/Logout buttons
- ✓ Dropdown menus (person, building, etc)
- ✓ Admin sidebar (speedometer, badge, building, etc)
- ✓ Forms (validation icons)
- ✓ Alerts/Notifications

**Verificação:**
```javascript
// No console:
const icons = document.querySelectorAll('[class*="bi-"]');
console.log(`Total de icons: ${icons.length}`);
icons.forEach(icon => console.log(icon.className));
```

---

### 8. Teste de Proteção de Rotas

**Páginas Protegidas** (data-require-auth="true"):
- `perfil.html`
- `minhas-candidaturas.html` (estudante)
- `vagas-salvas.html`
- Páginas admin

**Passos:**
1. Tente acessar `perfil.html` sem estar logado
2. Deve aparecer notificação "Você precisa estar logado..."
3. Deve redirecionar para `login.html` em 1.5 segundos

---

### 9. Teste de Navegação Entre Páginas

**Fluxo Completo:**
1. Acesse `index.html`
2. Clique "Ver Vagas" → `vagas.html`
3. Clique em uma vaga → `detalhes-vaga.html`
4. Clique "Candidatar-se" → deve redirecionar para login se não logado
5. Faça login → `escolher-conta.html` → `cadastro-estudante.html`
6. Complete cadastro → `perfil.html`
7. Acesse "Minhas Vagas Salvas" → `vagas-salvas.html`

**Resultado Esperado:** Navegação suave sem erros

---

### 10. Teste Responsivo

**Mobile (max-width: 768px):**
- Navbar toggler funciona
- Sidebar admin colapse/expand
- Cards em 1 coluna
- Tables com scroll horizontal
- Botões full-width em mobile

**Desktop (min-width: 1024px):**
- Layout 2 colunas em grids
- Sidebar admin sticky
- Navbar expansão completa
- Tabelas com múltiplas colunas visíveis

---

## Checklist Final

- [ ] Cores: Vermelho #E21912 e Azul #1A3960 aplicados corretamente
- [ ] Sem gradients: `linear-gradient` removido de todos os elementos
- [ ] Icons Bootstrap: Presentes em navbar, buttons, menus
- [ ] Autenticação: Token gerado, validado e expirado corretamente
- [ ] Navbar: Dinâmica baseada em isLoggedIn()
- [ ] Admin Panel: Profissional com nova paleta
- [ ] Logout: Limpa tokens e redirect para index.html
- [ ] Rotas Protegidas: Verificam autenticação antes de carregar
- [ ] Responsivo: Funciona em mobile e desktop
- [ ] Compatibilidade: Código antigo mantém compatibilidade

---

## Troubleshooting

### Token não aparece
```javascript
// Verifique:
localStorage.getItem('authToken') // Deve ter valor
localStorage.getItem('tokenExpiry') // Deve ter timestamp
```

### Navbar não atualiza após login
```javascript
// Force reload:
location.reload(); // Ou
new NavbarManager(); // Reinicializa
```

### Cores não mudam
```javascript
// Verifique CSS:
:root {
    --primary-color: #E21912;
    --secondary-color: #1A3960;
}
```

### Admin não acessa dashboard
```javascript
// Verifique:
localStorage.getItem('adminRole') // Deve ser 'admin'
adminAuth.isAuthenticated() // Deve ser true
```

---

**Última Atualização:** 16 de Março de 2026  
**Status:** Pronto para Testes
