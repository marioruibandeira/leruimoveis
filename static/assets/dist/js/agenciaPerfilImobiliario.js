
const divNovaAgencia = document.getElementById("divNovaAgencia");
const caixaDetalhes = document.getElementById("caixaDetalhes");

function NovaAgencia()
{
    divNovaAgencia.style.display = "block";
    caixaDetalhes.style.display = "none";
}

function Guardar(event)
{
    var agenciaId = document.getElementById('agenciaId').value;

    var divNovaAgencia = document.getElementById("divNovaAgencia");
    var caixaDetalhes = document.getElementById("caixaDetalhes");

    event.preventDefault();

    var sede = document.getElementById("sede");
    var agencia = document.getElementById("agencia");
    var agenciaWrapper = document.getElementById("agenciaWrapper");
    var sedeId = document.getElementById("sedeId");
    var telefone = document.getElementById("telefone");
    var telefoneAlternativo = document.getElementById("telefoneAlternativo");
    var whatsapp = document.getElementById("whatsapp");
    var site = document.getElementById("site");
    var email = document.getElementById("email");
    var endereco = document.getElementById("endereco");
    var csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    var formData = {
        sede: sede.value,
        agencia: agencia.value,
        telefone: telefone.value,
        telefoneAlternativo: telefoneAlternativo.value,
        whatsapp: whatsapp.value,
        site: site.value,
        email: email.value,
        endereco: endereco.value
    };

    if (agenciaId) {
        formData.action = 'editar';
        formData.agencia_id = agenciaId;
    }

    $.ajax({
        //url: "perfil-imobiliario",
        type: "POST",
        data: formData,
        headers: {
            "X-CSRFToken": csrfToken
        },
        success: function(response)
        {
            if (response.status === 'erro') {
                document.getElementById('msgErroTexto').innerText = response.mensagem;
                $('#modalErro').modal('show');
                return;
            }

            if (response.is_matriz) {
                // acabámos de criar a sede
                sede.value = formData.sede;
                sede.readOnly = true;

                sedeId.value = response.agencia_id;

                agenciaWrapper.style.display = "block";
            }

            // limpar campos para a próxima agência (filial)
            agencia.value = "";
            telefone.value = "";
            telefoneAlternativo.value = "";
            whatsapp.value = "";
            site.value = "";
            email.value = "";
            endereco.value = "";

            divNovaAgencia.style.display = "none";
            caixaDetalhes.style.display = "block";

            AtualizarTabela();
            AtualizarCards();

            document.getElementById('msgSucessoTexto').innerText = response.mensagem;
            $('#modalSucesso').modal('show');

            // repor o formulário para modo criação
            document.getElementById('agenciaId').value = '';
            document.getElementById('tituloFormulario').innerText = 'Perfil Imobiliário';

            document.getElementById('btnGuardarTexto').innerText = 'Modificar';
            document.getElementById('btnGuardarIcone').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>';

            // e para repor:
            document.getElementById('btnGuardarTexto').innerText = 'Guardar';
            document.getElementById('btnGuardarIcone').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M816-672v456q0 29.7-21.15 50.85Q773.7-144 744-144H216q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h456l144 144Zm-72 30L642-744H216v528h528v-426ZM556.5-283.5Q588-315 588-360t-31.5-76.5Q525-468 480-468t-76.5 31.5Q372-405 372-360t31.5 76.5Q435-252 480-252t76.5-31.5ZM264-552h336v-144H264v144Zm-48-77v413-528 115Z"/></svg>';
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao guardar:", error);
        }
    });
}

function AtualizarTabela()
{
    $.ajax({
        type: "GET",
        data: { action: 'lista' },
        success: function(response)
        {
            var tbody = document.querySelector('#tabelaAgencias tbody');
            tbody.innerHTML = "";

            if (response.agencias.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhuma agência encontrada</td></tr>';
                return;
            }

            response.agencias.forEach(function(ag, index)
            {
                var isSede = ag.matriz_id === null;
                var tr = '<tr id="agencia-row-' + ag.agencia_id + '" ' + (isSede ? 'class="table-warning"' : '') + '>';
                tr += '<th scope="row">' + (index + 1) + '</th>';
                tr += '<td style="text-align:left;">' + ag.agencia + '</td>';
                tr += '<td style="width:120px;">' + ag.telefone + '</td>';
                tr += '<td style="width:120px;">' + (ag.whatsapp || '') + '</td>';
                tr += '<td class="text-center" style="width:150px;">';
                tr += '<a href="#" class="me-2 edit-property link-decoration" title="Editar" onclick="EditarAgencia(' + ag.agencia_id + ')"><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#173660"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></a>';
                tr += '<a href="#" class="me-2 link-decoration" title="Adicionar imagens" data-bs-toggle="modal" data-bs-target="#addImagesModal" data-foto=" "><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#173660"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></a>';
                tr += '<a href="#" class="me-2 link-decoration" title="Ver detalhes" onclick="VerDetalhesAgencia(' + ag.agencia_id + ')"><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#173660"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/></svg></a>';
                tr += '<a href="#" class="link-decoration" title="Apagar" onclick="ApagarAgencia(' + ag.agencia_id + ')"><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ff4200"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></a>';
                tr += '</td></tr>';

                tbody.innerHTML += tr;
            });
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao atualizar tabela:", error);
        }
    });
}

