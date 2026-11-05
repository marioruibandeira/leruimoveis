function mostrarModal(id, texto) {
    const textoEl = document.getElementById(id + 'Texto');
    if (textoEl) textoEl.textContent = texto;
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