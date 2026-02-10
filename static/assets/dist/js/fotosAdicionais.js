document.addEventListener("DOMContentLoaded", function() 
{
    const btnPrincipal = document.getElementById("btnFotoPrincipal");
    const FotoPrincipalbtn = document.getElementById("FotoPrincipalbtn");
    
    if (btnPrincipal) {
        btnPrincipal.style.backgroundColor = "#ff6600";
        btnPrincipal.style.color = "#ffffff";
        FotoPrincipalbtn.style.backgroundColor = "#ff6600";
        FotoPrincipalbtn.style.color = "#ffffff";
    } else {
        console.warn("Elemento #btnFotoPrincipal não encontrado");
    }

    const btnSecundario = document.getElementById("btnFotoSecundario");
    if (btnSecundario) {
        btnSecundario.style.display = "none";
    } else {
        console.warn("Elemento #btnFotoSecundario não encontrado");
    }

    // Remove automaticamente a caixa de mensagem após 4 segundos 
    setTimeout(function() { 
        const alerts = document.querySelectorAll('.auto-dismiss'); 
        alerts.forEach(alert => { const bsAlert = new bootstrap.Alert(alert); 
            bsAlert.close(); }); 
        }, 4000
    );

    //==============================Gerador das Thumbnails==============================//
    let imagens = [];
    let indexAtual = 0;

    function gerarThumbnails() 
    {
        const container = document.getElementById("thumbContainer");
        container.innerHTML = "";

        imagens.forEach((foto, i) => {
            const thumb = document.createElement("img");

            thumb.src = foto.url;
            thumb.dataset.index = i;

            if (i === indexAtual) {
                thumb.classList.add("active-thumb");
            }

            thumb.addEventListener("click", () => {
                indexAtual = i;
                atualizarImagem();
                gerarThumbnails();
            });

            container.appendChild(thumb);
        });

        const ativo = container.querySelector(".active-thumb"); 
        if (ativo) 
        { 
            ativo.scrollIntoView({ 
                behavior: "smooth", 
                block: "nearest", 
                inline: "center" 
            }); 
        }
    }

    //=======================Gerador da imagem principal no modal======================//
    /*function atualizarImagem() {
        if (imagens.length > 0) {
            const img = document.getElementById("modalImage");
            img.src = "";
            img.offsetHeight;
            img.src = imagens[indexAtual].url;
            //img.src = imagens[indexAtual].url;

            document
                .querySelectorAll("#thumbContainer img")
                .forEach((thumb, i) => {
                    thumb.classList.toggle("active-thumb", i === indexAtual);
                });
        }
    }*/
    function atualizarImagem() 
    {
        if (imagens.length > 0) {
            const img = document.getElementById("modalImage");
            const descricao = document.getElementById("descricaoImagem");

            // Reset para forçar reload
            img.src = "";
            img.offsetHeight;

            // Atualiza imagem
            img.src = imagens[indexAtual].url;

            // Atualiza descrição
            descricao.textContent =
                imagens[indexAtual].descricao && imagens[indexAtual].descricao.trim() !== ""
                    ? imagens[indexAtual].descricao
                    : "Sem descrição disponível.";

            // Atualizar destaque das miniaturas
            document
                .querySelectorAll("#thumbContainer img")
                .forEach((thumb, i) => {
                    thumb.classList.toggle("active-thumb", i === indexAtual);
                });
        }
    }



    // Quando o utilizador clica no ícone "ver detalhes"
    document.querySelectorAll(".ver-detalhes").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault(); // impede o comportamento padrão

            const listagemId = this.dataset.id;

            fetch(`/anuncios/api/fotos/${listagemId}/`)
            .then(response => response.json())
            .then(data => {
                if (!data || !data.fotos) {
                mostrarAlertaSemFotos();
                return;
                }

                imagens = data.fotos;

                if (imagens.length === 0) {
                mostrarAlertaSemFotos();
                return;
                }

                indexAtual = 0;
                atualizarImagem();
                gerarThumbnails();

                // abrir modal principal
                const modal = new bootstrap.Modal(
                document.getElementById("detalhesModal")
                );
                modal.show();
            })
            .catch(() => {
                mostrarAlertaSemFotos();
            });
        });
    });

    document.getElementById("btnPrev").addEventListener("click", function () 
    {
        if (imagens.length > 0) {
            indexAtual = (indexAtual - 1 + imagens.length) % imagens.length;
            atualizarImagem();
            gerarThumbnails(); // ← ADICIONADO
        }
    });

    document.getElementById("btnNext").addEventListener("click", function () 
    {
        if (imagens.length > 0) {
            indexAtual = (indexAtual + 1) % imagens.length;
            atualizarImagem();
            gerarThumbnails(); // ← ADICIONADO
        }
    });

    /// alerta para quando não tiver fotos
    function mostrarAlertaSemFotos() 
    { 
        const alerta = new bootstrap.Modal(document.getElementById("alertaSemFotos")); 
        alerta.show(); 
    }

    //=====================================================================================//
    //===============================alerta para apagar====================================//
    const deleteButtons = document.querySelectorAll(".btn-delete-fotos");
    const modalSemFotos = new bootstrap.Modal(document.getElementById("modalSemFotos"));
    
    const modalConfirmar = new bootstrap.Modal(document.getElementById("modalConfirmarEliminacao"));
    const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const listagemId = this.dataset.id;
            const deleteUrl = this.dataset.url;

            // Verificar se existem fotos
            fetch(`/anuncios/api/fotos/${listagemId}/`)
            .then(response => response.json())
            .then(data => {
                // Se não houver fotos → mostrar modal de aviso
                if (!data || !Array.isArray(data.fotos) || data.fotos.length === 0) {
                modalSemFotos.show();
                return;
                }

                // Se houver fotos → abrir modal de confirmação
                btnConfirmarEliminar.setAttribute("href", deleteUrl);
                modalConfirmar.show();
            })
            .catch(() => {
                modalSemFotos.show();
            });
        });
    });

    //Apagar uma unica foto
    document.getElementById("btnDeleteFoto").addEventListener("click", function () {
        const fotoId = imagens[indexAtual].id;

        if (!fotoId) {
            console.error("Foto sem ID. Não é possível apagar.");
            return;
        }

        fetch(`/anuncios/delete-foto/${fotoId}/`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remover do array local
                    imagens.splice(indexAtual, 1);

                    // Se não houver mais fotos → fechar modal
                    if (imagens.length === 0) {
                        const modal = bootstrap.Modal.getInstance(
                            document.getElementById("detalhesModal")
                        );
                        modal.hide();
                        return;
                    }

                    // Ajustar indexAtual
                    if (indexAtual >= imagens.length) {
                        indexAtual = imagens.length - 1;
                    }

                    atualizarImagem();
                    gerarThumbnails();
                }
            });
    });
});

