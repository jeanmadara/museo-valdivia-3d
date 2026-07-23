/**
 * main.js
 * ─────────────────────────────────────────────────────
 * Punto de entrada de la aplicación.
 * Importa y orquesta todos los módulos en el orden
 * correcto y ejecuta el loop de animación.
 *
 * Orden de inicialización:
 *  1. scene.js   — renderer, escena, cámara
 *  2. room.js    — geometría estática (side-effects)
 *  3. lights.js  — iluminación (side-effects)
 *  4. paintings.js — cuadros + carga de texturas
 *  5. controls.js  — movimiento FPS
 *  6. ui.js        — overlay + barra de progreso
 */
import * as THREE from 'three';

// Core — debe importarse primero (crea renderer/scene/camera)
import { renderer, scene, camera } from './scene.js';

// Geometría y luces (side-effects: se añaden a scene al importar)
import './room.js';
import './lights.js';
import './textpanel.js';

// Cuadros
import { buildPaintings } from './paintings.js';

// Controles FPS
import { controls, updateMovement } from './controls.js';

// UI
import { initUI } from './ui.js';

// ── Inicialización ────────────────────────────────────

// Añadir el objeto de la cámara del controlador a la escena
scene.add(controls.getObject());

// Conectar UI con los controles (botón inicio, crosshair, etc.)
initUI(controls);

// Colocar cuadros e iniciar carga de imágenes
buildPaintings();

// ── Loop de animación ─────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Limitar delta para evitar saltos en frames lentos
  const dt = Math.min(clock.getDelta(), 0.05);

  updateMovement(dt);

  renderer.render(scene, camera);
}

animate();
