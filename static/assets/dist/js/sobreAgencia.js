function Guardar()
{
    var descricao = document.getElementById("descricao").value;
    var csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    event.preventDefault();

    var formData = {
        descricao:descricao
    }

    $.ajax({
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

            document.getElementById('msgSucessoTexto').innerText = response.mensagem;
            $('#modalSucesso').modal('show');

            document.getElementById('btnEliminar').classList.remove('btn-oculto');
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao guardar:", error);
        }
    });
}

document.getElementById('descricao').addEventListener('input', function() {
    var btnGuardar = document.getElementById('btnGuardar');
    if (this.value.trim().length >= 100) {
        btnGuardar.disabled = false;
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
    } else {
        btnGuardar.disabled = true;
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
    }
});

$(document).ready(function() {
    var descricao = document.getElementById('descricao');
    var btnEliminar = document.getElementById('btnEliminar');

    if (descricao.value.trim().length >= 100) {
        // tem dados — começa readonly, editável ao clicar
        descricao.setAttribute('readonly', true);
        document.getElementById('btnGuardar').disabled = false;
        descricao.classList.add('is-valid');
        document.getElementById('btnEliminar').classList.remove('btn-oculto');
    } else if (descricao.value.trim().length > 0) {
        // tem dados mas menos de 100 caracteres — editável, botão desabilitado
        descricao.removeAttribute('readonly');
        document.getElementById('btnGuardar').disabled = true;
        document.getElementById('btnEliminar').classList.add('btn-oculto');
    } else {
        // vazio — aberto para escrever
        descricao.removeAttribute('readonly');
        document.getElementById('btnGuardar').disabled = true;
        document.getElementById('btnEliminar').classList.add('btn-oculto');
    }
});

document.getElementById('descricao').addEventListener('click', function() {
    if (this.hasAttribute('readonly')) {
        this.removeAttribute('readonly');
        this.focus();
    }
});

function Eliminar()
{
    var csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

    $.ajax({
        type: "POST",
        data: { action: 'eliminar' },
        headers: { "X-CSRFToken": csrfToken },
        success: function(response)
        {
            if (response.status === 'ok') {
                document.getElementById('descricao').value = '';
                document.getElementById('descricao').classList.remove('is-valid', 'is-invalid');
                document.getElementById('descricao').removeAttribute('readonly');
                document.getElementById('btnGuardar').disabled = true;
                document.getElementById('btnEliminar').classList.add('btn-oculto');
                document.getElementById('msgSucessoTexto').innerText = response.mensagem;
                $('#modalSucesso').modal('show');
            }
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao eliminar:", error);
        }
    });
}