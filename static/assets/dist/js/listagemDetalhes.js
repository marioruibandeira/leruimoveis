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
                    // Se o botão está dentro de um col-lg-4, vamos remover esse elemento
                    $(`#btn-fav-${listagemId}`).closest('.col-lg-4').fadeOut(300, function() {
                        $(this).remove();
                        
                        // Opcional: Se não sobrarem cards, mostrar mensagem de "Lista vazia"
                        if ($('.col-lg-4').length === 0) {
                            location.reload(); // Recarrega para mostrar a mensagem de lista vazia do Django
                        }
                    });
                }
        
                let textoTitulo = (response.message === 'Removido dos favoritos.') ? "Removido!" : "Guardado!";

                $("#modalTitulo").html(textoTitulo);
                $("#modalMensagem").html(response.message);

                var modalElement = document.getElementById('modalFavorito');
                var meuModal = new bootstrap.Modal(modalElement);
                meuModal.show();

                modalElement.addEventListener('hidden.bs.modal', function () {
                    window.location.reload();
                }, { once: true }); // O 'once: true' evita que o evento se acumule
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) 
            {
                var modalLogin = new bootstrap.Modal(document.getElementById('modalLoginRequired'));
                modalLogin.show();
            } else {
                //window.location.href = "/usuarios/login/"; 
                console.error("Erro no servidor: " + xhr.status);
                alert("Ocorreu um erro técnico. Por favor, tente mais tarde.");
            }
        }
    });
}