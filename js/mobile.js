/**
 * mobile.js
 * ─────────────────────────────────────────────────────
 * Sistema de controles táctiles para dispositivos móviles:
 *  • Detección de dispositivos móviles / pantallas táctiles
 *  • Joystick virtual para movimiento (zona izquierda)
 *  • Arrastre táctil para rotar la cámara (zona derecha)
 *  • Botón de acción para interactuar con obras
 *  • Adaptaciones de UI para pantallas pequeñas
 */
import * as THREE from 'three';
import { camera } from './scene.js';
import { HALF_W, HALF_D, SPEED, PLAYER_EYE_H, WALL_MARGIN } from './config.js';
import { paintingMeshes } from './paintings.js';
import { openModal, isModalOpen } from './modal.js';
import { textPanelMesh, linkY } from './textpanel.js';

// ── Detección de móvil ────────────────────────────────
export const isMobile = (() => {
  const ua = navigator.userAgent || navigator.vendor || '';
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const smallScreen = window.innerWidth <= 1024;
  return (hasTouchScreen && smallScreen) || mobileUA;
})();

// ── Estado interno ────────────────────────────────────
let mobileActive = false;

// Joystick
let joystickTouch = null;
let joystickOrigin = { x: 0, y: 0 };
let joystickDelta  = { x: 0, y: 0 };
const JOYSTICK_MAX_RADIUS = 50; // px

// Look (rotación de cámara)
let lookTouch = null;
let lookPrev  = { x: 0, y: 0 };
const LOOK_SENSITIVITY = 0.003;

// Cámara euler
let yaw   = 0;   // rotación horizontal (eje Y)
let pitch = 0;   // rotación vertical (eje X)
const MAX_PITCH = Math.PI / 2 - 0.05;

// Raycasting
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

/** @type {{ mesh: THREE.Mesh, index: number } | null} */
let targetedPainting = null;
let targetingLink = false;

// Límites de colisión
const bounds = {
  minX: -HALF_W + WALL_MARGIN,
  maxX:  HALF_W - WALL_MARGIN,
  minZ: -HALF_D + WALL_MARGIN,
  maxZ:  HALF_D - WALL_MARGIN,
};

// ── Elementos del DOM ─────────────────────────────────
let joystickContainer, joystickBase, joystickThumb;
let actionBtn;
let mobileHud;

/**
 * Inicializa los controles táctiles si estamos en un móvil.
 * Debe llamarse después de que el DOM esté listo.
 */
export function initMobile() {
  if (!isMobile) return;
  mobileActive = true;

  // Marcar el body como móvil
  document.body.classList.add('is-mobile');

  // Ocultar el crosshair del escritorio
  const crosshair = document.getElementById('crosshair');
  if (crosshair) crosshair.style.display = 'none';

  // Ocultar el esc-hint (no aplica en móvil)
  const escHint = document.getElementById('esc-hint');
  if (escHint) escHint.style.display = 'none';

  // Ajustar instrucciones del overlay de inicio
  adaptStartOverlay();

  // Crear elementos de HUD táctil
  createMobileHUD();

  // Registrar eventos táctiles
  registerTouchEvents();

  // Inicializar la rotación de cámara a partir de su euler actual
  const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
  yaw   = euler.y;
  pitch = euler.x;
}

/**
 * Adapta el overlay de inicio para mostrar controles móviles
 */
function adaptStartOverlay() {
  const controlsGrid = document.querySelector('.controls-grid');
  if (!controlsGrid) return;

  controlsGrid.innerHTML = `
    <div class="ctrl-item"><span class="key">🕹️</span> Moverse</div>
    <div class="ctrl-item"><span class="key">👆</span> Mirar</div>
    <div class="ctrl-item"><span class="key">🔍</span> Ver obra</div>
    <div class="ctrl-item"><span class="key">✕</span> Cerrar</div>
  `;

  // Cambiar texto descriptivo
  const descP = document.querySelector('.start-card p');
  if (descP) {
    descP.textContent = 'Usa el joystick para moverte y desliza para mirar. Toca el botón de lupa cuando estés cerca de una obra.';
  }
}

