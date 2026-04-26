(function() {
    const ckbEncerrarConta = document.getElementById("ckbEncerrarConta");
    const btnEncerrarConta = document.getElementById("btnEncerrarConta");

    if (ckbEncerrarConta && btnEncerrarConta) {
        ckbEncerrarConta.addEventListener("change", function() {
            btnEncerrarConta.disabled = !this.checked;
        });
    }

    // Tornar a função global para que o onclick do HTML a encontre
    window.EncerrarConta = function() {
        const modalElement = document.getElementById('modalEncerrarConta');
        if (modalElement) {
            const meuModal = new bootstrap.Modal(modalElement);
            meuModal.show();
        }
    };
})();

document.getElementById("btnConfirmarEncerramento").addEventListener("click", function() 
{
    const btn = this;
    btn.disabled = true;
    btn.innerHTML = "A processar...";

    // Função rápida para ler o cookie do Django
    const getCookie = (name) => {
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
    };

    $.ajax({
        url: '/usuarios/encerrar/',
        type: 'POST',
        headers: {
            "X-CSRFToken": getCookie('csrftoken') // Enviamos no Header em vez de no Data
        },
        success: function(response) {
            if (response.success) {
                window.location.href = '/usuarios/logout/';
            } else {
                alert("Erro: " + response.message);
                btn.disabled = false;
                btn.innerHTML = "Sim, encerrar conta";
            }
        },
        error: function(xhr) {
            alert("Erro técnico: " + xhr.status);
            btn.disabled = false;
            btn.innerHTML = "Sim, encerrar conta";
        }
    });
});