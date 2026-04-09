// ============================================
// SINCRONIZADOR DE CONFIGURAÇÕES
// ============================================
// Carregue este arquivo em TODAS as páginas para sincronizar configurações

// Ouvir mudanças no localStorage (sincroniza entre abas/janelas)
window.addEventListener("storage", (e) => {
    if (e.key === "siteConfig") {
        // Recarregar a página para sincronizar as mudanças
        const evt = new CustomEvent("configUpdated", { 
            detail: JSON.parse(e.newValue) 
        });
        window.dispatchEvent(evt);
    }
});

// Carregar configurações ao iniciar
document.addEventListener("DOMContentLoaded", () => {
    const config = JSON.parse(localStorage.getItem("siteConfig") || JSON.stringify({
        nomePlataforma: "CarreiraHub",
        descricao: "Conecte-se com as melhores empresas e impulsione sua carreira profissional.",
        emailSuporte: "suporte@careeirahub.com",
        telefoneSuporte: "+244 923 000 000"
    }));
    
    // Aplicar configurações na página
    atualizarConfigurações(config);
    
    // Ouvir mudanças
    window.addEventListener("configUpdated", (e) => {
        atualizarConfigurações(e.detail);
    });
});

// Função para atualizar as configurações na página
function atualizarConfigurações(config) {
    // Atualizar descrição principal (index.html)
    const descricaoPrincipal = document.getElementById("descricaoPrincipal");
    if (descricaoPrincipal) {
        descricaoPrincipal.textContent = config.descricao;
    }
    
    // Atualizar email de contato
    const contatoEmail = document.getElementById("contatoEmail");
    if (contatoEmail) {
        contatoEmail.href = `mailto:${config.emailSuporte}`;
        contatoEmail.textContent = config.emailSuporte;
    }
    
    // Atualizar telefone de contato
    const contatoTelefone = document.getElementById("contatoTelefone");
    if (contatoTelefone) {
        contatoTelefone.href = `tel:${config.telefoneSuporte.replace(/\D/g, '')}`;
        contatoTelefone.textContent = config.telefoneSuporte;
    }
}
