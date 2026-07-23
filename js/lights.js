/**
 * lights.js
 * ─────────────────────────────────────────────────────
 * Configura toda la iluminación de la galería.
 * Sin shadow maps para mantener bajo el consumo de VRAM.
 *
 * Estrategia:
 *  • AmbientLight  — iluminación base
 *  • HemisphereLight — gradiente cielo/suelo
 *  • DirectionalLight — profundidad general
 *  • PointLights — focos sobre cada grupo de cuadros
 */
import * as THREE from 'three';
import { scene } from './scene.js';
import { ROOM, HALF_W, HALF_D } from './config.js';

// ── Luz ambiental ─────────────────────────────────────
scene.add(new THREE.AmbientLight(0xfff8f0, 0.55));

// ── Hemisférica (cielo cálido / suelo oscuro) ─────────
scene.add(new THREE.HemisphereLight(0xffe8c0, 0x281808, 0.45));

// ── Direccional (sombras suaves de profundidad) ───────
const dirLight = new THREE.DirectionalLight(0xffe0a0, 0.7);
dirLight.position.set(2, ROOM.H, -5);
scene.add(dirLight);

// ── PointLights sobre los cuadros ────────────────────
/**
 * Añade una PointLight cálida de museo.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} [intensity=2.8]
 * @param {number} [distance=7]
 */
function artLight(x, y, z, intensity = 2.8, distance = 7) {
  const light = new THREE.PointLight(0xffd888, intensity, distance, 2);
  light.position.set(x, y, z);
  scene.add(light);
}

// Pared del fondo
artLight(0, ROOM.H - 0.4, -HALF_D + 3, 3.5, 8);

// Pared izquierda
artLight(-HALF_W + 3, ROOM.H - 0.4, 0, 2.8, 9);

// Pared derecha
artLight(HALF_W - 3, ROOM.H - 0.4, 0, 2.8, 9);

// Relleno general hacia el frente
artLight(0, ROOM.H - 0.5, 4, 1.5, 12);
