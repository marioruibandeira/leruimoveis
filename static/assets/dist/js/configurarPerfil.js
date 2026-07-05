function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var pesquisaTimeout = null;

$(document).ready(function() {

    document.getElementById('pesquisa').addEventListener('input', function() {
        clearTimeout(pesquisaTimeout);
        var q = this.value.trim();

        if (q.length < 2) {
            document.getElementById('resultadosPesquisa').innerHTML = '';
            return;
        }

        pesquisaTimeout = setTimeout(function() {
            $.ajax({
                type: "GET",
                data: { action: 'pesquisar', q: q },
                success: function(response) {
                    var container = document.getElementById('resultadosPesquisa');
                    container.innerHTML = '';

                    if (response.utilizadores.length === 0) {
                        container.innerHTML = '<div class="list-group-item text-muted">Nenhum utilizador encontrado</div>';
                        return;
                    }

                    response.utilizadores.forEach(function(u) {
                        var nome = (u.primeiro_nome + ' ' + u.sobre_nome).trim() || u.utilizador__username;
                        var item = '<a href="#" class="list-group-item list-group-item-action" onclick="SelecionarUtilizador(' + u.utilizador__id + ', \'' + u.utilizador__username + '\', \'' + nome + '\')">';
                        item += '<strong>' + u.utilizador__username + '</strong> — ' + nome;
                        item += '</a>';
                        container.innerHTML += item;
                    });
                },
                error: function(xhr, status, error) {
                    console.error("Erro na pesquisa:", error);
                }
            });
        }, 300);
    });

    document.getElementById('agencia').addEventListener('change', function() {
        VerificarBotaoAdicionar();
    });

});

function SelecionarUtilizador(id, username, nome) {
    document.getElementById('utilizadorId').value = id;
    document.getElementById('pesquisa').value = username + ' — ' + nome;
    document.getElementById('resultadosPesquisa').innerHTML = '';
    VerificarBotaoAdicionar();
}

function VerificarBotaoAdicionar() {
    var utilizadorId = document.getElementById('utilizadorId').value;
    var agenciaId = document.getElementById('agencia').value;
    var btnAdicionar = document.getElementById('btnAdicionar');

    if (utilizadorId && agenciaId) {
        btnAdicionar.disabled = false;
    } else {
        btnAdicionar.disabled = true;
    }
}

function AdicionarUtilizador()
{
    var csrfToken = getCookie('csrftoken');
    var utilizadorId = document.getElementById('utilizadorId').value;
    var agenciaId = document.getElementById('agencia').value;

    $.ajax({
        type: "POST",
        data: {
            utilizador_id: utilizadorId,
            agencia_id: agenciaId
        },
        headers: { "X-CSRFToken": csrfToken },
        success: function(response)
        {
            if (response.status === 'erro') {
                document.getElementById('msgErroTexto').innerText = response.mensagem;
                $('#modalErro').modal('show');
                return;
            }

            document.getElementById('pesquisa').value = '';
            document.getElementById('utilizadorId').value = '';
            document.getElementById('agencia').value = '';
            document.getElementById('btnAdicionar').disabled = true;

            document.getElementById('msgSucessoTexto').innerText = response.mensagem;
            $('#modalSucesso').modal('show');

            AtualizarTabelaUtilizadores();
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao adicionar:", error);
        }
    });
}

function AtualizarTabelaUtilizadores()
{
    $.ajax({
        type: "GET",
        data: { action: 'lista_utilizadores' },
        success: function(response)
        {
            // atualizar tabela
            var tbody = document.querySelector('#tabelaUtilizadores tbody');
            tbody.innerHTML = '';

            // atualizar cards
            var containerCards = document.getElementById('containerUtilizadoresCards');
            containerCards.innerHTML = '';

            if (response.utilizadores.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum utilizador encontrado</td></tr>';
                containerCards.innerHTML = '<div class="alert alert-warning" style="margin-top: 15px;">Nenhum utilizador encontrado.</div>';
                return;
            }

            response.utilizadores.forEach(function(u, index) {
                // linha da tabela
                var tr = '<tr id="au-row-' + u.agencia_utilizador_id + '">';
                tr += '<th scope="row">' + (index + 1) + '</th>';
                tr += '<td style="text-align:left;">' + u.username + '</td>';
                tr += '<td style="text-align: left;">' + u.nome + '</td>';
                tr += '<td style="text-align: left;">' + u.agencia + '</td>';
                tr += '<td class=" " style="width: 150px; text-align: right; padding-right:20px;">';
                tr += '<a href="#" title="Apagar" class="link-decoration" onclick="ApagarUtilizador(' + u.agencia_utilizador_id + ')">';
                tr += '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#ff4200"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
                tr += '</a></td></tr>';
                tbody.innerHTML += tr;

                // card
                var card = '<div class="card" style="width: 100%; margin-top: 15px; margin-bottom:15px;">';
                card += '<div class="card-header text-start" style="background-color: #b4ebc4;">' + u.agencia + '</div>';
                //card += '<div class="card-header text-start bg-light">' + u.agencia + '</div>';
                card += '<ul class="list-group list-group-flush">';
                card += '<li class="list-group-item text-start"><span class="fw-bold me-1">Utilizador : </span>' + u.username + '</li>';
                card += '<li class="list-group-item text-start"><span class="fw-bold me-1">Nome : </span>' + u.nome + '</li>';
                card += '</ul>';
                card += '<div class="card-footer text-start" style="padding: 4px;">';
                card += '<a href="#" class="btn btn-danger" title="Apagar" style="width: 100% !important; height: 28px; padding: 0px !important; margin-right: 0px !important;" onclick="ApagarUtilizador(' + u.agencia_utilizador_id + ')">';
                card += '<svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#fff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
                card += '</a></div></div>';
                containerCards.innerHTML += card;
            });
        },
        error: function(xhr, status, error) {
            console.error("Erro ao atualizar:", error);
        }
    });
}

var utilizadorParaApagar = null;

function ApagarUtilizador(agenciaUtilizadorId)
{
    utilizadorParaApagar = agenciaUtilizadorId;
    $('#modalConfirmarApagar').modal('show');
}

document.getElementById('btnConfirmarApagar').onclick = function()
{
    var csrfToken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        data: {
            action: 'apagar',
            agencia_utilizador_id: utilizadorParaApagar
        },
        headers: { "X-CSRFToken": csrfToken },
        success: function(response)
        {
            $('#modalConfirmarApagar').modal('hide');

            if (response.status === 'ok') {
                $('#au-row-' + utilizadorParaApagar).remove();
                document.getElementById('msgSucessoTexto').innerText = response.mensagem;
                $('#modalSucesso').modal('show');
                AtualizarTabelaUtilizadores();
            } else {
                document.getElementById('msgErroTexto').innerText = response.mensagem;
                $('#modalErro').modal('show');
            }
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao apagar:", error);
        }
    });
};