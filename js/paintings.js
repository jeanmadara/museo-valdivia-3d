/**
 * paintings.js
 * ─────────────────────────────────────────────────────
 * Gestiona la carga de imágenes y la construcción de
 * los cuadros en la escena.
 *
 * Estrategia GPU-safe:
 *  • loadResized() redimensiona cada imagen a ≤ MAX_TEX px
 *    en un <canvas> 2D antes de subirla a la GPU.
 *  • Esto evita la saturación de VRAM que causaba el crash
 *    WebGL (especialmente con Escáner_20251018.png de 237MB).
 */
import * as THREE from 'three';
import { scene } from './scene.js';
import { IMAGE_FILES, PAINTING_LAYOUT, PW, PH, FT, MAX_TEX } from './config.js';
import { initProgress, tick } from './ui.js';

// ── Material placeholder (mientras carga la textura) ──
const placeholderMat = new THREE.MeshLambertMaterial({ color: 0x444440 });

// Material del marco negro
const frameMat = new THREE.MeshLambertMaterial({ color: 0x101010 });

// ── Array de meshes de arte para raycasting ───────────
/** @type {{ mesh: THREE.Mesh, index: number }[]} */
export const paintingMeshes = [];

/**
 * Carga una imagen, la redimensiona a ≤ MAX_TEX px en un
 * canvas auxiliar y devuelve una CanvasTexture lista para GPU.
 *
 * @param {string} url - Ruta de la imagen
 * @param {(tex: THREE.CanvasTexture) => void} onDone
 * @param {() => void} onError
 */
export function loadResized(url, onDone, onError) {
  const img = new Image();

  img.onload = () => {
    let w = img.naturalWidth;
    let h = img.naturalHeight;

    // Reducir si supera el límite máximo
    if (w > MAX_TEX || h > MAX_TEX) {
      const scale = MAX_TEX / Math.max(w, h);
      w = Math.floor(w * scale);
      h = Math.floor(h * scale);
    }

    // Ajustar a potencia de 2 para mipmaps eficientes
    w = Math.max(THREE.MathUtils.floorPowerOfTwo(w), 64);
    h = Math.max(THREE.MathUtils.floorPowerOfTwo(h), 64);

    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace        = THREE.SRGBColorSpace;
    tex.generateMipmaps   = true;
    tex.minFilter         = THREE.LinearMipmapLinearFilter;
    tex.magFilter         = THREE.LinearFilter;
    onDone(tex);
  };

  img.onerror = onError;
  img.src = url;
}

/**
 * Crea un cuadro con marco negro y tarjeta de etiqueta.
 * La textura se carga de forma asíncrona; mientras tanto
 * se muestra un material gris placeholder.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} rotY  - Rotación Y en radianes
 * @param {number} imgIndex - Índice en IMAGE_FILES
 */
function addPainting(x, y, z, rotY, imgIndex) {
  const group = new THREE.Group();

  // Plano de la obra (placeholder hasta que cargue la textura)
  const artMat  = placeholderMat.clone();
  const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), artMat);
  group.add(artMesh);

  // Barras del marco (top, bottom, left, right)
  const fd = 0.05; // profundidad del marco
  [
    [PW + FT * 2, FT, fd,  0,            PH / 2 + FT / 2, fd / 2],  // top
    [PW + FT * 2, FT, fd,  0,           -PH / 2 - FT / 2, fd / 2],  // bottom
    [FT,          PH, fd, -PW / 2 - FT / 2, 0,             fd / 2],  // left
    [FT,          PH, fd,  PW / 2 + FT / 2, 0,             fd / 2],  // right
  ].forEach(([bw, bh, bd, bx, by, bz]) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), frameMat);
    bar.position.set(bx, by, bz);
    group.add(bar);
  });

  // Tarjeta de etiqueta (pequeña placa blanca debajo del cuadro)
  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.14),
    new THREE.MeshLambertMaterial({ color: 0xf5f0e5 })
  );
  label.position.set(0, -PH / 2 - FT - 0.17, 0.01);
  group.add(label);

  group.position.set(x, y, z);
  group.rotation.y = rotY;
  scene.add(group);

  // Registrar el mesh de la obra para raycasting
  paintingMeshes.push({ mesh: artMesh, index: imgIndex });

  // Carga asíncrona con swap de textura al terminar
  loadResized(
    IMAGE_FILES[imgIndex],
    (tex) => {
      artMat.map = tex;
      artMat.color.set(0xffffff);
      artMat.needsUpdate = true;
      tick();
    },
    () => tick() // también avanza el progreso si falla
  );
}

/**
 * Inicializa el sistema de carga y coloca todos los
 * cuadros según el layout definido en config.js.
 */
export function buildPaintings() {
  initProgress(IMAGE_FILES.length);
  PAINTING_LAYOUT.forEach(({ i, x, y, z, ry }) => {
    addPainting(x, y, z, ry, i);
  });
}