//Este codigo trata de levar o titulo e a chave no formulario
$(document).on("click", ".add-foto", function (e) {
    e.preventDefault();

    let id = $(this).data("id");
    let titulo = $(this).data("titulo");

    $("input[name='titulo']").val(titulo);
    $("input[name='listagem_id']").val(id);
});


//
// togles
//
function AbrirFormularioPC()
{
    const divAddFotos = document.getElementById("divAddFotos");
    const btnFotoPrincipal = document.getElementById("btnFotoPrincipal");
    const btnFotoSecundario = document.getElementById("btnFotoSecundario");
    const divFotoDetalhes = document.getElementById("divFotoDetalhes");

    divAddFotos.style.display = "block";
    btnFotoPrincipal.style.display = "none";
    btnFotoSecundario.style.display = "block";
    btnFotoSecundario.style.backgroundColor = "#6c757d";
    divFotoDetalhes.style.display = "none";
}

function FecharFormularioPC()
{
    const divAddFotos = document.getElementById("divAddFotos");
    const btnFotoPrincipal = document.getElementById("btnFotoPrincipal");
    const btnFotoSecundario = document.getElementById("btnFotoSecundario");
    const divFotoDetalhes = document.getElementById("divFotoDetalhes");

    divAddFotos.style.display = "none";
    btnFotoPrincipal.style.display = "block";
    btnFotoSecundario.style.display = "none";
    btnFotoSecundario.style.backgroundColor = "#6c757d";
    divFotoDetalhes.style.display = "block";
}

function AbrirFormularioTelefone()
{
    const divAddFotos = document.getElementById("divAddFotos");
    const FotoPrincipalbtn = document.getElementById("FotoPrincipalbtn");
    const FotoSecundariobtn = document.getElementById("FotoSecundariobtn");
    const mobileDetalhes = document.getElementById("mobileDetalhes");

    divAddFotos.style.display = "block";
    FotoPrincipalbtn.style.display = "none";
    FotoSecundariobtn.style.display = "block";
    FotoSecundariobtn.style.backgroundColor = "#6c757d";
    mobileDetalhes.style.display = "none";
}

function FecharFormularioTelefone()
{
    const divAddFotos = document.getElementById("divAddFotos");
    const FotoPrincipalbtn = document.getElementById("FotoPrincipalbtn");
    const FotoSecundariobtn = document.getElementById("FotoSecundariobtn");
    const mobileDetalhes = document.getElementById("mobileDetalhes");

    divAddFotos.style.display = "none";
    FotoPrincipalbtn.style.display = "block";
    FotoSecundariobtn.style.display = "none";
    FotoSecundariobtn.style.backgroundColor = "#ff6600";
    mobileDetalhes.style.display = "block";
}

function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }

    return cookieValue;
}





