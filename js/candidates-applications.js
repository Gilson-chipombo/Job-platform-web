// ============================================
// CANDIDATURAS - APLICAÇÕES DE VAGAS
// ============================================

class ApplicationsManager {

    constructor() {

        this.authManager = new AuthManager();

        this.applications = [];
        this.filteredApplications = [];

        this.statusFilter = ['análise','aceito','rejeitado'];
        this.searchTerm = '';

        this.init();
    }

    init(){

        if(!this.authManager.isLoggedIn()){
            this.redirectToLogin();
            return;
        }

        this.setupEventListeners();
        this.loadApplications();

    }

    redirectToLogin(){

        const container = document.getElementById('applicationsContainer');

        container.innerHTML = `
        <div class="alert alert-warning text-center py-5">

            <i class="bi bi-exclamation-triangle" style="font-size:40px"></i>

            <h5 class="mt-3">Você precisa estar logado</h5>

            <a href="login.html" class="btn btn-primary mt-3">
            Fazer Login
            </a>

        </div>`;
    }


    // ================================
    // CARREGAR CANDIDATURAS DA API
    // ================================
    async loadApplications(){

        try{

            const idStudent = localStorage.getItem("idStudent");

            if(!idStudent){
                console.error("ID do estudante não encontrado");
                return;
            }

            const response = await fetch(`http://127.0.0.1:3000/applies/student/${idStudent}`);

            const data = await response.json();

            this.applications = data.map(app => ({

                id: app.id,
                vagaTitulo: app.vaga.title,
                empresa: "Empresa",
                mensagem: app.description,
                status: this.normalizeStatus(app.status),
                data: app.createdAt,
                cv: app.cvPath,
                vaga: app.vaga

            }));

            this.renderApplications();

        }catch(error){

            console.error("Erro ao carregar candidaturas",error);

        }

    }


    normalizeStatus(status){

        if(status === "pendente") return "análise";
        if(status === "aceito") return "aceito";
        if(status === "rejeitado") return "rejeitado";

        return "análise";
    }


    // ================================
    // RENDERIZAR
    // ================================
    renderApplications(){

        const container = document.getElementById('applicationsContainer');

        if(!container) return;

        this.filteredApplications = this.applications.filter(app => {

            const matchesStatus = this.statusFilter.includes(app.status);

            const matchesSearch =
                !this.searchTerm ||
                app.vagaTitulo.toLowerCase().includes(this.searchTerm);

            return matchesStatus && matchesSearch;

        });

        if(this.filteredApplications.length === 0){

            container.innerHTML = `
            <div class="alert alert-info text-center py-5">

            <i class="bi bi-inbox" style="font-size:40px"></i>

            <h5 class="mt-3">Nenhuma candidatura encontrada</h5>

            <a href="vagas.html" class="btn btn-primary mt-3">
            Explorar vagas
            </a>

            </div>`;

            return;

        }

        let html = '<div class="row g-4">';

        this.filteredApplications.forEach(app => {

            const statusColor = this.getStatusColor(app.status);
            const statusText = this.getStatusText(app.status);

            const date = new Date(app.data).toLocaleDateString("pt-PT");

            html += `

            <div class="col-lg-6">

            <div class="card shadow-sm h-100">

            <div class="card-body">

            <div class="d-flex justify-content-between">

            <div>

            <h5>${app.vagaTitulo}</h5>

            <p class="text-muted small mb-1">

            <i class="bi bi-geo-alt"></i>
            ${app.vaga.location}

            </p>

            </div>

            <span class="badge bg-${statusColor}">
            ${statusText}
            </span>

            </div>


            <p class="small text-muted mt-2">
            <i class="bi bi-calendar"></i>
            Candidatado em ${date}
            </p>


            <p class="small">
            <strong>Mensagem enviada:</strong>
            </p>

            <p class="text-muted small">
            "${this.truncateMessage(app.mensagem,120)}"
            </p>


            <div class="d-flex gap-2 mt-3">

             <a class="btn btn-outline-primary btn-sm"
                href="detalhes-vaga.html?id=${app.vaga.id}?candidate=true"
                target="_blank">
                Detalhes da vaga
            </a>

            </button>


            <a class="btn btn-outline-success btn-sm"
                href="http://127.0.0.1:3000/uploads/cv/${app.cv}"
                target="_blank">

                <i class="bi bi-file-earmark-pdf"></i>
                Ver CV
            </a>

            <a class="btn btn-outline-danger btn-sm"
                onclick="cancelApplication(${app.id}, ${app.vaga.id})"
            >
               

                <i class="bi bi-x-circle"></i>
                Cancelar
            </a>

            </div>

            </div>

            </div>

            </div>

            `;

        });

        html += '</div>';

        container.innerHTML = html;

    }



