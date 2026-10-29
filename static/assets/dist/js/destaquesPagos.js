document.addEventListener('DOMContentLoaded', function () {

    let destaqueIdParaApagar = null;
    let destaqueIdParaVerDetalhes = null;

    document.addEventListener('click', function (event) {
        const btn = event.target.closest('.btn-apagar-destaque');
        if (btn) {
            event.preventDefault();
            destaqueIdParaApagar = btn.dataset.id;
            mostrarModal('modalConfirmarApagar', '');
        }
    });

    document.addEventListener('click', function (event) {
        const btn = event.target.closest('.btn-mostrar-detalhes');
        if (btn) {
            event.preventDefault();
            destaqueIdParaVerDetalhes = btn.dataset.id;
            carregarDetalhes(destaqueIdParaVerDetalhes);
        }
    });

    document.getElementById('btnConfirmarApagar').addEventListener('click', function () {
        if (!destaqueIdParaApagar) return;

        fetch(`/admin-panel/destaques/apagar/${destaqueIdParaApagar}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
            .then(response => response.json())
            .then(data => {
                fecharModal('modalConfirmarApagar');
                if (data.sucesso) {
                    document.getElementById(`destaque-row-${destaqueIdParaApagar}`).remove();
                    mostrarModal('modalSucesso', 'Destaque apagado com sucesso!');
                } else {
                    mostrarModal('modalErro', 'Erro ao apagar: ' + data.erro);
                }
            })
            .catch(error => {
                fecharModal('modalConfirmarApagar');
                mostrarModal('modalErro', 'Erro ao apagar destaque.');
            });
    });

    function carregarDetalhes(id) {
        $.ajax({
            type: "GET",
            url: `/admin-panel/destaques/detalhes/${id}/`,
            success: function (data) {
                document.getElementById('modal-utilizador').textContent = data.utilizador;
                document.getElementById('modal-agencia').textContent = data.agencia;
                document.getElementById('modal-titulo').textContent = data.titulo;
                document.getElementById('modal-data').textContent = data.data;
                document.getElementById('modal-data-inicio').textContent = data.data_inicio;
                document.getElementById('modal-data-fim').textContent = data.data_fim;
                document.getElementById('modal-tempo-restante').textContent = data.tempo_restante;
                document.getElementById('modal-status').textContent = data.status;
                document.getElementById('modal-criado-por').textContent = data.criado_por;

                mostrarModal('modalMostrarDetalhes', '');
            },
            error: function (xhr, status, error) {
                console.error("Erro ao carregar detalhes:", error);
                mostrarModal('modalErro', 'Erro ao carregar detalhes do destaque.');
            }
        });
    }

});

function mostrarModal(id, texto) {
    const textoEl = document.getElementById(id + 'Texto');
    if (textoEl) textoEl.textContent = texto;
    const modal = document.getElementById(id);
    modal.style.display = 'block';
    modal.style.opacity = '1';
    modal.classList.add('show');
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'none';
    modal.classList.remove('show');
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}