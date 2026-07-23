/**
 * modal.js
 * ─────────────────────────────────────────────────────
 * Gestiona el overlay de detalle de pintura.
 * Muestra la imagen en grande con información de la obra.
 * Se cierra con ESC, clic en el backdrop o botón X.
 */
import { IMAGE_FILES, PAINTING_INFO } from './config.js';

// ── Referencias al DOM ────────────────────────────────
const modalEl = document.getElementById('painting-modal');
const imgEl   = document.getElementById('pm-img');
const titleEl = document.getElementById('pm-title');
const artistEl = document.getElementById('pm-artist');
const descEl  = document.getElementById('pm-desc');
const backdropEl = modalEl.querySelector('.pm-backdrop');
const closeBtn   = modalEl.querySelector('.pm-close');

// ── Estado ────────────────────────────────────────────
let isOpen = false;

/**
 * Abre el modal con la información de la obra indicada.
 * @param {number} index - Índice de la pintura (0-8)
 */
export function openModal(index) {
  const info = PAINTING_INFO[index];
  if (!info) return;

  imgEl.src = '';
  imgEl.src = IMAGE_FILES[index];
  imgEl.alt = info.title;
  titleEl.textContent = info.title;
  artistEl.textContent = info.artist;
  descEl.textContent = info.desc;

  modalEl.classList.remove('hidden');
  isOpen = true;
}

/**
 * Cierra el modal y re-lockea el cursor.
 */
export function closeModal() {
  modalEl.classList.add('hidden');
  isOpen = false;
  window.dispatchEvent(new Event('painting-modal-close'));
}

/**
 * Indica si el modal está abierto.
 * @returns {boolean}
 */
export function isModalOpen() {
  return isOpen;
}

// ── Eventos de cierre ─────────────────────────────────
// Botón X
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeModal();
});

// Clic en el backdrop
backdropEl.addEventListener('click', closeModal);

// Tecla ESC
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && isOpen) {
    closeModal();
  }
});
