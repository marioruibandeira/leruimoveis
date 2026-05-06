const estrelas = document.querySelectorAll('.estrela-btn');
const textos = ['', 'Mau', 'Razoável', 'Bom', 'Muito bom', 'Excelente'];

estrelas.forEach(estrela => {
    estrela.addEventListener('mouseover', function() {
        const valor = parseInt(this.dataset.valor);
        estrelas.forEach((s, i) => {
            s.setAttribute('fill', i < valor ? '#f59e0b' : '#dee2e6');
        });
    });

    estrela.addEventListener('mouseout', function() {
        const selecionado = parseInt(document.getElementById('avaliacaoValor').value);
        estrelas.forEach((s, i) => {
            s.setAttribute('fill', i < selecionado ? '#f59e0b' : '#dee2e6');
        });
    });

    estrela.addEventListener('click', function() {
        const valor = parseInt(this.dataset.valor);
        document.getElementById('avaliacaoValor').value = valor;
        document.getElementById('textoClassificacao').textContent = textos[valor];
        estrelas.forEach((s, i) => {
            s.setAttribute('fill', i < valor ? '#f59e0b' : '#dee2e6');
        });
    });
});

function EnviarAvaliacao() {
    const valor = parseInt(document.getElementById('avaliacaoValor').value);
    const nome = document.getElementById('avaliacaoNome').value.trim();
    const texto = document.getElementById('avaliacaoTexto').value.trim();

    if (valor === 0) {
        alert('Por favor seleciona uma classificação.');
        return;
    }
    if (nome.length < 2) {
        alert('Por favor insere o teu nome.');
        return;
    }
    if (texto.length < 10) {
        alert('A avaliação deve ter pelo menos 10 caracteres.');
        return;
    }

    console.log({ valor, nome, texto });
    // Aqui vem o AJAX para guardar na base de dados
}