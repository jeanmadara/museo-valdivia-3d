/**
 * controls.js
 * ─────────────────────────────────────────────────────
 * Configura los controles FPS con PointerLockControls:
 *  • Captura del cursor al hacer clic
 *  • Movimiento WASD con aceleración y deceleración suave
 *  • Colisión con los límites de la sala
 *  • Altura de cámara fija (sin gravedad)
 *  • Raycasting para detectar cuadro apuntado
 *  • Apertura de modal con clic o tecla E
 */
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { camera, renderer } from './scene.js';
import { HALF_W, HALF_D, SPEED, PLAYER_EYE_H, WALL_MARGIN } from './config.js';
import { paintingMeshes } from './paintings.js';
import { openModal, isModalOpen } from './modal.js';
import { textPanelMesh, linkY } from './textpanel.js';

// ── PointerLockControls ───────────────────────────────
export const controls = new PointerLockControls(camera, renderer.domElement);

// ── Teclado ───────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.code] = true;  });
window.addEventListener('keyup',   (e) => { keys[e.code] = false; });

// ── Hover hint ────────────────────────────────────────
const hoverHint = document.getElementById('hover-hint');

// ── Raycasting ────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0); // centro de la pantalla

/** @type {{ mesh: THREE.Mesh, index: number } | null} */
let targetedPainting = null;

/** @type {boolean} true si el crosshair apunta al enlace jeancorrea.com */
let targetingLink = false;

/**
 * Lanza un rayo desde el centro de la cámara y detecta
 * si apunta a algún cuadro o al enlace del panel de texto.
 */
function updateRaycast() {
  raycaster.setFromCamera(center, camera);

  // Detectar cuadros
  const meshes = paintingMeshes.map(p => p.mesh);
  const hits = raycaster.intersectObjects(meshes, false);

  const prev = targetedPainting;
  targetedPainting = hits.length > 0
    ? paintingMeshes.find(p => p.mesh === hits[0].object)
    : null;

  // Detectar enlace jeancorrea.com en el panel de texto
  const prevLink = targetingLink;
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

  // Feedback visual: cambiar cursor, mostrar hint y glow
  const hasTarget = !!(targetedPainting || targetingLink);
  const hadTarget = !!(prev || prevLink);
  if (hasTarget !== hadTarget) {
    document.body.style.cursor = hasTarget ? 'pointer' : 'default';
    if (targetedPainting) {
      hoverHint.classList.remove('hidden');
      targetedPainting.mesh.material.emissive?.set(0x333333);
    } else {
      hoverHint.classList.add('hidden');
      prev?.mesh.material.emissive?.set(0x000000);
    }
  }
}

// ── Abrir modal con clic o tecla E / abrir enlace ────
window.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;            // solo clic izquierdo
  if (!controls.isLocked) return;        // sin pointer lock
  if (isModalOpen()) return;             // ya hay un modal abierto

  if (targetingLink) {
    window.open('https://jeancorrea.com', '_blank');
    return;
  }

  if (targetedPainting) {
    openModal(targetedPainting.index);
    controls.unlock();                   // liberar cursor para interactuar con el modal
  }
});

window.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyE') return;
  if (!controls.isLocked) return;
  if (isModalOpen()) return;
  if (targetedPainting) {
    openModal(targetedPainting.index);
    controls.unlock();                   // liberar cursor para interactuar con el modal
  }
});

// ── Re-lockear cuando se cierra el modal ──────────────
window.addEventListener('painting-modal-close', () => {
  if (!controls.isLocked) {
    controls.lock();
  }
});

// ── Física del movimiento ─────────────────────────────
const vel = new THREE.Vector3();

// Límites de colisión (margen para no atravesar paredes)
const bounds = {
  minX: -HALF_W + WALL_MARGIN,
  maxX:  HALF_W - WALL_MARGIN,
  minZ: -HALF_D + WALL_MARGIN,
  maxZ:  HALF_D - WALL_MARGIN,
};

/**
 * Actualiza la posición del jugador.
 * Debe llamarse en cada frame del loop de animación.
 * @param {number} dt - Delta time en segundos
 */
export function updateMovement(dt) {
  if (!controls.isLocked) return;

  // Actualizar raycasting en cada frame
  updateRaycast();

  // Bloquear movimiento si el modal está abierto
  if (isModalOpen()) return;

  // Deceleración exponencial (parada suave)
  vel.x -= vel.x * 12 * dt;
  vel.z -= vel.z * 12 * dt;

  // Leer entradas del teclado
  const fwd = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
  const str = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);

  if (fwd) vel.z -= fwd * SPEED * 14 * dt;
  if (str) vel.x -= str * SPEED * 14 * dt;

  controls.moveForward(-vel.z * dt);
  controls.moveRight(-vel.x * dt);

  // Colisión con paredes y altura fija
  const pos = controls.getObject().position;
  pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, pos.x));
  pos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, pos.z));
  pos.y = PLAYER_EYE_H;
}
