    // Script para carregar a core do botão
    window.onload = function() 
    {
        const btnPrincipal = document.getElementById("btnPrincipal");
        btnPrincipal.style.backgroundColor = "#ff6600";
    };

    // função para alternar os botões e a tabela com o formulario
    function toggleForm()
    {
        var divDetalhes = document.getElementById("divDetalhes");
        var divFormulario = document.getElementById("divFormulario");
        var btnPrincipal = document.getElementById("btnPrincipal");
        var btnSecundario = document.getElementById("btnSecundario");

        divFormulario.style.display = "block";
        divDetalhes.style.display = "none";
        btnPrincipal.style.display = "none";
        btnSecundario.style.display = "block";
        btnSecundario.style.backgroundColor = "#6c757d";
    }

    // o inverso da função em cima
    function toggleDetalhes()
    {
        var divDetalhes = document.getElementById("divDetalhes");
        var divFormulario = document.getElementById("divFormulario");
        var btnPrincipal = document.getElementById("btnPrincipal");
        var btnSecundario = document.getElementById("btnSecundario");

        divFormulario.style.display = "none";
        divDetalhes.style.display = "block";
        btnPrincipal.style.display = "block";
        btnSecundario.style.display = "none"
    }

    // script para carregar os dados no formulario informações adicionais
    $(document).on("click", ".edit-property", function (e) {
        e.preventDefault();

        let id = $(this).data("id");
        let titulo = $(this).data("titulo");

        toggleForm();

        $("input[name='titulo']").val(titulo);
        $("input[name='listagem_id']").val(id);

        $.ajax({
            url: "/anuncios/caracteristicas/get/" + id + "/",
            type: "GET",

            success: function (data) {

                if (data.exists) {

                    // Campos simples
                    $("input[name='areaTotal']").val(data.area_total);
                    $("input[name='areaUtil']").val(data.area_util);
                    $("input[name='numeroQuartos']").val(data.numero_quartos);
                    $("input[name='numeroSuites']").val(data.numero_suites);
                    $("input[name='numeroCasasBanho']").val(data.numero_casas_banho);
                    $("input[name='numeroSalas']").val(data.numero_salas);
                    $("input[name='numeroCozinhas']").val(data.numero_cozinhas);
                    $("input[name='numeroVagasEstacionamento']").val(data.numero_vagas_estacionamento);
                    $("input[name='anoConstrucao']").val(data.ano_construcao);

                    // Radios
                    $("input[name='conservacao'][value='" + data.fk_estado_conservacao + "']").prop("checked", true);
                    $("input[name='piso'][value='" + data.fk_piso + "']").prop("checked", true);
                    $("input[name='pagamento'][value='" + data.fk_condicoes_pagamento + "']").prop("checked", true);
                    $("input[name='taxasAdicionais'][value='" + data.fk_taxas_adicionais + "']").prop("checked", true);

                    // Checkboxes: limpar tudo antes
                    $("input[name='infraInterna[]']").prop("checked", false);

                    // Marcar os selecionados
                    if (data.infra_interna && data.infra_interna.length > 0) {
                        data.infra_interna.forEach(function (infraId) {
                            $("input[name='infraInterna[]'][value='" + infraId + "']").prop("checked", true);
                        });
                    }
                    
                    $("input[name='infraExterno[]']").prop("checked", false);
                    //
                    if(data.infra_externo && data.infra_externo.length > 0){
                        data.infra_externo.forEach(function (externo_id){
                            $("input[name='infraExterno[]'][value='" + externo_id + "']").prop("checked", true);
                        })
                    }

                    $("input[name='comodidadeSeguranca[]']").prop("checked", false); 
                    // Marcar as comodidades selecionadas 
                    if (data.comodidade && data.comodidade.length > 0) { 
                        data.comodidade.forEach(function (comodidade_id) { 
                            $("input[name='comodidadeSeguranca[]'][value='" + comodidade_id + "']") .prop("checked", true); 
                        }); 
                    }

                    $("input[name='localizacaoAcessos[]']").prop("checked", false); 

                    if (data.localizacao && data.localizacao.length > 0) { 
                        data.localizacao.forEach(function (localizacao_id) { 
                            $("input[name='localizacaoAcessos[]'][value='" + localizacao_id + "']") .prop("checked", true); 
                        }); 
                    }

                    $("input[name='situacaoLegal[]']").prop("checked", false); 

                    if (data.situacaoLegal && data.situacaoLegal.length > 0) { 
                        data.situacaoLegal.forEach(function (situacaoLegal_id) { 
                            $("input[name='situacaoLegal[]'][value='" + situacaoLegal_id + "']") .prop("checked", true); 
                        }); 
                    }

                } else {

                    // Limpar campos
                    $("input[name='areaTotal']").val("");
                    $("input[name='areaUtil']").val("");
                    $("input[name='numeroQuartos']").val("");
                    $("input[name='numeroSuites']").val("");
                    $("input[name='numeroCasasBanho']").val("");
                    $("input[name='numeroSalas']").val("");
                    $("input[name='numeroCozinhas']").val("");
                    $("input[name='numeroVagasEstacionamento']").val("");
                    $("input[name='anoConstrucao']").val("");

                    // Limpar checkboxes comodidadeSeguranca[]
                    $("input[name='infraInterna[]']").prop("checked", false);
                    $("input[name='infraExterno[]']").prop("checked", false);
                    $("input[name='comodidadeSeguranca[]']").prop("checked", false);
                    $("input[name='localizacaoAcessos[]']").prop("checked", false);
                    $("input[name='situacaoLegal[]']").prop("checked", false);
                    

                    // Mantém título e ID
                    $("input[name='titulo']").val(titulo);
                    $("input[name='listagem_id']").val(id);
                }
            }
        });
    });

    //Função para adicionar e editar os dados
    $("#formCaracteristicas").submit(function(e){ 
        e.preventDefault(); 

        $.ajax({ 
            url: "/anuncios/caracteristicas/save/", 
            type: "POST",
            data: $(this).serialize(), 

            success: function(response) { 
                let alertDiv = $("#alertMsg");

                if (response.status === "success") {
                    alertDiv.removeClass().addClass("alert alert-success");
                } else {
                    alertDiv.removeClass().addClass("alert alert-danger");
                }

                alertDiv.text(response.message).fadeIn();

                // Opcional: esconder automaticamente depois de 4s
                setTimeout(() => alertDiv.fadeOut(), 4000);
            },

            error: function() {
                let alertDiv = $("#alertMsg");
                alertDiv.removeClass().addClass("alert alert-danger");
                alertDiv.text("Erro inesperado ao comunicar com o servidor.").fadeIn();
            }
        }); 
    });

    // Permitir apenas números entre 1 e 20 
    $(document).on("input", ".only-1-20", function () 
    { 
        let value = $(this).val(); 

        value = value.replace(/[^0-9]/g, ""); 

        let num = parseInt(value); 

        if (isNaN(num) || num < 1 || num > 20) 
        { 
            $(this).val(""); 
        } else { 
            $(this).val(num); 
        } 
    });

    //ANO DE CONSTRUÇÃO
   $(document).ready(function () {

        const anoAtual = new Date().getFullYear();

        $(document).on("input", ".only-year", function () 
        {
            let value = $(this).val();

            value = value.replace(/[^0-9]/g, "");

            if (value.length > 4) {
                $(this).val("");
                return;
            }

            if (value.length < 4) {
                $(this).val(value);
                return;
            }

            let ano = parseInt(value);

            if (isNaN(ano)) {
                $(this).val("");
                return;
            }

            if (ano < 1800) {
                $(this).val("");
                return;
            }

            if (ano > anoAtual) {
                $(this).val(anoAtual);
                return;
            }

            $(this).val(ano);
        });

    });

    //
    $(document).on("input", ".only-area", function () {

        let value = $(this).val();

        // Remove tudo que não seja número
        value = value.replace(/[^0-9]/g, "");

        // Se tiver mais que 4 dígitos → limpar
        if (value.length > 4) {
            $(this).val("");
            return;
        }

        // Converte para número
        let num = parseInt(value);

        // Se não for número → limpar
        if (isNaN(num)) {
            $(this).val("");
            return;
        }

        // Se for 0 → limpar (área não pode ser zero)
        if (num === 0) {
            $(this).val("");
            return;
        }

        // Valor válido
        $(this).val(num);
    });

    //
    //
    //
    $(document).on("click", ".ver-detalhes", function () 
    {
        let id = $(this).data("id");
        let titulo = $(this).data("titulo");

        // Preenche título da listagem
        $("#modal-titulo").text(titulo);
        $("#li-titulo").removeClass("d-none");

        // Buscar características
        $.ajax({
            url: "/anuncios/caracteristicas/get/" + id + "/",
            type: "GET",
            success: function (data) {

                if (!data.exists) {
                    console.log("Sem características");
                    return;
                }

                // ============================
                // MAPAS
                // ============================
                const MAP_CONSERVACAO = {1:"Novo",2:"Remodelado",3:"Usado"};
                const MAP_PISO = {1:"Cerâmica",2:"Madeira",3:"Porcelanato",4:"Laminado",5:"Vinílico",6:"Mármore",7:"Granito",8:"Cimento queimado / Microcimento",9:"Bambu",10:"Pedra natural",11:"Tatame / Carpete",12:"Linóleo",13:"Epóxi / resina",14:"Chão Bruto",15:"Mosaico"};
                const MAP_INFRA_INTERNA = {1:"Ar-condicionado",2:"Aquecimento de água",3:"Armários embutidos",4:"Closet",5:"Lavandaria",6:"Despensa",7:"Varanda",8:"Escritório",9:"Sala de jantar",10:"Sala de estar",11:"Hall de entrada"};
                const MAP_INFRA_EXTERNA = {1:"Jardim",2:"Piscina",3:"Quintal",4:"Churrasqueira",5:"Estacionamento coberto",6:"Portão automático",7:"Sistema de segurança",8:"Gerador",9:"Reservatório de água",10:"Poço de água",11:"Terraço",12:"Elevador",13:"Para prédios"};
                const MAP_COMODIDADES = {1:"Portaria",2:"Estacionamento para visitantes",3:"Ginásio",4:"Parque infantil",5:"Salão de festas",6:"Área de lazer",7:"Limpeza e manutenção",8:"Gestão condominial"};
                const MAP_LOCALIZACAO = {1:"Proximidade de escolas",2:"Proximidade de hospitais",3:"Proximidade de supermercados",4:"Proximidade de transportes",5:"Acesso a vias principais",6:"Distância ao centro da cidade",7:"Zona comercial próxima"};
                const MAP_SITUACAO_LEGAL = {1:"Título de propriedade",2:"Imóvel regularizado",3:"Sem dívidas",4:"Pronto para financiamento",5:"Contrato de arrendamento"};
                const MAP_PAGAMENTO = {1:"Pronto Pagamento",2:"Parcial",3:"Financiamento",4:"Negociável"};
                const MAP_TAXAS = {1:"Sem Taxas",2:"Condomínio",3:"Manutenção"};

                // ============================
                // HELPERS
                // ============================
                function preencherCampoSimples(valor, idLi, idSpan) {
                    if (valor !== null && valor !== undefined && String(valor).trim() !== "") {
                        $("#" + idSpan).text(valor);
                        $("#" + idLi).removeClass("d-none");
                    } else {
                        $("#" + idLi).addClass("d-none");
                    }
                }

                function preencherListaIds(listaIds, mapa, idTituloLi, idConteudoLi, idSpan) {
                    if (Array.isArray(listaIds) && listaIds.length > 0) {
                        const textos = listaIds.map(id => mapa[id]).filter(Boolean);
                        if (textos.length > 0) {
                            $("#" + idSpan).text(textos.join(", "));
                            $("#" + idTituloLi).removeClass("d-none");
                            $("#" + idConteudoLi).removeClass("d-none");
                            return;
                        }
                    }
                    $("#" + idTituloLi).addClass("d-none");
                    $("#" + idConteudoLi).addClass("d-none");
                }

                // ============================
                // CAMPOS SIMPLES
                // ============================
                preencherCampoSimples(data.area_total, "li-area-total", "modal-area-total");
                preencherCampoSimples(data.area_util, "li-area-util", "modal-area-util");
                preencherCampoSimples(data.numero_quartos, "li-quartos", "modal-quartos");
                preencherCampoSimples(data.numero_suites, "li-suites", "modal-suites");
                preencherCampoSimples(data.numero_casas_banho, "li-casas-banho", "modal-casas-banho");
                preencherCampoSimples(data.numero_salas, "li-salas", "modal-salas");
                preencherCampoSimples(data.numero_cozinhas, "li-cozinhas", "modal-cozinhas");
                preencherCampoSimples(data.numero_vagas_estacionamento, "li-vagas", "modal-vagas");
                preencherCampoSimples(data.ano_construcao, "li-ano", "modal-ano");

                preencherCampoSimples(MAP_CONSERVACAO[data.fk_estado_conservacao], "li-conservacao", "modal-conservacao");
                preencherCampoSimples(MAP_PISO[data.fk_piso], "li-piso", "modal-piso");
                preencherCampoSimples(MAP_PAGAMENTO[data.fk_condicoes_pagamento], "li-pagamento", "modal-pagamento");
                preencherCampoSimples(MAP_TAXAS[data.fk_taxas_adicionais], "li-taxas", "modal-taxas");

                // ============================
                // LISTAS (checkboxes)
                // ============================
                preencherListaIds(data.infra_interna, MAP_INFRA_INTERNA, "li-titulo-infra-interna", "li-infra-interna", "modal-infra-interna");
                preencherListaIds(data.infra_externo, MAP_INFRA_EXTERNA, "li-titulo-infra-externa", "li-infra-externa", "modal-infra-externa");
                preencherListaIds(data.comodidade, MAP_COMODIDADES, "li-titulo-comodidades", "li-comodidades", "modal-comodidades");

                // Estes dois só vão funcionar quando adicionares ao teu GET:
                preencherListaIds(data.localizacao_acessos, MAP_LOCALIZACAO, "li-titulo-localizacao", "li-localizacao", "modal-localizacao");
                preencherListaIds(data.situacao_legal, MAP_SITUACAO_LEGAL, "li-titulo-situacao-legal", "li-situacao-legal", "modal-situacao-legal");
            }
        });
    });

    


   