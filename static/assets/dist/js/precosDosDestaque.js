let precoOriginal = null;

document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);
    const idAtualizado = urlParams.get('atualizado');

    if (idAtualizado) {
        const linha = document.getElementById(`preco-row-${idAtualizado}`);
        if (linha) {
            linha.style.backgroundColor = '#7BF1A8';
            linha.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Remove o destaque suavemente após alguns segundos
            setTimeout(() => {
                linha.style.transition = 'background-color 1s ease';
                linha.style.backgroundColor = '';
            }, 3000);
        }

        // Limpa o parâmetro da URL sem recarregar, para não reaplicar ao dar refresh manual
        urlParams.delete('atualizado');
        const novaUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, '', novaUrl);
    }

    document.addEventListener('click', function (event) {
        const btn = event.target.closest('.btn-editar-preco');
        if (btn) {
            event.preventDefault();
            const id = btn.dataset.id;
            carregarPrecoParaEdicao(id);
        }
    });

    function carregarPrecoParaEdicao(id) {
        fetch(`/admin-panel/destaques/precos/detalhes/${id}/`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('preco_id').value = data.id;
                document.getElementById('tipoCliente').value = data.tipo_cliente;
                document.getElementById('numeroDias').value = `${data.dias} dias`;
                document.getElementById('moeda').value = data.moeda;
                document.getElementById('preco').value = data.preco;

                precoOriginal = data.preco;
                document.getElementById('btnGuardar').disabled = true;

                document.getElementById('divDetalhes').style.display = 'none';
                document.getElementById('divForm').style.display = 'block';
                document.getElementById('divForm').scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => console.error('Erro ao carregar preço:', error));
    }

    document.getElementById('preco').addEventListener('input', function () {
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = (this.value === precoOriginal || this.value.trim() === '');
    });

});

function Guardar(event) {
    event.preventDefault();

    const precoId = document.getElementById('preco_id').value;
    const novoPreco = document.getElementById('preco').value;

    if (!precoId) {
        alert('Seleciona um preço para editar primeiro.');
        return;
    }

    fetch(`/admin-panel/destaques/precos/atualizar/${precoId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ preco: novoPreco })
    })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                document.querySelector(`#preco-row-${precoId} td:nth-child(5)`).textContent = novoPreco;
                mostrarModal('modalSucesso', 'Preço atualizado com sucesso!');
                window.precoIdAtualizado = precoId; 
            } else {
                mostrarModal('modalErro', 'Erro ao atualizar: ' + data.erro);
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar preço:', error);
            mostrarModal('modalErro', 'Erro ao atualizar preço.');
        });
}

function Cancelar() {
    document.getElementById('preco_id').value = '';
    document.getElementById('tipoCliente').value = '';
    document.getElementById('numeroDias').value = '';
    document.getElementById('moeda').value = '';
    document.getElementById('preco').value = '';
    precoOriginal = null;
    document.getElementById('btnGuardar').disabled = true;

    document.getElementById('divForm').style.display = 'none';
    document.getElementById('divDetalhes').style.display = 'block';
}

function fecharComReload() {
    const url = new URL(window.location.href);
    url.searchParams.set('atualizado', window.precoIdAtualizado);
    window.location.href = url.toString();
}