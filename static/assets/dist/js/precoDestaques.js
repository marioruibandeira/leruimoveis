document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('cards-precos-destaque');
    const toggle = document.getElementById('paisSelecionado');

    let tipoClienteAtivo = document.querySelector('.tab-tipo-cliente.active').dataset.id;

    function carregarPrecos() {
        const moeda = toggle.checked ? 'AOA' : 'EUR';

        fetch(`${URL_PRECOS_DESTAQUE_AJAX}?tipo_cliente_id=${tipoClienteAtivo}&moeda=${moeda}`)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';

                if (data.precos.length === 0) {
                    container.innerHTML = '<p class="text-center text-muted">Sem preços definidos.</p>';
                    return;
                }

                const simbolo = data.moeda === 'AOA' ? 'Kz' : '€';
                const maiorDuracao = Math.max(...data.precos.map(p => p.dias));

                data.precos.forEach(item => {
                    const destaque = item.dias === maiorDuracao;
                    const precoPorDia = (parseFloat(item.preco) / item.dias).toFixed(2);

                    const col = document.createElement('div');
                    col.className = 'col-6 col-md-4 col-lg-3';
                    col.innerHTML = `
                        <div class="card h-100 text-center ${destaque ? 'btn-outline-man border-2 shadow' : 'border-orange'}" style="border-radius: 12px; ${!destaque ? 'border-color: #ff6b00;' : ''}">
                            ${destaque ? '<div class="card-header text-dark fw-bold" style="border-radius: 10px 10px 0 0; background:#ff6b00">Melhor Oferta</div>' : ''}
                            <div class="card-body">
                                <h5 class="card-title mb-1">${item.dias} dias</h5>
                                <p class="text-muted small mb-2">${precoPorDia} ${simbolo}/dia</p>
                                <h4 class="fw-bold mb-3">${item.preco} ${simbolo}</h4>
                                <button type="button" class="btn ${destaque ? 'btn-main-laranja' : 'btn-outline-laranja'} w-100 btn-escolher-destaque"
                                        data-plano-destaque-id="${item.plano_destaque_id}">
                                    Escolher
                                </button>
                            </div>
                        </div>
                    `;
                    container.appendChild(col);
                });

                ligarBotoesEscolher();
            })
            .catch(error => {
                console.error('Erro ao carregar preços:', error);
                container.innerHTML = '<p class="text-center text-danger">Erro ao carregar preços.</p>';
            });
    }

    function ligarBotoesEscolher() {
        document.querySelectorAll('.btn-escolher-destaque').forEach(btn => {
            btn.addEventListener('click', function () {
                const planoDestaqueId = this.dataset.planoDestaqueId;

                fetch(URL_ESCOLHER_DESTAQUE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        plano_destaque_id: planoDestaqueId,
                        tipo_cliente_id: tipoClienteAtivo
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        window.location.href = data.redirect_url;
                    })
                    .catch(error => console.error('Erro ao escolher destaque:', error));
            });
        });
    }

    document.querySelectorAll('.tab-tipo-cliente').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab-tipo-cliente').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            tipoClienteAtivo = this.dataset.id;
            carregarPrecos();
        });
    });

    toggle.addEventListener('change', carregarPrecos);

    carregarPrecos();
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}