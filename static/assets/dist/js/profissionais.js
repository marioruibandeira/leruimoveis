//
document.getElementById('cbxNumeroAnuncios').addEventListener('change', function() 
{
    const cliente_id = 2;

    const listagem_id = this.options[this.selectedIndex].value;
    this.classList.add('select-check');
    
    const pathBase = window.location.pathname.replace(/\/$/, '') + '/';
    const url = `${pathBase}?cliente_id=${cliente_id}&listagem_id=${listagem_id}&format=json`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Status: " + response.status);
            return response.json();
        })
        .then(planos_dois => 
        {
            planos_dois.forEach(planos => 
            {
                const elementoPreco = document.getElementById(`valor-plano-${planos.tipo_plano_id}`);
                const displayPeriodo = document.getElementById(`periodo-plano-${planos.tipo_plano_id}`);
                const botao = document.getElementById(`link-pagamento-${planos.tipo_plano_id}`);

                if (elementoPreco) 
                {
                    const precoFormatado = planos.preco.toString().replace('.', ',');                  
                    elementoPreco.innerText = precoFormatado;
                    displayPeriodo.innerText = "/" + planos.periodo + " dias";
                    
                    if (botao) {
                        const urlBase = "/pagamento/";
                        const novaUrl = `${urlBase}?plano_id=${planos.plano_id}`;
                        botao.href = novaUrl;
                    }

                    caixaPreco1.style.display = 'block';
                    caixaPreco2.style.display = 'block';
                    caixaPreco3.style.display = 'block';

                    aderirPlano1.style.display = 'block';
                    aderirPlano2.style.display = 'block';
                    aderirPlano3.style.display = 'block';

                    //alert("ID do Cliente: " + planos.fk_tipo_cliente_id + " | Preço: " + planos.preco);

                } else {
                    console.warn(`Aviso: Elemento valor-plano-${planos.tipo_plano_id} não encontrado no HTML.`);
                }
            });
        })
    .catch(err => console.error("Erro no Fetch:", err));
});