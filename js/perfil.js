// ============================================
// PERFIL - USER PROFILE PAGE
// ============================================

class PerfilManager {

    constructor() {
        this.idStudent = localStorage.getItem("idStudent");
        this.userType = "student";
        this.init();
    }

    init() {

        if (!this.idStudent) {
            window.location.href = "login.html";
            return;
        }

        this.loadUserData();
        this.setupTabNavigation();
        this.adjustUIForUserType();
    }

    /**
     * Buscar dados do estudante na API
     */
    async loadUserData() {

        try {

            const response = await fetch(`http://127.0.0.1:3000/students/${this.idStudent}`);
            const student = await response.json();

            console.log("Student:", student);

            // Sidebar
            document.getElementById("nomePerfilDisplay").textContent = student.fullName;
            document.getElementById("profissaoDisplay").textContent = "Estudante";

            // Informações pessoais
            document.getElementById("displayNomeCompleto").textContent = student.fullName;
            document.getElementById("displayEmail").textContent = student.email;
            document.getElementById("displayTelefone").textContent = student.telphone;
            document.getElementById("displayCPF").textContent = student.nif;

            // Acadêmico
            document.getElementById("displayEscola").textContent = student.school;
            document.getElementById("displaySerie").textContent = student.year;
            document.getElementById("displayTurno").textContent = student.turno;

            // =============================
            // Áreas de Interesse
            // =============================

            const interessesContainer = document.getElementById("interessesDisplay");
            interessesContainer.innerHTML = "";

            if (student.areaInterest) {

                const areas = student.areaInterest.split(",");

                areas.forEach(area => {

                    const badge = document.createElement("span");
                    badge.className = "badge bg-primary me-2";
                    badge.textContent = area.trim();

                    interessesContainer.appendChild(badge);

                });

            }

            // =============================
            // Habilidades
            // =============================

            const skillsContainer = document.getElementById("habilidadesDisplay");
            skillsContainer.innerHTML = "";

            if (student.skills) {

                const skills = student.skills.split(",");

                skills.forEach(skill => {

                    const badge = document.createElement("span");
                    badge.className = "badge bg-info me-2";
                    badge.textContent = skill.trim();

                    skillsContainer.appendChild(badge);

                });

            }

        } catch (error) {

            console.error("Erro ao carregar perfil:", error);

        }

    }

    /**
     * Setup navegação entre abas
     */
    setupTabNavigation() {

        const tabs = [
            { btn: "#tabInfoPessoal", content: "#infoPessoal" },
            { btn: "#tabCandidaturas", content: "#candidaturas" },
            { btn: "#tabVagasSalvas", content: "#vagasSalvas" },
            { btn: "#tabCandidatos", content: "#candidatos" },
            { btn: "#tabMinhasVagas", content: "#minhasVagas" }
        ];

        tabs.forEach(tab => {

            const btn = document.querySelector(tab.btn);

            if (btn) {

                btn.addEventListener("click", () => {

                    this.switchTab(tab.content);

                });

            }

        });

    }

    /**
     * Trocar abas
     */
    switchTab(contentSelector) {

        document.querySelectorAll(".list-group-item").forEach(btn => {
            btn.classList.remove("active");
        });

        document.querySelectorAll(".tab-content").forEach(content => {
            content.style.display = "none";
        });

        const activeBtn = document.querySelector(
            `${contentSelector.replace("#", "#tab")}`
        );

        if (activeBtn) {
            activeBtn.classList.add("active");
        }

        const activeContent = document.querySelector(contentSelector);

        if (activeContent) {
            activeContent.style.display = "block";
        }

    }

    /**
     * Ajustar UI conforme tipo de usuário
     */
    adjustUIForUserType() {

        if (this.userType === "student") {

            const tabCandidatos = document.getElementById("tabCandidatos");
            const tabMinhasVagas = document.getElementById("tabMinhasVagas");

            if (tabCandidatos) tabCandidatos.style.display = "none";
            if (tabMinhasVagas) tabMinhasVagas.style.display = "none";

        }

    }

}

/**
 * Inicializar perfil
 */
document.addEventListener("DOMContentLoaded", function () {

    new PerfilManager();

});