    getStatusColor(status){

        if(status==="aceito") return "success";
        if(status==="rejeitado") return "danger";

        return "info";

    }


    getStatusText(status){

        if(status==="aceito") return "Aceito";
        if(status==="rejeitado") return "Rejeitado";

        return "Em análise";

    }


    truncateMessage(msg,length){

        if(msg.length>length){

            return msg.substring(0,length)+"...";

        }

        return msg;

    }


    // ================================
    // MODAL DETALHES
    // ================================
    viewApplication(appId){

        const app = this.applications.find(a=>a.id===appId);

        if(!app) return;

        const modal = document.createElement("div");

        modal.className="modal fade";

        modal.innerHTML = `

        <div class="modal-dialog">

        <div class="modal-content">

        <div class="modal-header">

        <h5 class="modal-title">${app.vagaTitulo}</h5>

        <button class="btn-close" data-bs-dismiss="modal"></button>

        </div>

        <div class="modal-body">

        <p><strong>Status:</strong>
        <span class="badge bg-${this.getStatusColor(app.status)}">
        ${this.getStatusText(app.status)}
        </span>
        </p>

        <p><strong>Data:</strong>
        ${new Date(app.data).toLocaleDateString("pt-PT")}
        </p>

        <hr>

        <p><strong>Mensagem enviada:</strong></p>

        <p class="text-muted">${app.mensagem}</p>

        <hr>

        <a class="btn btn-primary"
        href="http://127.0.0.1:3000/uploads/cv/${app.cv}"
        target="_blank">

        <i class="bi bi-file-earmark-pdf"></i>
        Abrir CV

        </a>

        </div>

        </div>

        </div>

        `;

        document.body.appendChild(modal);

        const modalBootstrap = new bootstrap.Modal(modal);

        modalBootstrap.show();

        modal.addEventListener("hidden.bs.modal",()=>modal.remove());

    }



    // ================================
    // FILTROS
    // ================================
    setupEventListeners(){

        const searchInput=document.getElementById("searchApplications");

        if(searchInput){

            searchInput.addEventListener("input",(e)=>{

                this.searchTerm = e.target.value.toLowerCase();

                this.renderApplications();

            });

        }

        const statusCheckboxes=document.querySelectorAll(".filter-status");

        statusCheckboxes.forEach(cb=>{

            cb.addEventListener("change",()=>this.updateStatusFilter());

        });


        const clearBtn=document.getElementById("clearFiltersApp");

        if(clearBtn){

            clearBtn.addEventListener("click",()=>this.clearFilters());

        }

    }


    updateStatusFilter(){

        const checked=document.querySelectorAll(".filter-status:checked");

        this.statusFilter=[...checked].map(cb=>cb.value);

        this.renderApplications();

    }


    clearFilters(){

        this.statusFilter=['análise','aceito','rejeitado'];

        this.searchTerm='';

        document.querySelectorAll(".filter-status")
        .forEach(cb=>cb.checked=true);

        document.getElementById("searchApplications").value="";

        this.renderApplications();

    }

}



let applicationsManagerInstance_var=null;

function applicationsManagerInstance(){

    return applicationsManagerInstance_var;

}

async function cancelApplication(applyId, vagaId){

    if(!confirm("Tem certeza que deseja cancelar sua candidatura?")) return;

    const response = await fetch(`http://127.0.0.1:3000/applies/${applyId}`, {
        method: 'DELETE',
        headers: {"Content-Type": "application/json"},
    });

    const data = response.data;

    window.location.reload();
    loadApplications();
    window.location.href = "minhas-candidaturas.html";


}

document.addEventListener("DOMContentLoaded",()=>{

    applicationsManagerInstance_var = new ApplicationsManager();

});