/**
 * Crea los elementos del HUD táctil:
 *  - Joystick virtual (zona inferior izquierda)
 *  - Botón de acción (zona inferior derecha)
 */
function createMobileHUD() {
  // Contenedor general del HUD
  mobileHud = document.createElement('div');
  mobileHud.id = 'mobile-hud';
  mobileHud.style.display = 'none'; // se muestra al entrar

  // ── Joystick ────────────────────────────────────────
  joystickContainer = document.createElement('div');
  joystickContainer.id = 'joystick-zone';

  joystickBase = document.createElement('div');
  joystickBase.id = 'joystick-base';

  joystickThumb = document.createElement('div');
  joystickThumb.id = 'joystick-thumb';

  joystickBase.appendChild(joystickThumb);
  joystickContainer.appendChild(joystickBase);
  mobileHud.appendChild(joystickContainer);

  // ── Botón de acción ─────────────────────────────────
  actionBtn = document.createElement('button');
  actionBtn.id = 'mobile-action-btn';
  actionBtn.innerHTML = '🔍';
  actionBtn.setAttribute('aria-label', 'Ver obra en detalle');
  mobileHud.appendChild(actionBtn);

  document.body.appendChild(mobileHud);

  // Evento del botón de acción
  actionBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isModalOpen()) return;

    if (targetingLink) {
      window.open('https://jeancorrea.com', '_blank');
      return;
    }

    if (targetedPainting) {
      openModal(targetedPainting.index);
    }
  });
}

/**
 * Registra todos los event listeners táctiles.
 */
function registerTouchEvents() {
  const canvas = document.getElementById('canvas-container');

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
  canvas.addEventListener('touchend',   onTouchEnd,   { passive: false });
  canvas.addEventListener('touchcancel', onTouchEnd,   { passive: false });
}

/**
 * Determina si un toque está en la zona del joystick (mitad izquierda).
 */
function isJoystickZone(x) {
  return x < window.innerWidth * 0.4;
}

function onTouchStart(e) {
  if (!mobileActive || isModalOpen()) return;
  e.preventDefault();

  for (const touch of e.changedTouches) {
    const x = touch.clientX;
    const y = touch.clientY;

    // Ignorar toques sobre el botón de acción
    if (e.target === actionBtn || actionBtn.contains(e.target)) continue;

    if (isJoystickZone(x) && joystickTouch === null) {
      // Iniciar joystick
      joystickTouch = touch.identifier;
      joystickOrigin = { x, y };
      joystickDelta  = { x: 0, y: 0 };

      // Posicionar la base del joystick donde se tocó
      joystickBase.style.left = x + 'px';
      joystickBase.style.top  = y + 'px';
      joystickBase.classList.add('active');
      joystickThumb.style.transform = 'translate(-50%, -50%)';
    } else if (lookTouch === null) {
      // Iniciar look
      lookTouch = touch.identifier;
      lookPrev  = { x, y };
    }
  }
}

function onTouchMove(e) {
  if (!mobileActive) return;
  e.preventDefault();

  for (const touch of e.changedTouches) {
    if (touch.identifier === joystickTouch) {
      // Actualizar joystick
      let dx = touch.clientX - joystickOrigin.x;
      let dy = touch.clientY - joystickOrigin.y;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > JOYSTICK_MAX_RADIUS) {
        dx = (dx / dist) * JOYSTICK_MAX_RADIUS;
        dy = (dy / dist) * JOYSTICK_MAX_RADIUS;
      }

      joystickDelta = { x: dx / JOYSTICK_MAX_RADIUS, y: dy / JOYSTICK_MAX_RADIUS };
      joystickThumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }

    if (touch.identifier === lookTouch) {
      // Actualizar look (rotación de cámara)
      const dx = touch.clientX - lookPrev.x;
      const dy = touch.clientY - lookPrev.y;
      lookPrev = { x: touch.clientX, y: touch.clientY };

      yaw   -= dx * LOOK_SENSITIVITY;
      pitch -= dy * LOOK_SENSITIVITY;
      pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch));
    }
  }
}

