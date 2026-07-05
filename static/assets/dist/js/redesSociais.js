var regras = {
    facebook: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/i,
    instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
    tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/i
};

$(document).ready(function() {
    ['facebook', 'instagram', 'tiktok'].forEach(function(campo) {
        var input = document.getElementById(campo);
        var btnEliminar = document.getElementById('btnEliminar' + campo.charAt(0).toUpperCase() + campo.slice(1));
        var btnGuardar = document.getElementById('btnGuardar' + campo.charAt(0).toUpperCase() + campo.slice(1));

        // mostrar/esconder botão eliminar
        if (input.value.trim() === '') {
            btnEliminar.style.display = 'none';
        } else {
            btnEliminar.style.display = 'block';
            input.classList.add('is-valid');
        }

        // botão guardar começa desabilitado
        btnGuardar.disabled = true;

        // validar ao escrever
        input.addEventListener('input', function() {
            if (regras[campo].test(this.value.trim())) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                btnGuardar.disabled = false;
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                btnGuardar.disabled = true;
            }

            // se vazio, limpar classes
            if (this.value.trim() === '') {
                this.classList.remove('is-valid', 'is-invalid');
                btnGuardar.disabled = true;
            }
        });
    });
});

function Guardar(campo)
{
    var csrfToken = getCookie('csrftoken');
    var valor = document.getElementById(campo).value;

    $.ajax({
        type: "POST",
        data: { campo: campo, valor: valor },
        headers: { "X-CSRFToken": csrfToken },
        success: function(response)
        {
            if (response.status === 'erro') {
                document.getElementById('msgErroTexto').innerText = response.mensagem;
                $('#modalErro').modal('show');
                return;
            }

            var btnEliminar = document.getElementById('btnEliminar' + campo.charAt(0).toUpperCase() + campo.slice(1));
            var btnGuardar = document.getElementById('btnGuardar' + campo.charAt(0).toUpperCase() + campo.slice(1));

            btnEliminar.style.display = 'block';
            btnGuardar.disabled = true;

            document.getElementById('msgSucessoTexto').innerText = response.mensagem;
            $('#modalSucesso').modal('show');
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao guardar:", error);
        }
    });
}

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

function Eliminar(campo)
{
    var csrfToken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        data: { action: 'eliminar', campo: campo },
        headers: { "X-CSRFToken": csrfToken },
        success: function(response)
        {
            if (response.status === 'ok') {
                var input = document.getElementById(campo);
                var btnEliminar = document.getElementById('btnEliminar' + campo.charAt(0).toUpperCase() + campo.slice(1));

                input.value = '';
                input.classList.remove('is-valid', 'is-invalid');
                btnEliminar.style.display = 'none';

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