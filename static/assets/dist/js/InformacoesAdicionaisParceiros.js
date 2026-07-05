
$(document).ready(function() {
    var missao = document.getElementById('missao');
    var visao = document.getElementById('visao');
    var objectivo = document.getElementById('objectivo');
    var btnEliminar = document.getElementById('btnEliminar');

    // readonly se tiver dados
    [missao, visao, objectivo].forEach(function(campo) {
        if (campo.value.trim().length > 0) {
            campo.setAttribute('readonly', true);
        }
    });

    // mostrar botão eliminar se algum campo tiver dados
    if (missao.value.trim().length > 0 || visao.value.trim().length > 0 || objectivo.value.trim().length > 0) {
        btnEliminar.classList.remove('btn-oculto');
    }

    // habilitar botão guardar se algum campo tiver 25+ caracteres
    ValidarFormulario();
});

// editar ao clicar
['missao', 'visao', 'objectivo'].forEach(function(id) {
    document.getElementById(id).addEventListener('click', function() {
        if (this.hasAttribute('readonly')) {
            this.removeAttribute('readonly');
            this.focus();
        }
    });

    document.getElementById(id).addEventListener('input', ValidarFormulario);
});

function ValidarFormulario()
{
    var missao = document.getElementById('missao').value.trim();
    var visao = document.getElementById('visao').value.trim();
    var objectivo = document.getElementById('objectivo').value.trim();

    var valido = missao.length >= 25 || visao.length >= 25 || objectivo.length >= 25;
    document.getElementById('btnGuardar').disabled = !valido;
}

function Guardar()
{
    var csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var missao = document.getElementById("missao").value;
    var visao = document.getElementById("visao").value;
    var objectivo = document.getElementById("objectivo").value;

    event.preventDefault();

    var formData = {
        missao: missao,
        visao: visao,
        objectivo: objectivo
    };

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

            // readonly após guardar
            ['missao', 'visao', 'objectivo'].forEach(function(id) {
                var el = document.getElementById(id);
                if (el.value.trim().length > 0) {
                    el.setAttribute('readonly', true);
                }
            });

            document.getElementById('btnEliminar').classList.remove('btn-oculto');
            document.getElementById('msgSucessoTexto').innerText = response.mensagem;
            $('#modalSucesso').modal('show');
        },
        error: function(xhr, status, error)
        {
            console.error("Erro ao guardar:", error);
        }
    });
}

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
                ['missao', 'visao', 'objectivo'].forEach(function(id) {
                    var el = document.getElementById(id);
                    el.value = '';
                    el.removeAttribute('readonly');
                    el.classList.remove('is-valid', 'is-invalid');
                });

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