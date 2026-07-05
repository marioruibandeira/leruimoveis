
// ───────────────────────────────────────────────
//               ELEMENTOS
// ───────────────────────────────────────────────
const uploadArea  = document.getElementById('uploadArea');
const fileInput   = document.getElementById('fileInput');
const image       = document.getElementById('image');
const cropper     = document.getElementById('cropper');
const cropBox     = document.getElementById('cropBox');
const cropBtn     = document.getElementById('cropBtn');
const resetBtn    = document.getElementById('resetBtn');
const saveBtn     = document.getElementById('saveBtn');
const preview     = document.getElementById('cropped-preview');
const message     = document.getElementById('message');
const canvas      = document.getElementById('canvas');

let isDragging = false;
let isResizing = false;
let resizeHandle = null;
let startX, startY;
let hasCropped = false;

// ───────────────────────────────────────────────
//               UPLOAD
// ───────────────────────────────────────────────
uploadArea.addEventListener('click', () => fileInput.click());

['dragover','dragenter'].forEach(ev => uploadArea.addEventListener(ev, e => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
}));

['dragleave','drop'].forEach(ev => uploadArea.addEventListener(ev, e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
}));

uploadArea.addEventListener('drop', e => {
  const file = e.dataTransfer.files[0];
  if (file?.type.startsWith('image/')) loadImage(file);
});

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) loadImage(file);
});

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = e => {
    image.src = e.target.result;
    image.onload = initializeAfterImageLoad;
  };
  reader.readAsDataURL(file);
}

function initializeAfterImageLoad() {
  resetCropper();
  cropBox.style.display = 'block';
  hasCropped = false;
  preview.style.display = 'none';
  saveBtn.style.display = 'none';
  message.textContent = '';
  cropBtn.disabled = false;
}

// ───────────────────────────────────────────────
//          RESET / REINICIAR
// ───────────────────────────────────────────────
function resetCropper() {
  const rect = cropper.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height) * 0.75;
  cropBox.style.width  = `${size}px`;
  cropBox.style.height = `${size}px`;
  cropBox.style.left   = `${(rect.width  - size)/2}px`;
  cropBox.style.top    = `${(rect.height - size)/2}px`;
}

resetBtn.addEventListener('click', () => {
  fileInput.value = '';
  image.src = '';
  cropBox.style.display = 'none';
  preview.style.display = 'none';
  saveBtn.style.display = 'none';
  message.textContent = '';
  cropBtn.disabled = true;
});

// ───────────────────────────────────────────────
//          INÍCIO DO DRAG / RESIZE
// ───────────────────────────────────────────────
function startEvent(e) {
  e.preventDefault();
  const touch = e.touches ? e.touches[0] : e;

  if (e.target.classList.contains('resize-handle')) {
    isResizing = true;
    resizeHandle = e.target.className.split(' ').pop();
  } else if (cropBox === e.target || cropBox.contains(e.target)) {
    isDragging = true;
  }

  const rect = cropBox.getBoundingClientRect();
  startX = touch.clientX - rect.left;
  startY = touch.clientY - rect.top;
}

// ───────────────────────────────────────────────
//          MOVIMENTO (principal correção aqui)
// ───────────────────────────────────────────────
function moveEvent(e) {
  if (!isDragging && !isResizing) return;
  e.preventDefault();

  const touch = e.touches ? e.touches[0] : e;
  const contRect = cropper.getBoundingClientRect();
  const imgRect  = image.getBoundingClientRect();

  let left = parseFloat(cropBox.style.left)   || 0;
  let top  = parseFloat(cropBox.style.top)    || 0;
  let size = parseFloat(cropBox.style.width)  || 50;

  const relX = touch.clientX - contRect.left;
  const relY = touch.clientY - contRect.top;

  if (isResizing) {
    let newLeft = left;
    let newTop  = top;
    let newSize = size;

    const right  = left + size;
    const bottom = top  + size;

    let candidate;

    if      (resizeHandle === 'br') candidate = Math.max(relX - left, relY - top);
    else if (resizeHandle === 'bl') { candidate = Math.max(right - relX, relY - top);      newLeft = right - candidate; }
    else if (resizeHandle === 'tr') { candidate = Math.max(relX - left, bottom - relY);    newTop  = bottom - candidate; }
    else if (resizeHandle === 'tl') { candidate = Math.max(right - relX, bottom - relY);   newLeft = right - candidate; newTop = bottom - candidate; }

    newSize = Math.max(50, candidate);

    // LIMITES DA IMAGEM
    const imgLeft   = imgRect.left   - contRect.left;
    const imgTop    = imgRect.top    - contRect.top;
    const imgRight  = imgLeft + imgRect.width;
    const imgBottom = imgTop  + imgRect.height;

    newLeft = Math.max(imgLeft,   Math.min(newLeft,   imgRight  - newSize));
    newTop  = Math.max(imgTop,    Math.min(newTop,    imgBottom - newSize));
    newSize = Math.min(newSize, imgRight  - newLeft);
    newSize = Math.min(newSize, imgBottom - newTop);

    cropBox.style.left   = `${newLeft}px`;
    cropBox.style.top    = `${newTop}px`;
    cropBox.style.width  = `${newSize}px`;
    cropBox.style.height = `${newSize}px`;  // sempre igual!
  }
  else if (isDragging) {
    let newLeft = relX - startX;
    let newTop  = relY  - startY;

    const imgLeft   = imgRect.left   - contRect.left;
    const imgTop    = imgRect.top    - contRect.top;
    const imgRight  = imgLeft + imgRect.width;
    const imgBottom = imgTop  + imgRect.height;

    newLeft = Math.max(imgLeft, Math.min(newLeft, imgRight  - size));
    newTop  = Math.max(imgTop,  Math.min(newTop,  imgBottom - size));

    cropBox.style.left = `${newLeft}px`;
    cropBox.style.top  = `${newTop}px`;
  }
}

