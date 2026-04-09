// ============================================
// CONFIGURAÇÕES GLOBAIS - SINCRONIZA EM TODA APLICAÇÃO
// ============================================

class ConfigGlobal {
    constructor() {
        this.config = this.carregarConfig();
        this.inicializar();
    }

    // Carregar configurações do localStorage
    carregarConfig() {
        return JSON.parse(localStorage.getItem("siteConfig") || JSON.stringify({
            nomePlataforma: "CarreiraHub",
            descricao: "Plataforma de estágios e empregos para estudantes e empresas",
            emailSuporte: "suporte@careeirahub.com",
            telefoneSuporte: "+244 923 000 000"
        }));
    }

    // Inicializar - aplicar configurações
    inicializar() {
        this.aplicarConfig();

        // Ouvir eventos de atualização
        window.addEventListener("configUpdated", (e) => {
            this.config = e.detail;
            this.aplicarConfig();
        });

        // Sincronizar com localStorage quando mudar em outra aba
        window.addEventListener("storage", (e) => {
            if (e.key === "siteConfig") {
                this.config = JSON.parse(e.newValue);
                this.aplicarConfig();
            }
        });
    }

    // Aplicar as configurações na página
    aplicarConfig() {
        // Atualizar todas as navbar brands
        document.querySelectorAll(".navbar-brand").forEach(el => {
            el.textContent = this.config.nomePlataforma + " Admin";
        });

        // Atualizar título da página
        document.title = this.config.nomePlataforma + " - Painel Administrativo";

        // Atualizar qualquer elemento com id data-config-*
        document.querySelectorAll("[data-config]").forEach(el => {
            const key = el.getAttribute("data-config");
            if (this.config[key]) {
                el.textContent = this.config[key];
            }
        });
    }

    // Obter uma configuração
    get(key) {
        return this.config[key];
    }

    // Atualizar uma configuração
    set(key, value) {
        this.config[key] = value;
        localStorage.setItem("siteConfig", JSON.stringify(this.config));
        window.dispatchEvent(new CustomEvent("configUpdated", { detail: this.config }));
    }
}

// Inicializar na página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const configGlobal = new ConfigGlobal();
    });
} else {
    const configGlobal = new ConfigGlobal();
}
