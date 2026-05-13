//
document.getElementById('cbxNEmpreendimentos').addEventListener('change', function()
{
    const cliente_id = 3;
    const nEmprendimentos_id = this.options[this.selectedIndex].value;

    const caixas = [
        document.getElementById("caixaPreco1"),
        document.getElementById("caixaPreco2"),
        document.getElementById("caixaPreco3")
    ];

    const links = [
        document.getElementById("aderirPlano1"),
        document.getElementById("aderirPlano2"),
        document.getElementById("aderirPlano3"),
    ];

    const pathBase = window.location.pathname.replace(/\/$/, '') + '/';
    const url = `${pathBase}?cliente_id=${cliente_id}&nEmprendimentos_id=${nEmprendimentos_id}&format=json`;

    const numeroAnuncio1 = document.getElementById("numeroAnuncio1");
    const numeroAnuncio2 = document.getElementById("numeroAnuncio2");
    const numeroAnuncio3 = document.getElementById("numeroAnuncio3");

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Status: " + response.status);
            return response.json();
        })
        .then(planos_tres => 
        {
            planos_tres.forEach(planos => 
            {
                const tipo_plano_id = planos.tipo_plano_id;
                const elementoPreco = document.getElementById(`valor-plano-${planos.tipo_plano_id}`);
                const displayPeriodo = document.getElementById(`periodo-plano-${planos.tipo_plano_id}`);
                const botoesLinks = document.getElementById(`link-pagamento-${planos.tipo_plano_id}`);

                if(tipo_plano_id)
                {
                    //const precoFormatado = planos.preco.toString().replace('.', ','); 
                    const precoFormatado = planos.moeda + ' ' + formatarPreco(planos.preco);
                    elementoPreco.innerText = precoFormatado;

                    displayPeriodo.innerText = "/" + planos.periodo + "dias";

                    if (botoesLinks) {
                        const urlBase = "/pagamento/";
                        const novaUrl = `${urlBase}?plano_id=${planos.plano_id}`;
                        botoesLinks.href = novaUrl;
                    }
                    
                    caixas.forEach(caixa => {
                        if (caixa) caixa.style.display = 'block';
                    });
                    
                    links.forEach(link => {
                        if (link) link.style.display = 'block';
                    });

                    if(nEmprendimentos_id <= 3 && tipo_plano_id == 7)
                    {
                        if (nEmprendimentos_id) {
                            numeroAnuncio1.innerText = "80 anúncios";
                            numeroAnuncio1.style.display = "block";

                            numeroAnuncio2.innerText = "100 anúncios";
                            numeroAnuncio2.style.display = "block";

                            numeroAnuncio3.innerText = "150 anúncios";
                            numeroAnuncio3.style.display = "block";
                        }
                    }   
                    
                    if(nEmprendimentos_id > 3 && nEmprendimentos_id <= 6 && tipo_plano_id == 8)
                    {
                        if (nEmprendimentos_id) {
                            numeroAnuncio1.innerText = "200 anúncios";
                            numeroAnuncio1.style.display = "block";

                            numeroAnuncio2.innerText = "300 anúncios";
                            numeroAnuncio2.style.display = "block";

                            numeroAnuncio3.innerText = "400 anúncios";
                            numeroAnuncio3.style.display = "block";
                        }
                    } 

                    if(nEmprendimentos_id > 6 && nEmprendimentos_id <= 10 && tipo_plano_id == 9)
                    {
                        if (nEmprendimentos_id) {
                            numeroAnuncio1.innerText = "500 anúncios";
                            numeroAnuncio1.style.display = "block";

                            numeroAnuncio2.innerText = "1 500 anúncios";
                            numeroAnuncio2.style.display = "block";

                            numeroAnuncio3.innerText = "50 000 anúncios";
                            numeroAnuncio3.style.display = "block";
                        }
                    } 
                }                
            });            
        })
    .catch(err => console.error("Erro no Fetch:", err));

});