/**
 * textures.js
 * ─────────────────────────────────────────────────────
 * Genera todas las texturas procedurales de la sala.
 * Usa <canvas> 2D en CPU → CanvasTexture (sin I/O de disco,
 * tamaño pequeño en VRAM).
 */
import * as THREE from 'three';

/**
 * Crea una CanvasTexture con repeat.
 * @param {number} w - Ancho del canvas en px
 * @param {number} h - Alto del canvas en px
 * @param {(ctx: CanvasRenderingContext2D, w: number, h: number) => void} draw
 * @param {number} repeatX
 * @param {number} repeatY
 */
function procTex(w, h, draw, repeatX, repeatY) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  return tex;
}

/** Revoque blanco con ruido suave (paredes) */
export const wallTex = procTex(256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#f4efe6';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3000; i++) {
    const v = 200 + Math.random() * 40;
    ctx.fillStyle = `rgba(${v},${v - 4},${v - 10},.15)`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
}, 3, 2);

/** Concreto pulido (piso) */
export const floorTex = procTex(512, 512, (ctx, w, h) => {
  ctx.fillStyle = '#c0b8ad';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 8000; i++) {
    const v = 160 + Math.random() * 45;
    ctx.fillStyle = `rgba(${v},${v - 2},${v - 6},.12)`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}, 8, 12);

/** Veta de madera oscura (vigas) */
export const woodTex = procTex(128, 256, (ctx, w, h) => {
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0,   '#4a2e10');
  g.addColorStop(0.35,'#6b4020');
  g.addColorStop(0.7, '#5a3518');
  g.addColorStop(1,   '#3d2408');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(20,8,0,${0.1 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.5 + Math.random();
    const x = Math.random() * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 12, h);
    ctx.stroke();
  }
}, 1, 3);

/** Metal corrugado (techo) */
export const ceilTex = procTex(256, 256, (ctx, w, h) => {
  ctx.fillStyle = '#8c8c8a';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < h; i += 8) {
    ctx.fillStyle = i % 16 === 0 ? 'rgba(0,0,0,.13)' : 'rgba(255,255,255,.06)';
    ctx.fillRect(0, i, w, 4);
  }
}, 2, 5);