var agenciaParaApagar = null;

function ApagarAgencia(agenciaId)
{
    agenciaParaApagar = agenciaId;

    $('#modalConfirmarApagar').modal('show');
}

document.getElementById('btnConfirmarApagar').onclick = function()
{
    var csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    $.ajax({
        type: "POST",
        data: {
            action: 'apagar',
            agencia_id: agenciaParaApagar
        },
        headers: {
            "X-CSRFToken": csrfToken
        },
        success: function(response)
        {
            $('#modalConfirmarApagar').modal('hide');

            if (response.status === 'ok') {
                $('#agencia-row-' + agenciaParaApagar).remove();
                document.getElementById('msgSucessoTexto').innerText = response.mensagem;
                $('#modalSucesso').modal('show');
            } else {
                document.getElementById('msgErroTexto').innerText = response.mensagem;
                $('#modalErro').modal('show');
            }

            AtualizarCards();
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao apagar:", error);
        }
    });
};

function EditarAgencia(agenciaId)
{
    $.ajax({
        type: "GET",
        data: { action: 'detalhes', agencia_id: agenciaId },
        success: function(response)
        {
            if (response.status === 'ok') {
                document.getElementById('agenciaId').value = response.agencia_id;
                document.getElementById('telefone').value = response.telefone;
                document.getElementById('telefoneAlternativo').value = response.telefone_alternativo;
                document.getElementById('whatsapp').value = response.whatsapp;
                document.getElementById('site').value = response.site;
                document.getElementById('email').value = response.email;
                document.getElementById('endereco').value = response.endereco;

                if (response.is_matriz) {
                    document.getElementById('sede').value = response.agencia;
                    document.getElementById('sede').readOnly = false;
                    document.getElementById('agenciaWrapper').style.display = 'none';
                    document.getElementById('agencia').value = '';
                } else {
                    document.getElementById('sede').readOnly = true;
                    document.getElementById('agenciaWrapper').style.display = 'block';
                    document.getElementById('agencia').value = response.agencia;
                }

                document.getElementById('tituloFormulario').innerText = 'Editar Agência';
                document.getElementById('btnGuardar').innerText = 'Modificar';

                document.getElementById('caixaDetalhes').style.display = 'none';
                document.getElementById('divNovaAgencia').style.display = 'block';
            }
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao carregar dados:", error);
        }
    });
}

function VerDetalhesAgencia(agenciaId)
{
    $.ajax({
        type: "GET",
        data: { action: 'detalhes', agencia_id: agenciaId },
        success: function(response)
        {
            if (response.status === 'ok') {
                document.getElementById('modal-sede').innerText = response.is_matriz ? response.agencia : document.getElementById('sede').value;
                document.getElementById('modal-agencia').innerText = response.is_matriz ? '(Sede)' : response.agencia;
                document.getElementById('modal-telefone').innerText = response.telefone;
                document.getElementById('modal-telefone-alternativo').innerText = response.telefone_alternativo || '-';
                document.getElementById('modal-whatsapp').innerText = response.whatsapp || '-';
                document.getElementById('modal-site').innerText = response.site || '-';
                document.getElementById('modal-email').innerText = response.email || '-';
                document.getElementById('modal-endereco').innerText = response.endereco;

                $('#detalhesAgenciaModal').modal('show');
            }
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao carregar detalhes:", error);
        }
    });
}

