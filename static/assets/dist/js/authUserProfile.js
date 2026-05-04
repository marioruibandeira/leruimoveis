// Substitui as const checkTexto por estas declarações:
function checkTexto(id) {
    const campo = document.getElementById(id);
    if (!campo) return false;
    const v = campo.value.trim();
    return /^[a-zA-ZÀ-ÿ\s]+$/.test(v) && v.length >= 3 && v.length <= 50;
}

function checkTelefone(id) {
    const campo = document.getElementById(id);
    if (!campo) return false;
    const v = campo.value.trim();
    return /^[0-9]{9}$/.test(v);
}

function checkEmail(id) {
    const campo = document.getElementById(id);
    if (!campo) return false;
    const v = campo.value.trim();
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
}

function checkEndereco(id) {
    const campo = document.getElementById(id);
    if (!campo) return false;
    const v = campo.value.trim();
    // Requisito: Obrigatório, entre 4 e 255 caracteres
    return v.length >= 4 && v.length <= 255;
}

function checkSobreMim(id) {
    const campo = document.getElementById(id);
    if (!campo) return false;
    const v = campo.value.trim();

    // Se estiver vazio, é válido (porque é opcional no banco de dados)
    if (v.length === 0) return true;

    // Se escreveu algo, tem que ter entre 4 e 450
    return v.length >= 4 && v.length <= 450;
}

// --- 2. Gestão do Botão ---
function gerirBotao() {
    const btn = document.getElementById("guardarPerfil");
    if (!btn) return;

    const isNomeOk = checkTexto("primeiroNome");
    const isSobreOk = checkTexto("ultimoNome");
    const isTelOk = checkTelefone("telefone");
    const isEmailOk = checkEmail("email");
    const isEnderecoOk = checkEndereco("endereco");
    const isSobreMimOk = checkSobreMim("sobre");

    if (isNomeOk && isSobreOk && isTelOk && isEmailOk && isEnderecoOk && isSobreMimOk) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
    } else {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
    }
}

// --- 3. Configuração de Listeners e Estilos ---
function configurarValidacao(id, tipo) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener("input", function() {
        let valido = false;
        if (tipo === 'sobre') valido = checkSobreMim(id);
        // ... outros ifs ...

        // Feedback Visual
        if (tipo === 'sobre' && this.value.trim().length === 0) {
            // Se estiver vazio, fica neutro (azul/cinza), mas NÃO impede o botão
            this.style.borderColor = "#0d6efd"; 
            this.style.boxShadow = "none";
        } else {
            this.style.borderColor = valido ? "#198754" : "#dc3545";
            this.style.boxShadow = valido 
                ? "0 0 0 0.25rem rgba(25, 135, 84, 0.25)" 
                : "0 0 0 0.25rem rgba(220, 53, 69, 0.25)";
        }

        gerirBotao();
    });
}

// --- 4. Execução Inicial ---
configurarValidacao("primeiroNome", "texto");
configurarValidacao("ultimoNome", "texto");
configurarValidacao("telefone", "tel");
configurarValidacao("email", "email");
configurarValidacao("endereco", "endereco");
configurarValidacao("sobre", "sobre");

function GuardarPerfil()
{
    let primeiroNome = document.getElementById("primeiroNome").value.trim();
    let ultimoNome = document.getElementById("ultimoNome").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let email = document.getElementById("email").value.trim();
    let endereco = document.getElementById("endereco").value.trim();
    let sobreMim = document.getElementById("sobre").value.trim();
    let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    var formData = {
        'primeiroNome': primeiroNome,
        'ultimoNome': ultimoNome,
        'telefone': telefone,
        'email': email,
        'endereco': endereco,
        'sobreMim': sobreMim,
        'csrfmiddlewaretoken': csrfToken
    };

    $.ajax({
        url: "/usuarios/perfil/",
        type: "POST",
        data: formData,
        success: function(response) 
        {
            // 1. Injeta a mensagem de sucesso (Criado ou Atualizado) que vem do Django
            document.getElementById("msgSucessoTexto").innerText = response.message;

            // 2. Cria a instância do modal e mostra
            var modalElem = document.getElementById('modalSucesso');
            var myModal = new bootstrap.Modal(modalElem);
            myModal.show();

            // 3. (Opcional) Recarregar a página APÓS o modal ser fechado
            modalElem.addEventListener('hidden.bs.modal', function () {
                window.location.reload();
            });
        },
        error: function(xhr) 
        {
            let res = xhr.responseJSON;
            let containerErro = document.getElementById("modalErroCorpo");
            
            if (res && res.errors) {
                let listaErros = '<ul class="list-group list-group-flush">';
                
                for (let campo in res.errors) {
                    listaErros += `
                        <li class="list-group-item d-flex align-items-center border-0 px-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc3545" class="me-2" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                            </svg>
                            <span>${res.errors[campo]}</span>
                        </li>`;
                }
                
                listaErros += '</ul>';
                containerErro.innerHTML = listaErros;
            } else {
                containerErro.innerHTML = '<p class="text-center py-3">Ocorreu um erro inesperado ao processar o seu perfil.</p>';
            }

            // Dispara o Modal do Bootstrap
            var errosPerfil = new bootstrap.Modal(document.getElementById('modalErro'));
            errosPerfil.show();
        },
        complete: function() {
            
        }
    });
}