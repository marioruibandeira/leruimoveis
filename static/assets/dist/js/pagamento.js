document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('plano_id');

    if (pId) {
        // Tenta usar o caminho relativo direto se estiveres na mesma página
        const urlBusca = window.location.pathname + '?plano_id=' + pId + '&format=json';
        
        fetch(urlBusca)
            .then(res => {
                if (!res.ok) throw new Error("Erro 404: Rota não encontrada");
                return res.json();
            })
            .then(dados => {
                document.getElementById('nomePlano').innerText = dados.nome;
                document.getElementById('pagaPreco').innerText = `€ ${dados.preco.replace('.', ',')}`;
                document.getElementById('periodo').innerText = `/ ${dados.dias} dias`;
            })
            .catch(err => console.error("Erro no Fetch:", err));
    }
});