function AtualizarCards()
{
    $.ajax({
        type: "GET",
        data: { action: 'lista' },
        success: function(response)
        {
            var container = document.getElementById('containerCards');
            container.innerHTML = "";

            if (response.agencias.length === 0) {
                container.innerHTML = '<div class="alert alert-warning" style="margin-top: 15px;">Nenhuma agência encontrada.</div>';
                return;
            }

            response.agencias.forEach(function(ag)
            {
                var isSede = ag.matriz_id === null;
                var headerStyle = isSede ? 'style="background-color: #BDD6AC;"' : '';
                var headerClass = isSede ? 'text-white' : 'bg-light';
                var headerLabel = isSede ? 'SEDE' : 'FILIAL';

                var card = '<div class="card" style="width: 100%; margin-top: 15px; margin-bottom: 15px;">';
                card += '<div class="card-header text-start ' + headerClass + '" ' + headerStyle + '>' + headerLabel + '</div>';
                card += '<ul class="list-group list-group-flush">';
                card += '<li class="list-group-item text-start"><span class="fw-bold me-1">Agência : </span>' + ag.agencia + '</li>';
                card += '<li class="list-group-item text-start"><span class="fw-bold me-1">Telefone : </span>' + ag.telefone + '</li>';
                card += '<li class="list-group-item text-start"><span class="fw-bold me-1">Whatsapp : </span>' + (ag.whatsapp || '-') + '</li>';
                card += '</ul>';
                card += '<div class="card-footer text-start" style="padding: 4px;">';
                card += '<a href="#" class="me-2 btn btn-secondary" title="Editar" style="width: 23% !important; height: 28px; padding: 0px !important; margin-right: 4px !important;" onclick="EditarAgencia(' + ag.agencia_id + ')">';
                card += '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#fff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></a>';
                card += '<a href="#" class="me-2 btn btn-secondary" title="Adicionar imagens" style="width: 23% !important; height: 28px; padding: 0px !important; margin-right: 4px !important;" data-bs-toggle="modal" data-bs-target="#addImagesModal">';
                card += '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#fff"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></a>';
                card += '<a href="#" class="me-2 btn btn-secondary" title="Ver detalhes" style="width: 23% !important; height: 28px; padding: 0px !important; margin-right: 4px !important;" onclick="VerDetalhesAgencia(' + ag.agencia_id + ')">';
                card += '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#fff"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/></svg></a>';
                card += '<a href="#" class="btn btn-secondary" title="Apagar" style="width: 23% !important; height: 28px; padding: 0px !important; margin-right: 4px !important;" onclick="ApagarAgencia(' + ag.agencia_id + ')">';
                card += '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ff4200"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></a>';
                card += '</div></div>';

                container.innerHTML += card;
            });
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao atualizar cards:", error);
        }
    });
}

/* ======================================== Validações =================================================== */
var regexNome = /^[a-zA-ZÀ-ÿ0-9\s\-\/]{3,50}$/;
var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var regexSite = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/.*)?$/;
var regexTelefone = /^[0-9\s\-\+\(\)]{7,15}$/;
var regexEndereco = /^[a-zA-ZÀ-ÿ0-9\s\-\/]{10,}$/;

function ValidarCampo(campo, valido) {
    if (campo.value.trim() === '') {
        campo.classList.remove('is-valid', 'is-invalid');
    } else if (valido) {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
    } else {
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
    }
}

function ValidarFormulario() {
    var agenciaWrapper = document.getElementById('agenciaWrapper');
    var isSede = agenciaWrapper.style.display === 'none';

    var campoNome = isSede ? document.getElementById('sede') : document.getElementById('agencia');
    var telefone = document.getElementById('telefone');
    var site = document.getElementById('site');
    var email = document.getElementById('email');
    var endereco = document.getElementById('endereco');
    var telefoneAlternativo = document.getElementById('telefoneAlternativo');
    var whatsapp = document.getElementById('whatsapp');

    var nomeValido = regexNome.test(campoNome.value.trim());
    var telefoneValido = regexTelefone.test(telefone.value.trim());
    var siteValido = regexSite.test(site.value.trim());
    var emailValido = regexEmail.test(email.value.trim());
    var enderecoValido = regexEndereco.test(endereco.value.trim());

    ValidarCampo(campoNome, nomeValido);
    ValidarCampo(telefone, telefoneValido);
    ValidarCampo(site, siteValido);
    ValidarCampo(email, emailValido);
    ValidarCampo(endereco, enderecoValido);

    // opcionais — só valida visualmente se preenchidos
    if (telefoneAlternativo.value.trim() !== '') {
        telefoneAlternativo.classList.add('is-valid');
        telefoneAlternativo.classList.remove('is-invalid');
    } else {
        telefoneAlternativo.classList.remove('is-valid', 'is-invalid');
    }

    if (whatsapp.value.trim() !== '') {
        whatsapp.classList.add('is-valid');
        whatsapp.classList.remove('is-invalid');
    } else {
        whatsapp.classList.remove('is-valid', 'is-invalid');
    }

    var tudo_valido = nomeValido && telefoneValido && siteValido && emailValido && enderecoValido;
    document.getElementById('btnGuardar').disabled = !tudo_valido;
}

// ligar os eventos a todos os campos
['sede', 'agencia', 'telefone', 'telefoneAlternativo', 'whatsapp', 'site', 'email', 'endereco'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', ValidarFormulario);
});
