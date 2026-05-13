//Função que formata o dinheiro para angola e portugal
function formatarPreco(valor) {
    return parseFloat(valor)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}