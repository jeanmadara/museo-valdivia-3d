/**
 * textpanel.js
 * ─────────────────────────────────────────────────────
 * Renderiza el texto curatorial en un panel de canvas
 * y lo coloca en la pared frontal de la sala.
 * Incluye enlace clickeable a jeancorrea.com.
 */
import * as THREE from 'three';
import { scene } from './scene.js';
import { ROOM, HALF_D } from './config.js';

const PANEL_W = 6;
const PANEL_H = 3.8;
const CANVAS_W = 4096;
const CANVAS_H = 3200;

const photographers = [
  'Javier Paez',
  'Jeff Castro',
  'Julian Torres',
  'David Ramos',
  'Josie Guadamud',
  'Ana Maria Leon',
  'Karen Farinango',
  'Juan Pablo',
];

/** Mesh exportado para raycasting (enlace jeancorrea.com) */
export let textPanelMesh = null;

/** Coordenadas UV Y del enlace jeancorrea.com (para raycasting) */
export let linkY = { start: 0, end: 0 };

function createTextTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');

  const s  = CANVAS_W / 2048;
  const M  = 50 * s;
  const CX = CANVAS_W / 2;

  const LINE_GAP = 100 * s;
  const LINE_TOP = M + LINE_GAP;
  const LINE_BOT = CANVAS_H - M - LINE_GAP;
  const INNER    = LINE_BOT - LINE_TOP;   // 2600

  // Fondo
  ctx.fillStyle = '#1a1408';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Borde dorado
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 6 * s;
  ctx.strokeRect(M, M, CANVAS_W - M * 2, CANVAS_H - M * 2);

  ctx.textAlign = 'center';

  // ── Líneas decorativas ──────────────────────────────
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(200 * s, LINE_TOP);
  ctx.lineTo(CANVAS_W - 200 * s, LINE_TOP);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(200 * s, LINE_BOT);
  ctx.lineTo(CANVAS_W - 200 * s, LINE_BOT);
  ctx.stroke();

  // ── Contenido: 6 bloques + 1 separador ──────────────
  // Bloque 1: Subtítulo           ~8%
  // Bloque 2: Título              ~14%
  // Bloque 3: Subtítulo 2         ~8%
  // Bloque 4: Separador           ~4%
  // Bloque 5: Descripción         ~28%
  // Bloque 6: Fotógrafos          ~38%
  let y = LINE_TOP;

  // ── Subtítulo ───────────────────────────────────────
  y += INNER * 0.04;
  ctx.fillStyle = '#c9a84c';
  ctx.font = `300 ${34 * s}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText('PROYECTO FOTOGRÁFICO Y DE INVESTIGACIÓN AUDIOVISUAL', CX, y);

  y += INNER * 0.08;

  // ── Título principal ────────────────────────────────
  ctx.fillStyle = '#f0e6d0';
  ctx.font = `700 ${92 * s}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText('Memorias Ancestrales', CX, y);

  y += INNER * 0.09;

  // ── Subtítulo 2 ─────────────────────────────────────
  ctx.fillStyle = '#c9a84c';
  ctx.font = `460 ${48 * s}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText('Reflejos del Litoral Ecuatoriano', CX, y);

  y += INNER * 0.06;

  // ── Línea separadora ────────────────────────────────
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 1.5 * s;
  ctx.beginPath();
  ctx.moveTo(CX - 160 * s, y);
  ctx.lineTo(CX + 160 * s, y);
  ctx.stroke();

  y += INNER * 0.06;

  // ── Texto descriptivo ───────────────────────────────
  ctx.fillStyle = '#b0a890';
  ctx.font = `300 ${38 * s}px "Segoe UI", system-ui, sans-serif`;
  const descLines = [
    'La Exposición "Memorias Ancestrales" es un puente entre',
    'el pasado y el futuro. Presentamos una cuidadosa selección',
    'de piezas arqueológicas de culturas como Valdivia, Guangala,',
    'Tolita-Tumaco y Las Vegas, documentadas magistralmente',
    'por fotógrafos ecuatorianos.',
  ];
  const lineH = INNER * 0.042;
  descLines.forEach(line => {
    ctx.fillText(line, CX, y);
    y += lineH;
  });

  y += INNER * 0.04;

  // ── Título "Fotógrafos" ─────────────────────────────
  ctx.fillStyle = '#c9a84c';
  ctx.font = `600 ${42 * s}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText('Fotógrafos', CX, y);

  y += INNER * 0.05;

  // ── Lista de fotógrafos (2 columnas) ────────────────
  ctx.fillStyle = '#d4c8a8';
  ctx.font = `300 ${34 * s}px "Segoe UI", system-ui, sans-serif`;
  const nameH = INNER * 0.038;
  photographers.forEach(name => {
    ctx.fillText(name, CX, y);
    y += nameH;
  });

  // ── Crédito debajo de la línea inferior ─────────────
  y = LINE_BOT + 50 * s;
  ctx.fillStyle = '#c9a84c';
  ctx.font = `400 ${28 * s}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText('Desarrollado por jeancorrea.com', CX, y);

  // UV del enlace
  linkY.start = 1 - (y + 6 * s)  / CANVAS_H;
  linkY.end   = 1 - (y - 30 * s) / CANVAS_H;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ── Crear panel en la escena ──────────────────────────
const tex = createTextTexture();
const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
textPanelMesh = new THREE.Mesh(new THREE.PlaneGeometry(PANEL_W, PANEL_H), mat);
textPanelMesh.position.set(0, ROOM.H / 2, HALF_D - 0.09);
textPanelMesh.rotation.y = Math.PI;
scene.add(textPanelMesh);
