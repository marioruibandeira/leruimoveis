document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modalPedido');
    if (!modal) return;

    function texto(id, valor) {
        document.getElementById(id).textContent = valor || '—';
    }

    document.addEventListener('click', function (evento) {
        const botao = evento.target.closest('.btn-info-pedido');
        if (!botao) return;

        const linha = botao.closest('tr');
        const d = botao.dataset;

        texto('mpReferencia', d.referencia);
        texto('mpCriado', linha.cells[1].textContent.trim());
        texto('mpTipo', linha.cells[2].textContent.trim());
        texto('mpTotal', linha.cells[3].textContent.trim());
        texto('mpExpira', d.expira);
        texto('mpUtilizador', d.utilizador);
        texto('mpMetodo', d.metodo);
        texto('mpDescricao', d.descricao);

        document.getElementById('mpAgenciaBloco').classList.toggle('d-none', !d.agencia);
        texto('mpAgencia', d.agencia);
        texto('mpNif', d.nif);
        texto('mpContacto', d.contacto);

        bootstrap.Modal.getOrCreateInstance(modal).show();
    });
});



//
//
document.addEventListener('DOMContentLoaded', function () {
    const modalInfo = document.getElementById('modalPedido');
    const modalConfirmar = document.getElementById('modalConfirmar');

    function texto(id, valor) {
        document.getElementById(id).textContent = valor || '—';
    }

    function getCookie(nome) {
        const par = document.cookie.split('; ').find(function (c) { return c.startsWith(nome + '='); });
        return par ? decodeURIComponent(par.split('=')[1]) : '';
    }

    let urlConfirmar = '';

    document.addEventListener('click', function (evento) {
        const botaoInfo = evento.target.closest('.btn-info-pedido');
        const botaoConfirmar = evento.target.closest('.btn-confirmar');

        if (botaoInfo && modalInfo) {
            const linha = botaoInfo.closest('tr');
            const d = botaoInfo.dataset;

            texto('mpReferencia', d.referencia);
            texto('mpCriado', linha.cells[1].textContent.trim());
            texto('mpTipo', linha.cells[2].textContent.trim());
            texto('mpTotal', linha.cells[3].textContent.trim());
            texto('mpExpira', d.expira);
            texto('mpUtilizador', d.utilizador);
            texto('mpMetodo', d.metodo);
            texto('mpDescricao', d.descricao);

            document.getElementById('mpAgenciaBloco').classList.toggle('d-none', !d.agencia);
            texto('mpAgencia', d.agencia);
            texto('mpNif', d.nif);
            texto('mpContacto', d.contacto);

            bootstrap.Modal.getOrCreateInstance(modalInfo).show();
        }

        if (botaoConfirmar && modalConfirmar) {
            const linha = botaoConfirmar.closest('tr');
            const d = linha.querySelector('.btn-info-pedido').dataset;

            urlConfirmar = botaoConfirmar.dataset.url;

            texto('mcReferencia', botaoConfirmar.dataset.referencia);
            texto('mcTotal', linha.cells[3].textContent.trim());
            texto('mcUtilizador', d.utilizador);
            document.getElementById('mcAgenciaBloco').classList.toggle('d-none', !d.agencia);
            texto('mcAgencia', d.agencia);
            document.getElementById('mcNif').textContent = d.nif ? 'NIF ' + d.nif : '';

            document.getElementById('mcMetodo').value = 'whatsapp';
            document.getElementById('mcDocumento').value = '';
            document.getElementById('mcErro').classList.add('d-none');
            document.getElementById('mcConfirmar').disabled = false;

            bootstrap.Modal.getOrCreateInstance(modalConfirmar).show();
        }
    });

    const botaoFinal = document.getElementById('mcConfirmar');
    if (botaoFinal) {
        botaoFinal.addEventListener('click', function () {
            const erro = document.getElementById('mcErro');
            const dados = new FormData();
            dados.append('metodo', document.getElementById('mcMetodo').value);
            dados.append('documento_numero', document.getElementById('mcDocumento').value);

            botaoFinal.disabled = true;
            erro.classList.add('d-none');

            fetch(urlConfirmar, {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
                body: dados
            })
                .then(function (resposta) {
                    return resposta.json().then(function (json) { return { ok: resposta.ok, json: json }; });
                })
                .then(function (resultado) {
                    if (resultado.ok && resultado.json.sucesso) 
                    {
                        const modalConfirmacao = bootstrap.Modal.getInstance(
                            document.getElementById('modalConfirmar')
                        );

                        modalConfirmacao.hide();

                        document.getElementById('modalSucessoTexto').textContent =
                            'Pagamento confirmado com sucesso!';

                        const modalSucesso = new bootstrap.Modal(
                            document.getElementById('modalSucesso')
                        );

                        modalSucesso.show();
                        return;
                    }
                    erro.textContent = resultado.json.erro || 'Não foi possível confirmar o pagamento.';
                    erro.classList.remove('d-none');
                    botaoFinal.disabled = false;
                })
                .catch(function () {
                    erro.textContent = 'Erro de ligação. Tente novamente.';
                    erro.classList.remove('d-none');
                    botaoFinal.disabled = false;
                });
        });
    }
});