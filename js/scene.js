/**
 * scene.js
 * ─────────────────────────────────────────────────────
 * Crea y exporta el renderer, la escena y la cámara.
 * También registra los manejadores de resize y de
 * pérdida/restauración del contexto WebGL.
 */
import * as THREE from 'three';
import { ROOM, PLAYER_EYE_H } from './config.js';

// ── Renderer ──────────────────────────────────────────
export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'default',
  precision: 'mediump',
});
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Montar canvas en el DOM
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Contexto perdido / restaurado
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  document.getElementById('ctx-lost').classList.add('show');
});
renderer.domElement.addEventListener('webglcontextrestored', () => {
  document.getElementById('ctx-lost').classList.remove('show');
});

// ── Escena ────────────────────────────────────────────
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0806);
scene.fog = new THREE.FogExp2(0x181008, 0.032);

// ── Cámara ────────────────────────────────────────────
export const camera = new THREE.PerspectiveCamera(
  72,
  window.innerWidth / window.innerHeight,
  0.1,
  80
);
camera.position.set(0, PLAYER_EYE_H, 6.5);

// ── Resize ────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
