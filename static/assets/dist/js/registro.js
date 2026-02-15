
$(document).ready(function() 
{
    $('#register-form').on('submit', function(e) 
    {
        e.preventDefault();  // Prevent reload

        var formData = $(this).serialize();  // Get all input data

        // Clear previous message
        $('#form-message').removeClass('alert-success alert-danger').html('');

        // Disable button
        $('button[type="submit"]', this).prop('disabled', true).text('A criar...');

        $.ajax({
            url: "{% url 'registrar' %}",
            type: "POST",
            data: formData,
            success: function(response) 
            {
                if (response.success) 
                {
                    $('#form-message')
                        .addClass('alert alert-success')
                        .text(response.message);
                    setTimeout(function() {
                        window.location.href = "{% url 'login' %}";  // Redirect on success
                    }, 2000);
                } 
                else 
                {
                    var errorList = '<ul>';
                    for (var key in response.errors) {
                        errorList += '<li>' + key + ': ' + response.errors[key] + '</li>';
                    }
                    errorList += '</ul>';
                    $('#form-message')
                        .addClass('alert alert-danger')
                        .html(response.message + errorList);
                }
            },
            error: function() 
            {
                $('#form-message')
                    .addClass('alert alert-danger')
                    .text('Erro no servidor. Tenta novamente.');
            },
            complete: function() {
                $('button[type="submit"]', '#register-form').prop('disabled', false).text('Criar conta');
            }
        });
    });
});