document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formPedido');
    const tipoExistente = document.getElementById('tipoExistente');
    const tipoNova = document.getElementById('tipoNova');
    const painelExistente = document.getElementById('painelExistente');
    const painelNova = document.getElementById('painelNova');
    const camposNova = painelNova.querySelectorAll('input');
    const pesquisa = document.getElementById('pesquisaAgencia');
    const resultados = document.getElementById('resultadosAgencia');
    const agenciaId = document.getElementById('agenciaId');
    const selecionada = document.getElementById('agenciaSelecionada');
    const selecionadaNome = document.getElementById('agenciaSelecionadaNome');
    const limpar = document.getElementById('limparAgencia');
    const erro = document.getElementById('erroPedido');
    let temporizador = null;

    function mostrarErro(mensagem) {
        erro.textContent = mensagem;
        erro.classList.remove('d-none');
    }

    function limparErro() {
        erro.textContent = '';
        erro.classList.add('d-none');
    }

    function atualizarModo() {
        const nova = tipoNova.checked;
        painelNova.classList.toggle('d-none', !nova);
        painelExistente.classList.toggle('d-none', nova);
        camposNova.forEach(function (campo) {
            campo.disabled = !nova;
            campo.required = nova;
        });
        pesquisa.disabled = nova;
        agenciaId.disabled = nova;
        limparErro();
    }

    function fecharResultados() {
        resultados.classList.add('d-none');
        resultados.innerHTML = '';
    }

    function escolherAgencia(id, nome) {
        agenciaId.value = id;
        selecionadaNome.textContent = nome;
        selecionada.classList.remove('d-none');
        pesquisa.value = '';
        pesquisa.parentElement.classList.add('d-none');
        fecharResultados();
        limparErro();
    }

    function removerAgencia() {
        agenciaId.value = '';
        selecionadaNome.textContent = '';
        selecionada.classList.add('d-none');
        pesquisa.parentElement.classList.remove('d-none');
        pesquisa.focus();
    }

    function mostrarResultados(lista) {
        resultados.innerHTML = '';
        if (!lista.length) {
            const vazio = document.createElement('div');
            vazio.className = 'list-group-item text-muted';
            vazio.textContent = 'Nenhuma agência encontrada';
            resultados.appendChild(vazio);
        } else {
            lista.forEach(function (agencia) {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'list-group-item list-group-item-action text-start';
                item.textContent = agencia.nome;
                item.addEventListener('click', function () {
                    escolherAgencia(agencia.id, agencia.nome);
                });
                resultados.appendChild(item);
            });
        }
        resultados.classList.remove('d-none');
    }

    function pesquisarAgencias() {
        const termo = pesquisa.value.trim();
        if (termo.length < 2) {
            fecharResultados();
            return;
        }
        fetch(URL_PESQUISA_AGENCIAS + '?q=' + encodeURIComponent(termo), {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
            .then(function (resposta) { return resposta.json(); })
            .then(mostrarResultados)
            .catch(fecharResultados);
    }

    tipoExistente.addEventListener('change', atualizarModo);
    tipoNova.addEventListener('change', atualizarModo);

    pesquisa.addEventListener('input', function () {
        clearTimeout(temporizador);
        temporizador = setTimeout(pesquisarAgencias, 300);
    });

    limpar.addEventListener('click', removerAgencia);

    document.addEventListener('click', function (evento) {
        if (!resultados.contains(evento.target) && evento.target !== pesquisa) {
            fecharResultados();
        }
    });

    form.addEventListener('submit', function (evento) {
        limparErro();
        if (tipoExistente.checked && !agenciaId.value) {
            evento.preventDefault();
            mostrarErro('Escolha uma agência da lista.');
        }
    });

    atualizarModo();
});