function onTouchEnd(e) {
  if (!mobileActive) return;

  for (const touch of e.changedTouches) {
    if (touch.identifier === joystickTouch) {
      joystickTouch = null;
      joystickDelta = { x: 0, y: 0 };
      joystickBase.classList.remove('active');
      joystickThumb.style.transform = 'translate(-50%, -50%)';
    }
    if (touch.identifier === lookTouch) {
      lookTouch = null;
    }
  }
}

// ── Raycasting (detección de obras) ───────────────────
function updateRaycast() {
  raycaster.setFromCamera(center, camera);

  const meshes = paintingMeshes.map(p => p.mesh);
  const hits = raycaster.intersectObjects(meshes, false);

  const prev = targetedPainting;
  targetedPainting = hits.length > 0
    ? paintingMeshes.find(p => p.mesh === hits[0].object)
    : null;

  // Enlace del panel de texto
  targetingLink = false;
  if (textPanelMesh) {
    const panelHit = raycaster.intersectObject(textPanelMesh, false);
    if (panelHit.length > 0) {
      const uv = panelHit[0].uv;
      if (uv && uv.y >= linkY.start && uv.y <= linkY.end) {
        targetingLink = true;
      }
    }
  }

  // Feedback visual en el botón de acción
  const hasTarget = !!(targetedPainting || targetingLink);
  if (hasTarget) {
    actionBtn.classList.add('highlight');
    if (targetedPainting) {
      targetedPainting.mesh.material.emissive?.set(0x333333);
    }
  } else {
    actionBtn.classList.remove('highlight');
    if (prev) {
      prev.mesh.material.emissive?.set(0x000000);
    }
  }
}

// ── Movimiento por frame ──────────────────────────────
const moveDir = new THREE.Vector3();

/**
 * Actualiza la posición y rotación del jugador en modo móvil.
 * Debe llamarse en cada frame del loop de animación.
 * @param {number} dt - Delta time en segundos
 */
export function updateMobileMovement(dt) {
  if (!mobileActive) return;

  // Actualizar la rotación de la cámara
  const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
  camera.quaternion.setFromEuler(euler);

  // Raycasting
  updateRaycast();

  // No mover si el modal está abierto
  if (isModalOpen()) return;

  // Movimiento con el joystick
  if (joystickDelta.x !== 0 || joystickDelta.y !== 0) {
    // Forward direction basada en yaw
    const sinY = Math.sin(yaw);
    const cosY = Math.cos(yaw);

    // joystickDelta.y negativo = avanzar (el dedo va hacia arriba)
    const fwd = -joystickDelta.y;
    const strafe = joystickDelta.x;

    moveDir.set(0, 0, 0);
    // Mover en la dirección de la cámara (solo plano horizontal)
    // Forward: hacia donde mira la cámara (-Z en local → -sinY en X, -cosY en Z)
    moveDir.x -= sinY * fwd * SPEED * dt;
    moveDir.z -= cosY * fwd * SPEED * dt;
    // Strafe perpendicular (derecha = +cosY en X, -sinY en Z)
    moveDir.x += cosY * strafe * SPEED * dt;
    moveDir.z -= sinY * strafe * SPEED * dt;

    camera.position.add(moveDir);
  }

  // Colisión con paredes y altura fija
  camera.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, camera.position.x));
  camera.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, camera.position.z));
  camera.position.y = PLAYER_EYE_H;
}

/**
 * Muestra el HUD móvil (al entrar a la sala).
 */
export function showMobileHUD() {
  if (!mobileActive || !mobileHud) return;
  mobileHud.style.display = 'block';
}

/**
 * Oculta el HUD móvil.
 */
export function hideMobileHUD() {
  if (!mobileActive || !mobileHud) return;
  mobileHud.style.display = 'none';
}

/**
 * Indica si el modo móvil está activo.
 */
export function isMobileMode() {
  return mobileActive;
}