function endEvent() {
  isDragging = false;
  isResizing = false;
  resizeHandle = null;
}

cropBox.addEventListener('mousedown', startEvent);
cropBox.addEventListener('touchstart', startEvent, { passive: false });
document.addEventListener('mousemove', moveEvent);
document.addEventListener('touchmove', moveEvent, { passive: false });
document.addEventListener('mouseup', endEvent);
document.addEventListener('touchend', endEvent);

// ───────────────────────────────────────────────
//               CORTAR → 250×250 JPEG
// ───────────────────────────────────────────────
cropBtn.addEventListener('click', () => {
  if (!image.complete || cropBox.style.display === 'none') return;

  const contRect = cropper.getBoundingClientRect();
  const imgRect  = image.getBoundingClientRect();
  const cropRect = cropBox.getBoundingClientRect();

  const cropLeft   = cropRect.left   - contRect.left;
  const cropTop    = cropRect.top    - contRect.top;
  const cropSize   = cropRect.width;   // já é quadrado

  const scaleX = image.naturalWidth  / imgRect.width;
  const scaleY = image.naturalHeight / imgRect.height;

  let sx = (cropLeft - (imgRect.left - contRect.left)) * scaleX;
  let sy = (cropTop  - (imgRect.top  - contRect.top )) * scaleY;
  let sSize = cropSize * scaleX;   // assumindo que scaleX ≈ scaleY na maioria dos casos

  sx = Math.max(0, Math.min(sx, image.naturalWidth  - sSize));
  sy = Math.max(0, Math.min(sy, image.naturalHeight - sSize));

  const OUTPUT_SIZE = 250;
  canvas.width = canvas.height = OUTPUT_SIZE;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(image, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  preview.src = dataUrl;
  preview.style.display = 'block';
  saveBtn.style.display = 'block';
  hasCropped = true;
  message.textContent = '';
  cropBtn.disabled = true;
});

// ───────────────────────────────────────────────
//             GUARDAR VIA AJAX
// ───────────────────────────────────────────────
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

saveBtn.addEventListener('click', async () => {
  if (!hasCropped) return;

  saveBtn.disabled = true;
  message.className = '';
  message.textContent = 'A guardar...';

  try {
    const blob = await (await fetch(preview.src)).blob();
    const formData = new FormData();
    formData.append('cropped_image', blob, 'recorte.jpg');

    const response = await fetch(window.location.pathname, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      message.className = 'success';
      message.textContent = result.message || 'Logotipo guardado com sucesso!';

      var imgLogotipo = document.getElementById('imgLogotipo');
      if (imgLogotipo) {
          imgLogotipo.src = preview.src;
      } else {
          var div = document.createElement('div');
          div.className = 'row';
          div.style.marginTop = '10px';
          div.innerHTML = `
              <div class="col-12 mb-3" style="text-align: center;">
                  <div class="containe" style="position: relative; display: inline-block;">
                      <img id="imgLogotipo" src="${preview.src}" title="Logotipo atual" style="max-width: 250px; max-height: 250px;">
                      <button type="button" onclick="EliminarLogotipo()"
                          style="position: absolute; top: 25px; right: 25px; background: #dc3545; border: none; border-radius: 4px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                          <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#fff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                      </button>
                  </div>
              </div>`;
          document.querySelector('.containe').parentElement.insertBefore(div, document.querySelector('.containe').parentElement.firstChild);
      }
    } else {
      message.className = 'error';
      message.textContent = result.message || 'Erro ao guardar o logotipo.';
    }
  } catch (err) {
    message.className = 'error';
    message.textContent = 'Erro de ligação. Tenta novamente.';
  } finally {
    saveBtn.disabled = false;
  }
});

function EliminarLogotipo() {
    fetch(window.location.pathname, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'action=eliminar'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            document.getElementById('imgLogotipo').parentElement.parentElement.parentElement.remove();
        } else {
            alert(result.message);
        }
    })
    .catch(() => alert('Erro de ligação.'));
}