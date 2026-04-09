// ============================================
// GERENCIADOR DE USUÁRIOS DO PAINEL (COM API)
// ============================================

class UserManager {
    constructor() {
        this.users = [];
        this.API = "http://127.0.0.1:3000";
    }

    // ===============================
    // BUSCAR DADOS DA API
    // ===============================

    async loadUsers() {
        try {

            const [studentsRes, companiesRes] = await Promise.all([
                fetch(`${this.API}/students`),
                fetch(`${this.API}/companies`)
            ]);

            if (!studentsRes.ok || !companiesRes.ok) {
                throw new Error("Erro ao buscar dados da API");
            }

            const students = await studentsRes.json();
            const companies = await companiesRes.json();

            // ===============================
            // FORMATAR ESTUDANTES
            // ===============================

            const estudantes = students.map(s => ({
                id: s.id,
                nome: s.fullName || "Sem nome",
                email: s.email || "-",
                tipo: "estudante",
                telefone: s.telphone ? String(s.telphone) : "-",
                status: (s.state || "pendente").toLowerCase(),
                dataCadastr: s.createdAt || new Date(),
                escola: s.school || "-",
                skills: s.skills || "-",
                bloqueado: false
            }));

            // ===============================
            // FORMATAR EMPRESAS
            // ===============================

            const empresas = companies.map(c => ({
                id: 10000 + c.id, // evitar colisão com estudantes
                nome: c.name || "Empresa",
                email: c.email || "-",
                tipo: "empresa",
                telefone: c.telphone ? String(c.telphone) : "-",
                status: (c.state || "pendente").toLowerCase(),
                dataCadastr: c.createdAt || new Date(),
                segmento: c.segment || "-",
                bloqueado: false
            }));

            this.users = [...estudantes, ...empresas];

            return this.users;

        } catch (error) {

            console.error("Erro ao carregar usuários:", error);

            this.users = [];

            return [];

        }
    }

    // ===============================
    // GETTERS
    // ===============================

    getAllUsers() {
        return this.users;
    }

    getUserById(id) {
        return this.users.find(u => u.id === id);
    }

    // ===============================
    // APROVAR USUÁRIO
    // ===============================

    async approveUser(id, tipo) {

        //const user = this.getUserById(id);
        //if (!user) return false;

        try {

            if (tipo === "Estudante") {

                const res = await fetch(`${this.API}/students/approve/${id}`, {
                    method: "PUT"
                });

                if (!res.ok) throw new Error("Erro ao aprovar estudante");

            } else {

                const companyId = id - 10000;

                const res = await fetch(`${this.API}/companies/approve/${companyId}`, {
                    method: "PUT"
                });

                if (!res.ok) throw new Error("Erro ao aprovar empresa");

            }

            //user.status = "aprovado";

            return true;

        } catch (err) {

            console.error("Erro ao aprovar:", err);

            return false;

        }
    }

    // ===============================
    // REJEITAR USUÁRIO
    // ===============================

    async rejectUser(id, tipo) {

        //const user = this.getUserById(id);
        //if (!user) return false;

        try {

            if (tipo === "Estudante") {

                const res = await fetch(`${this.API}/students/reject/${id}`, {
                    method: "PUT"
                });

                if (!res.ok) throw new Error("Erro ao rejeitar estudante");

            } else {

                const companyId = id - 10000;

                const res = await fetch(`${this.API}/companies/reject/${companyId}`, {
                    method: "PUT"
                });

                if (!res.ok) throw new Error("Erro ao rejeitar empresa");

            }

            //user.status = "rejeitado";

            return true;

        } catch (err) {

            console.error("Erro ao rejeitar:", err);

            return false;

        }
    }

    // ===============================
    // BLOQUEAR USUÁRIO
    // ===============================

    blockUser(id) {

        const user = this.getUserById(id);

        if (!user) return false;

        user.bloqueado = true;

        return true;
    }

    // ===============================
    // DESBLOQUEAR USUÁRIO
    // ===============================

    unblockUser(id) {

        const user = this.getUserById(id);

        if (!user) return false;

        user.bloqueado = false;

        return true;
    }

    // ===============================
    // PESQUISA
    // ===============================

    searchUsers(query) {

        const q = query.toLowerCase();

        return this.users.filter(u =>
            u.nome.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.telefone && u.telefone.includes(q))
        );

    }
}

// Instância global
const userManager = new UserManager();