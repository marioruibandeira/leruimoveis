// Selecionamos os elementos
const selectNegocio = document.getElementById('tipoNegocio');
const selectDuracao = document.getElementById('duracaoAnuncio');

const caixaPreco1 = document.getElementById('caixaPreco1');
const caixaPreco2 = document.getElementById('caixaPreco2');
const caixaPreco3 = document.getElementById('caixaPreco3');

const aderirPlano1 = document.getElementById('aderirPlano1');
const aderirPlano2 = document.getElementById('aderirPlano2');
const aderirPlano3 = document.getElementById('aderirPlano3');



selectDuracao.addEventListener('change', function() 
{
    const negocioVal = selectNegocio.value;
    const duracaoTexto = selectDuracao.options[selectDuracao.selectedIndex].text;

    if (negocioVal !== "0" && selectDuracao.value !== "0") {
        
        fetch(`${window.location.pathname}?negocio_id=${negocioVal}&periodo=${duracaoTexto}`)
            .then(response => response.json())
            .then(listaPlanos => {
                // listaPlanos será algo como: [{preco: "1.15", tipo_plano_id: 1}, {preco: "80", tipo_plano_id: 2}, ...]
                
                listaPlanos.forEach(plano => {
                    // Montamos o ID dinamicamente: valor-plano-1, valor-plano-2, etc.
                    const display = document.getElementById(`valor-plano-${plano.tipo_plano_id}`);
                    
                    if (display) {
                        display.innerText = plano.preco.toString().replace('.', ',');
                        
                        // Efeito visual de atualização
                        display.classList.add('text-primary');
                        setTimeout(() => display.classList.remove('text-primary'), 500);
                    }

                    const displayPeriodo = document.getElementById(`periodo-plano-${plano.tipo_plano_id}`);
                    if (displayPeriodo) {
                        // Aqui colocamos a barra "/" seguida do texto selecionado (ex: /15 dias)
                        displayPeriodo.innerText = `/${duracaoTexto}`;
                    }

                    const botao = document.getElementById(`link-pagamento-${plano.tipo_plano_id}`);
                    if (botao) {
                        const urlBase = "/pagamento/";
                        const novaUrl = `${urlBase}?plano_id=${plano.plano_id}`;
                        botao.href = novaUrl;
                    }
                        
                    caixaPreco1.style.display = 'block';
                    caixaPreco2.style.display = 'block';
                    caixaPreco3.style.display = 'block';

                    aderirPlano1.style.display = 'block';
                    aderirPlano2.style.display = 'block';
                    aderirPlano3.style.display = 'block';
                });
            })
            .catch(err => console.error("Erro ao carregar preços:", err));
    }
});

selectNegocio.addEventListener('change', function() 
{
    const valorNegocio = this.value; // 1 = Arrendar, 2 = Vender
    const opcao15Dias = selectDuracao.querySelector('option[value="1"]');

    if (valorNegocio === "2") {
        // Se for "Para Vender", esconde a opção de 15 dias
        if (opcao15Dias) {
            opcao15Dias.style.display = 'none';
            
            // Se o utilizador já tivesse 15 dias selecionado, resetamos para o padrão
            if (selectDuracao.value === "1") {
                selectDuracao.value = "0";
                // Opcional: podes disparar o evento change para limpar os preços nos cards
                selectDuracao.dispatchEvent(new Event('change'));
            }
        }
    } else {
        // Se for "Para Arrendar" ou "Seleciona", mostra os 15 dias novamente
        if (opcao15Dias) {
            opcao15Dias.style.display = 'block';
        }
    }
});