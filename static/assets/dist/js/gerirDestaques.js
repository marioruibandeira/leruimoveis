let datepickerDataInicio;

document.addEventListener('DOMContentLoaded', function () 
{
     // Date picker
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const limiteMax = new Date(hoje);
    limiteMax.setMonth(limiteMax.getMonth() + 6);

    datepickerDataInicio = flatpickr("#dataInicio", {
        locale: "pt",
        dateFormat: "d-m-Y",
        minDate: hoje,
        maxDate: limiteMax,
        allowInput: false,
        onChange: function () {
            calcularDataFim();
        }
    });

    //
    const inputNome = document.getElementById('ce_utilizador_nome');
    const inputHidden = document.getElementById('ce_utilizador');
    const listaSugestoes = document.getElementById('lista-sugestoes-utilizador');
    const tblListagem = document.getElementById('tblListagem');
    const divInp = document.getElementById('divInp');

    let debounceTimer;

    inputNome.addEventListener('input', function () 
    {
        const termo = inputNome.value.trim();

        // Se o utilizador editar o texto depois de já ter selecionado, invalida o ID guardado
        inputHidden.value = '';

        clearTimeout(debounceTimer);

        if (termo.length < 2) {
            listaSugestoes.style.display = 'none';
            listaSugestoes.innerHTML = '';
            return;
        }

        debounceTimer = setTimeout(() => {
            pesquisarUtilizador(termo);
        }, 300);
    });

    function pesquisarUtilizador(termo) {
        fetch(`${URL_PESQUISAR_UTILIZADOR}?q=${encodeURIComponent(termo)}`)
            .then(response => response.json())
            .then(data => renderizarSugestoes(data.resultados))
            .catch(error => console.error('Erro ao pesquisar utilizador:', error));
    }

    function renderizarSugestoes(resultados) {
        listaSugestoes.innerHTML = '';

        if (resultados.length === 0) {
            listaSugestoes.style.display = 'none';
            return;
        }

        resultados.forEach(utilizador => {
            const item = document.createElement('li');
            item.classList.add('list-group-item', 'list-group-item-action');
            item.style.cursor = 'pointer';
            item.textContent = utilizador.nome;

            item.addEventListener('click', function () {
                inputNome.value = utilizador.nome;
                inputHidden.value = utilizador.id;
                listaSugestoes.style.display = 'none';
                listaSugestoes.innerHTML = '';

                carregarListagens(utilizador.id);
                carregarTipoClienteEPrecos(utilizador.id);

            });

            listaSugestoes.appendChild(item);
        });

        listaSugestoes.style.display = 'block';        
    }

    // Fecha o dropdown ao clicar fora
    document.addEventListener('click', function (event) {
        if (!inputNome.contains(event.target) && !listaSugestoes.contains(event.target)) {
            listaSugestoes.style.display = 'none';
        }
    });
});

