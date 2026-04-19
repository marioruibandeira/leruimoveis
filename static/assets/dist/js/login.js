function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//const csrftoken = getCookie('csrftoken');

$(document).ready(function() 
{
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        console.log("Form submit intercepted");

        var $form = $(this);
        var $btn = $form.find('button[type="submit"]');
        var $msg = $('#form-message');

        $msg.removeClass('alert-success alert-danger').html('');
        $btn.prop('disabled', true).text('Entrando...');
        $form.addClass('loading');

        $.ajax({
            url: "/usuarios/login/",
            type: "POST",
            data: $form.serialize(),

            success: function(response) 
            {
                console.log("AJAX success:", response);
                if (response.success) 
                {
                    $msg.addClass('alert alert-success').text(response.message || 'Login efetuado!');
                    setTimeout(() => window.location.href = "/properties/", 1500);
                } else {
                    $msg.addClass('alert alert-danger').text(response.message || 'Credenciais inválidas.');
                }
            },
            error: function(xhr, status, err) 
            {
                let errorMsg = 'Erro ao conectar. Tente novamente.';
                
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.status === 401) {
                    errorMsg = 'Nome de usuário ou senha incorretos.';
                } else if (xhr.status === 403) {
                    errorMsg = 'Erro de segurança (CSRF). Recarregue a página.';
                }
                
                //$msg.addClass('alert alert-danger').text(errorMsg);

                $msg.removeClass('alert-success alert-danger')
                    .addClass('alert alert-danger')
                    .text(errorMsg)
                    .addClass('show');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Entrar');
                $form.removeClass('loading');
            }
        });
    });
});