//const elementoDenuncia = document.getElementById("denuncia");

function denunciar() {
    const elementoDenuncia = document.getElementById("denuncia");

    // 2. Verifica se o utilizador está logado
    if (typeof utilizadorLogado === 'undefined' || utilizadorLogado !== "true") {
            // Disparar o Modal do Bootstrap
            const modalElement = document.getElementById('modalLoginRequired');
            const myModal = new bootstrap.Modal(modalElement);
            myModal.show();
            return; 
        }

        // 3. Se estiver logado, faz o toggle da visibilidade
        if (!elementoDenuncia) return;

        if (elementoDenuncia.style.display === "none" || elementoDenuncia.style.display === "") {
            elementoDenuncia.style.display = "block";
            // Faz scroll suave até à área de denúncia para o user não se perder
            elementoDenuncia.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        elementoDenuncia.style.display = "none";
    }
}

function mostrarTextArea() 
{
    const checkbox = document.getElementById("checkboxTxtArea");
    const elementotxtaOutros = document.getElementById("txtaOutros");

    if (checkbox.checked) {
        elementotxtaOutros.style.display = "block";
    } else {
        elementotxtaOutros.style.display = "none";
    }
}

/*-------------------------------trata de ver se os checkbox foram checados----------------------- */
document.addEventListener("DOMContentLoaded", function() {
    const checkboxesNormais = document.querySelectorAll('.check-motivo:not(#checkboxTxtArea)');
    const checkOutros = document.getElementById('checkboxTxtArea');
    const campoTextoOutros = document.getElementById('outros');
    const divTxta = document.getElementById('txtaOutros'); // Referência para a div
    const btnEnviar = document.getElementById('btnEnviar');

    function validarFormulario() {
        // 1. Alguma checkbox normal marcada?
        const algumComumMarcado = Array.from(checkboxesNormais).some(c => c.checked);

        // 2. "Outros" marcado e texto válido?
        const outrosValido = checkOutros.checked && campoTextoOutros.value.trim().length >= 5;

        // Ativar botão
        btnEnviar.disabled = !(algumComumMarcado || outrosValido);
    }

    // Checkboxes normais
    checkboxesNormais.forEach(c => c.addEventListener('change', validarFormulario));

    // Checkbox Outros
    checkOutros.addEventListener('change', function() {
        // Mostra ou esconde a div (substitui a função mostrarTextArea)
        divTxta.style.display = this.checked ? "block" : "none";
        
        if (this.checked) {
            setTimeout(() => campoTextoOutros.focus(), 100);
        } else {
            campoTextoOutros.value = ""; // Limpa o texto se desmarcar
        }
        validarFormulario();
    });

    // Digitação no textarea
    campoTextoOutros.addEventListener('input', validarFormulario);
});


/*---------------------------------------------------------guardar favoritos----------------------------*/
function AdicionarFavorito()
{
    const idQuemFavorece = document.getElementById('idUtilizadorLogado').value;
    
    const path = window.location.pathname; 
    const partes = path.split('/'); 
    // Filtramos partes vazias para garantir que apanhamos o número correto
    const segmentos = partes.filter(part => part.length > 0);
    const idFavorecido = segmentos[segmentos.length - 1];

    const utilizadorQueFavorece = Number(idQuemFavorece);
    const utilizadorFavorecido = Number(idFavorecido);

    console.log("Quem favorece:", utilizadorQueFavorece);
    console.log("Favorecido:", utilizadorFavorecido);

    if (!idQuemFavorece || idQuemFavorece === "None" || idQuemFavorece === "") {
        // Se não houver ID logado, dispara o teu modal laranja que fizemos antes
        const modalLogin = new bootstrap.Modal(document.getElementById('modalLoginRequired'));
        modalLogin.show();
        return;
    }

    fetch('/favorito/adicionarAgenteFavorito/', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'quem_favorece': idQuemFavorece,
            'favorecido': idFavorecido
        })
    })
    .then(response => response.json()) // Converte a resposta da View para JSON
    .then(data => {
        if (data.success) {
            // 1. Elementos do Modal (Prioridade)
            const modalElem = document.getElementById('modalFavoritoFeedback');
            const msgElem = document.getElementById('favoritoMensagem');
            
            // Inicializa o modal (Garante que o Bootstrap está carregado)
            const bsModal = new bootstrap.Modal(modalElem);

            // 2. Elementos da Página (Opcionais - colocamos num try para não quebrar o modal)
            try {
                const btnPrincipal = document.getElementById('btnFavoritoPrincipal');
                const estrela = document.getElementById('pathEstrela');

                if (data.status === 'adicionado') {
                    if (btnPrincipal) btnPrincipal.classList.replace('btn-success', 'btn-warning');
                    if (estrela) estrela.style.fill = "#FFFFFF";
                    msgElem.innerHTML = "⭐ " + data.message;
                } else {
                    if (btnPrincipal) btnPrincipal.classList.replace('btn-warning', 'btn-success');
                    if (estrela) estrela.style.fill = "#FFFFFF";
                    msgElem.innerHTML = "✨ " + data.message;
                }
            } catch (e) {
                console.warn("Erro ao atualizar ícone da página, mas o modal abrirá:", e);
                msgElem.innerText = data.message;
            }

            // 3. Abrir o Modal (Executa independentemente do ícone)
            bsModal.show();
            
            // Auto-close após 2 segundos
            setTimeout(() => {
                bsModal.hide();
            }, 2000);

        } else {
            console.error("Erro no servidor:", data.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

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

function GuardarDenuncia()
{
    const motivosSelecionados = [];

    if (document.getElementById('pEnganosa').checked)
        motivosSelecionados.push('1');

    if (document.getElementById('nCumpre').checked)
        motivosSelecionados.push('2');

    if (document.getElementById('pVariasPessoas').checked)
        motivosSelecionados.push('3');

    if (document.getElementById('burlador').checked)
        motivosSelecionados.push('4');

    let outrosTexto = null;

    if (document.getElementById('checkboxTxtArea').checked) {
        outrosTexto = document.getElementById('outros').value.trim();

        if (outrosTexto.length < 5) {
            //alert('O campo "Outros" deve ter pelo menos 5 caracteres.');
            console.log('O campo "Outros" deve ter pelo menos 5 caracteres.');
            return;
        }

        motivosSelecionados.push('Outros: ' + outrosTexto);
    }

    if (motivosSelecionados.length === 0) {
        //alert('Por favor, selecione pelo menos um motivo.');
        console.log('Por favor, selecione pelo menos um motivo.');
        return;
    }

    const path = window.location.pathname; 
    const partes = path.split('/'); 
    // Filtramos partes vazias para garantir que apanhamos o número correto
    const segmentos = partes.filter(part => part.length > 0);
    const idFavorecido = segmentos[segmentos.length - 1];

    const idAutor = document.getElementById('idUtilizadorLogado').value;

    const denuncia = {
        motivos: motivosSelecionados,
        outros: outrosTexto,
        autor_id: idAutor,
        denunciado_id: idFavorecido
    };

    console.log('Denúncia a guardar:', denuncia);

    $.ajax({
        url: '/denunciar-perfil/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(denuncia),
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        success: function (response) {
            if (response.sucesso) {
                $('#modalDenunciaFeedback').modal('show');
            }
        },
        error: function (xhr, status, error) {
            console.log('Erro:', error);
            console.log('Detalhe:', xhr.responseJSON);
            $('#modalDenunciaErro').modal('show');
        }
    });
}