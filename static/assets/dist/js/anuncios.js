document.addEventListener("DOMContentLoaded", function() 
{
    const btnOpenTable = document.getElementById("btnOpenTable");
    btnOpenTable.style.backgroundColor = "#ff6600";
});

$(document).ready(function() {
    // 1. Verifica se a URL contém "?act=1"
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('act') === '1') {
        accaoTabela();
    }
});

$(document).ready(function() 
{
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('act') === '2') {
        accaoMobile();
    }
});

function accaoTabela() 
{ 
    const caixaDetalhes = document.getElementById("caixa-detalhes");
    const formView = document.getElementById("formImovel"); 
    const btnOpenTable = document.getElementById("btnOpenTable");
    const previewFoto = document.getElementById("preview-foto");

    formView.style.display = "block";   
    caixaDetalhes.style.display = "none";
    btnOpenTable.style.backgroundColor = "#6c757d"; 
    previewFoto.style.display = "none";
}

function accaoMobile() 
{ 
    const caixaDetalhes = document.getElementById("mobileDetalhes");
    const formView = document.getElementById("formImovel"); 
    const btnOpenMobile = document.getElementById("btnOpenMobile");
    const previewFoto = document.getElementById("preview-foto");

    formView.style.display = "block";   
    caixaDetalhes.style.display = "none"; 
    btnOpenMobile.style.backgroundColor = "#6c757d";
    previewFoto.style.display = "none";
}

function openTable()
{
    const caixaDetalhes = document.getElementById("caixa-detalhes");
    const formView = document.getElementById("formImovel"); 
    const btnOpenTable = document.getElementById("btnOpenTable");
    const btnOpenMobile = document.getElementById("btnOpenMobile");

    formView.style.display = "none";   
    caixaDetalhes.style.display = "block";
    btnOpenTable.style.backgroundColor = "#ff6600";
    btnOpenMobile.style.borderColor = "#f5ae7f";
}

    function openMobile()
    {
        const caixaDetalhes = document.getElementById("mobileDetalhes");
        const formView = document.getElementById("formImovel"); 
        const btnOpenMobile = document.getElementById("btnOpenMobile");

        formView.style.display = "none";   
        caixaDetalhes.style.display = "block"; 
        btnOpenMobile.style.backgroundColor = "#ff6600";
        btnOpenMobile.style.borderColor = "#f5ae7f";
    }

    /*Tracking Number e formating money*/
    document.getElementById("preco").addEventListener("input", function (e) {
        // remove non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, "");

        // check if value is <= 0
        if (this.value !== "" && parseInt(this.value) <= 0) {
            this.value = ""; // clear invalid input
            alert("O preço deve ser maior que zero.");
        }
    });


document.addEventListener('DOMContentLoaded', function () 
{
    const modal = document.getElementById('detalhesModal');

    modal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;

        // Receber dados do botão
        const titulo = button.getAttribute('data-titulo');
        const endereco = button.getAttribute('data-endereco');
        const cidade = button.getAttribute('data-cidade');
        const pais = button.getAttribute('data-pais');
        const paisid = button.getAttribute('data-paisid');
        const preco = button.getAttribute('data-preco');
        const descricao = button.getAttribute('data-descricao');
        const designacao = button.getAttribute('data-designacao');
        const data_create = button.getAttribute('data-data_create');

        // Preencher o modal
        document.getElementById('modal-titulo').textContent = titulo;
        document.getElementById('modal-endereco').textContent = endereco;
        document.getElementById('modal-local').textContent = cidade + ", " + pais;

        // Moeda
        const precoFormatado = Number(preco).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        const moeda = paisid == "1" ? "€ " : "AO ";
        document.getElementById('modal-preco').textContent = moeda + precoFormatado;

        // Descrição com enters
        document.getElementById('modal-descricao').innerHTML = descricao.replace(/\n/g, '<br>');

        document.getElementById('modal-designacao').textContent = designacao;
        document.getElementById('modal-data').textContent = data_create;
    });
});


document.addEventListener('DOMContentLoaded', function () 
{
    const modal = document.getElementById('addImagesModal');

    modal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;

        // Receber o caminho da imagem
        const foto = button.getAttribute('data-foto');

        // Preencher o modal
        const img = document.getElementById('modal-foto');

        if (foto && foto !== "") {
            img.src = foto;
        } else {
            img.src = "https://via.placeholder.com/600x400?text=Sem+Imagem";
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.edit-property').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            // Show the form instead of the table
            accaoTabela();
            accaoMobile();

            // Hidden ID for update
            document.getElementById('property_id').value = this.dataset.id || "";

            // Text inputs
            const titulo = document.querySelector('input[name="titulo"]');
            if (titulo) titulo.value = this.dataset.titulo || "";

            const endereco = document.querySelector('textarea[name="endereco"]');
            if (endereco) endereco.value = this.dataset.endereco || "";

            const descricao = document.querySelector('textarea[name="descricao"]');
            if (descricao) descricao.value = this.dataset.descricao || "";

            const preco = document.querySelector('input[name="preco"]');
            if (preco) preco.value = this.dataset.preco || "";

            // Selects
            const cidade = document.querySelector('select[name="cidade"]');
            if (cidade) cidade.value = this.dataset.cidade || "";

            const designacao = document.querySelector('select[name="designacao"]');
            if (designacao) designacao.value = this.dataset.designacao || "";

            // Radios (pais)
            document.querySelectorAll('input[name="pais"]').forEach(r => {
                r.checked = (r.value === String(this.dataset.pais));
            });

            // Preview image (cannot set file input directly)
            const preview = document.getElementById('preview-foto');
            if (preview) {
                preview.src = this.dataset.fotos || "https://via.placeholder.com/300x200?text=Sem+Imagem";
            }

            // Change submit button text
            const submitBtn = document.querySelector('input[type="submit"]');
            if (submitBtn) submitBtn.value = "Atualizar";

            const previewFoto = document.getElementById("preview-foto");
            previewFoto.style.display = "block";
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const paisRadios = document.querySelectorAll('input[name="pais"]');
    const cidadeSelect = document.querySelector('select[name="cidade"]');

    function filtrarCidades(paisId) {
        // percorre todas as opções
        Array.from(cidadeSelect.options).forEach(opt => {
            if (!opt.value) return; // ignora "Selecione a cidade"
            opt.style.display = (opt.dataset.pais === paisId) ? 'block' : 'none';
        });

        // resetar seleção
        cidadeSelect.value = "";
    }

    // inicializar com o país selecionado
    const checkedPais = document.querySelector('input[name="pais"]:checked');
    if (checkedPais) filtrarCidades(checkedPais.value);

    // quando mudar o país
    paisRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            filtrarCidades(this.value);
        });
    });
});
