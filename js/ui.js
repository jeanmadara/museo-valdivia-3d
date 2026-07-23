/**
 * ui.js
 * ─────────────────────────────────────────────────────
 * Gestiona todos los elementos de interfaz de usuario:
 *  • Pantalla de carga con barra de progreso
 *  • Overlay de inicio (instrucciones de controles)
 *  • Mira (crosshair)
 *  • Pista ESC
 * No importa Three.js — solo manipula el DOM.
 */
import { isModalOpen } from './modal.js';

// ── Referencias al DOM ────────────────────────────────
const pfEl = document.getElementById('pf');
const ptEl = document.getElementById('pt');
const ldEl = document.getElementById('loading');
const soEl = document.getElementById('start-overlay');

// ── Estado de carga ───────────────────────────────────
let _loaded = 0;
let _total  = 0;

/**
 * Inicializa el contador de progreso.
 * Debe llamarse antes de comenzar a cargar texturas.
 * @param {number} total - Número total de recursos a cargar
 */
export function initProgress(total) {
  _total  = total;
  _loaded = 0;
}

/**
 * Registra un recurso cargado (o fallido).
 * Cuando todos los recursos están listos, oculta la
 * pantalla de carga y muestra el overlay de inicio.
 */
export function tick() {
  _loaded++;
  const pct = Math.round((_loaded / _total) * 100);
  pfEl.style.width = pct + '%';
  ptEl.textContent = pct + '%';

  if (_loaded >= _total) {
    setTimeout(() => {
      ldEl.classList.add('hidden');
      soEl.classList.remove('hidden');
    }, 500);
  }
}

/**
 * Conecta los controles FPS con la UI:
 *  • Botón "Entrar a la Sala" bloquea el cursor
 *  • Al bloquear: oculta overlay, activa crosshair/ESC hint
 *  • Al desbloquear: muestra overlay de nuevo
 *
 * @param {import('three/addons/controls/PointerLockControls.js').PointerLockControls} controls
 */
export function initUI(controls) {
  document.getElementById('start-btn').addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    soEl.classList.add('hidden');
    document.body.classList.add('locked');
  });

  controls.addEventListener('unlock', () => {
    if (!isModalOpen()) {
      soEl.classList.remove('hidden');
    }
    document.body.classList.remove('locked');
    document.body.style.cursor = 'default';
  });
}
