function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        document.cookie.split(';').forEach(function(cookie) {
            const c = cookie.trim();
            if (c.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(c.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}


function ListagemDetalhes(id)
{
    const token = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        url: "/favorito/adicionar_favorito/", 
        type: "POST",
        data: {
            'listagem_id': id,
            'csrfmiddlewaretoken': token
        },
        success: function(response) 
        {
            if (response.success) 
            {
                if (response.valor === '0') {
                    $(`#btn-fav-${id}`).closest('.col-lg-4').fadeOut(300, function() {
                        $(this).remove();
                        if ($('.col-lg-4').length === 0) {
                            location.reload();
                        }
                    });
                }

                let textoTitulo = (response.valor === '0') ? "Removido!" : "Guardado!";
                let textoIcone = (response.valor === '0') 
                    ? '<i class="fa-solid fa-trash fa-3x text-danger"></i>' 
                    : '<i class="fa-solid fa-heart fa-3x text-success"></i>';

                $("#modalTitulo").html(textoTitulo);
                $("#modalIcone").html(textoIcone);
                $("#modalMensagem").html(response.message);

                var modalElement = document.getElementById('modalFavorito');
                var meuModal = new bootstrap.Modal(modalElement);
                meuModal.show();

                modalElement.addEventListener('hidden.bs.modal', function () {
                    window.location.reload();
                }, { once: true });
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) 
            {
                var modalLogin = new bootstrap.Modal(document.getElementById('modalLoginRequired'));
                modalLogin.show();
            } else {
                console.error("Erro no servidor: " + xhr.status);
                alert("Ocorreu um erro técnico. Por favor, tente mais tarde.");
            }
        }
    });
}

function EliminarAgente(id, button)
{
    $.ajax({
        url: "/favorito/eliminar_agente_favorito/", 
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            'quem_favorece': document.getElementById('idUtilizadorLogado').value,
            'favorecido': id
        }),
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        success: function(response) 
        {
            if (response.success) {
                $(button).closest('.col-lg-3').fadeOut(300, function() {
                    $(this).remove();
                });

                $("#modalTitulo").html("Removido!");
                $("#modalIcone").html('<i class="fa-solid fa-trash fa-3x text-danger"></i>');
                $("#modalMensagem").html("Agente removido dos favoritos.");

                var modalElement = document.getElementById('modalFavorito');
                var meuModal = new bootstrap.Modal(modalElement);
                meuModal.show();

                modalElement.addEventListener('hidden.bs.modal', function () {
                    window.location.reload();
                }, { once: true });
            }
        },
        error: function(xhr) 
        {
            console.log(xhr.responseJSON);
        }
    });
}