function carregarListagens(utilizadorId) 
{
    const tblListagem = document.getElementById('tblListagem');
    const tbody = document.getElementById('tbody-listagens');

    fetch(`/admin-panel/destaques/listagens/${utilizadorId}/`)
        .then(response => response.json())
        .then(data => {
            tbody.innerHTML = '';

            if (data.listagens.length === 0) {
                tblListagem.style.display = 'none';
                return;
            }

            data.listagens.forEach(listagem => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th scope="row">
                        <input class="form-check-input mt-0" type="radio" name="listagem_selecionada" value="${listagem.id}" aria-label="Selecionar listagem">
                    </th>
                    <td>${truncarTexto(listagem.titulo, 56)}</td>
                    <td>${listagem.created_at}</td>
                    <td style="color: ${listagem.status === 1 ? 'green' : 'inherit'}">
                        ${listagem.status === 1 ? 'Activo' : 'Inativo'}
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tblListagem.style.display = 'block';

            document.querySelectorAll('input[name="listagem_selecionada"]').forEach(radio => {
                radio.addEventListener('change', function () {
                    document.getElementById('divInp').style.display = 'block';
                });
            });
        })
        .catch(error => console.error('Erro ao carregar listagens:', error));
}

function truncarTexto(texto, limite) {
    if (texto.length <= limite) {
        return texto;
    }
    return texto.substring(0, limite) + '...';
}

function validarFormulario() {
    const numeroDias = document.getElementById('numeroDias').value;
    const dataInicio = document.getElementById('dataInicio').value.trim();
    const dataFim = document.getElementById('dataFim').value.trim();
    const confirmar = document.getElementById('confirmar').checked;
    const listagemSelecionada = document.querySelector('input[name="listagem_selecionada"]:checked');

    const tudoPreenchido = numeroDias !== "0" && dataInicio && dataFim && confirmar && listagemSelecionada;

    document.getElementById('btnGuardar').disabled = !tudoPreenchido;
}

//document.getElementById('preco').addEventListener('input', validarFormulario);


document.getElementById('numeroDias').addEventListener('change', validarFormulario);
document.getElementById('dataInicio').addEventListener('input', validarFormulario);
document.getElementById('dataFim').addEventListener('input', validarFormulario);
document.getElementById('confirmar').addEventListener('change', validarFormulario);

document.querySelectorAll('input[name="listagem_selecionada"]').forEach(radio => {
    radio.addEventListener('change', function () {
        document.getElementById('divInp').style.display = 'block';
        validarFormulario();
    });
});


function obterMoedaSelecionada() {
    const toggle = document.getElementById('paisSelecionado'); 
    return toggle.checked ? 'AOA' : 'EUR';
}

function carregarTipoClienteEPrecos(utilizadorId) {
    const moeda = obterMoedaSelecionada();

    fetch(`/admin-panel/destaques/tipo-cliente-precos/${utilizadorId}/?moeda=${moeda}`)
        .then(response => response.json())
        .then(data => {
            const campoTipoCliente = document.getElementById('tipoClienteTexto');
            const selectPrecos = document.getElementById('numeroDias');

            campoTipoCliente.value = data.tipo_cliente || 'Sem assinatura ativa';

            selectPrecos.innerHTML = '<option value="0">Selecione uma opção</option>';

            data.precos.forEach(item => {
                const option = document.createElement('option');
                option.value = item.plano_destaque_id;
                option.dataset.dias = item.dias;
                option.dataset.preco = item.preco;
                option.dataset.moeda = moeda;
                const simbolo = moeda === 'AOA' ? 'Kz' : '€';
                option.textContent = `${item.dias} dias — ${item.preco} ${simbolo}`;
                selectPrecos.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar tipo de cliente e preços:', error));
}

document.getElementById('paisSelecionado').addEventListener('change', function () {
    const utilizadorId = document.getElementById('ce_utilizador').value;
    if (utilizadorId) {
        carregarTipoClienteEPrecos(utilizadorId);
    }
});

document.getElementById('numeroDias').addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const dias = selectedOption.dataset.dias || '';
    const divNumeroDiasTexto = document.getElementById('divNumeroDiasTexto');

    if (dias) {
        document.getElementById('numeroDiasTexto').value = `${dias} dias`;
        divNumeroDiasTexto.style.display = 'block';
    } else {
        document.getElementById('numeroDiasTexto').value = '';
        divNumeroDiasTexto.style.display = 'none';
    }

    validarFormulario();
});

function formatarDataDDMMYYYY(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
}

function calcularDataFim() {
    const dataInicioSelecionada = datepickerDataInicio.selectedDates[0];
    const selectPrecos = document.getElementById('numeroDias');
    const selectedOption = selectPrecos.options[selectPrecos.selectedIndex];
    const dias = parseInt(selectedOption.dataset.dias);

    if (!dataInicioSelecionada || !dias) {
        document.getElementById('dataFim').value = '';
        validarFormulario();
        return;
    }

    const fim = new Date(dataInicioSelecionada);
    fim.setDate(fim.getDate() + dias);

    document.getElementById('dataFim').value = formatarDataDDMMYYYY(fim);
    validarFormulario();
}

document.getElementById('dataInicio').addEventListener('input', calcularDataFim);
document.getElementById('numeroDias').addEventListener('change', calcularDataFim);

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

function Guardar(event) 
{
    event.preventDefault();

    const utilizadorId = document.getElementById('ce_utilizador').value;
    const listagemSelecionada = document.querySelector('input[name="listagem_selecionada"]:checked');
    const selectPrecos = document.getElementById('numeroDias');
    const selectedOption = selectPrecos.options[selectPrecos.selectedIndex];
    const dataInicio = datepickerDataInicio.selectedDates[0];
    const dataFim = document.getElementById('dataFim').value;

    const payload = {
        utilizador_id: utilizadorId,
        listagem_id: listagemSelecionada.value,
        plano_destaque_id: selectedOption.value,
        preco_pago: selectedOption.dataset.preco,
        moeda_paga: selectedOption.dataset.moeda,
        data_inicio: dataInicio.toISOString().split('T')[0], // yyyy-mm-dd
        data_fim: converterParaISO(dataFim) // dd-mm-yyyy -> yyyy-mm-dd
    };

    fetch('/admin-panel/destaques/guardar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                mostrarModal('modalSucesso', 'Destaque criado com sucesso!');
            } else {
                mostrarModal('modalErro', 'Erro ao guardar: ' + data.erro);
            }
        })
        .catch(error => {
            console.error('Erro ao guardar destaque:', error);
            mostrarModal('modalErro', 'Erro ao guardar destaque.');
        });
}

function converterParaISO(dataDDMMYYYY) {
    const [dia, mes, ano] = dataDDMMYYYY.split('-');
    return `${ano}-${mes}-${dia}`;
}

function mostrarModal(id, texto) {
    document.getElementById(id + 'Texto').textContent = texto;
    const modal = document.getElementById(id);
    modal.style.display = 'block';
    modal.style.opacity = '1';
    modal.classList.add('show');
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'none';
    modal.classList.remove('show');
}

