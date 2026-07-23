/**
 * room.js
 * ─────────────────────────────────────────────────────
 * Construye toda la geometría estática de la sala:
 * piso, techo, 4 paredes, vigas de madera, ventanas
 * con luz natural y banco de concreto.
 */
import * as THREE from 'three';
import { scene } from './scene.js';
import { wallTex, floorTex, woodTex, ceilTex } from './textures.js';
import { ROOM, HALF_W, HALF_D } from './config.js';

// ── Materiales de sala ────────────────────────────────
const wallMat  = new THREE.MeshLambertMaterial({ map: wallTex });
const floorMat = new THREE.MeshLambertMaterial({ map: floorTex, color: 0xcec6ba });
const ceilMat  = new THREE.MeshLambertMaterial({ map: ceilTex,  color: 0x909090 });
const woodMat  = new THREE.MeshLambertMaterial({ map: woodTex });
const concMat  = new THREE.MeshLambertMaterial({ color: 0xa09890 });

/**
 * Añade un plano a la escena.
 * @param {number} w - Ancho
 * @param {number} h - Alto
 * @param {THREE.Material} mat
 * @param {number} px - Posición X
 * @param {number} py - Posición Y
 * @param {number} pz - Posición Z
 * @param {number} [ry=0] - Rotación Y en radianes
 */
function addPlane(w, h, mat, px, py, pz, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.rotation.y = ry;
  mesh.position.set(px, py, pz);
  scene.add(mesh);
  return mesh;
}

// ── Piso ──────────────────────────────────────────────
const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.W, ROOM.D), floorMat);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

// ── Techo ─────────────────────────────────────────────
const ceilMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.W, ROOM.D), ceilMat);
ceilMesh.rotation.x = Math.PI / 2;
ceilMesh.position.y = ROOM.H;
scene.add(ceilMesh);

// ── Paredes ───────────────────────────────────────────
// La pared izquierda tiene repeat UV diferente (más larga)
const wallMatLeft = wallMat.clone();
wallMatLeft.map = wallTex.clone();
wallMatLeft.map.wrapS = wallMatLeft.map.wrapT = THREE.RepeatWrapping;
wallMatLeft.map.repeat.set(6, 2);
wallMatLeft.map.needsUpdate = true;

addPlane(ROOM.W, ROOM.H, wallMat.clone(),  0,      ROOM.H / 2, -HALF_D);            // fondo
addPlane(ROOM.W, ROOM.H, wallMat.clone(),  0,      ROOM.H / 2,  HALF_D, Math.PI);   // frente
addPlane(ROOM.D, ROOM.H, wallMatLeft,     -HALF_W, ROOM.H / 2,  0,  Math.PI / 2);  // izquierda
addPlane(ROOM.D, ROOM.H, wallMat.clone(),  HALF_W, ROOM.H / 2,  0, -Math.PI / 2);  // derecha

// ── Vigas de madera (techo) ───────────────────────────
const beamGeo = new THREE.BoxGeometry(ROOM.W + 0.3, 0.22, 0.3);
[-8, -4, 0, 4, 8].forEach(z => {
  const beam = new THREE.Mesh(beamGeo, woodMat);
  beam.position.set(0, ROOM.H - 0.11, z);
  scene.add(beam);
});

// Viga cumbrera central (a lo largo del eje Z)
const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, ROOM.D + 0.4), woodMat);
ridge.position.set(0, ROOM.H - 0.11, 0);
scene.add(ridge);

// ── Ventanas (pared izquierda) ────────────────────────
/**
 * Añade una ventana con marco blanco, vidrio traslúcido
 * y una PointLight que simula luz natural.
 * Las ventanas están centradas entre los cuadros de la
 * pared izquierda (cuadros en z=-6, 0, 6 → ventanas en z=-3, 3).
 *
 * @param {number} z - Posición Z de la ventana
 */
function addWindow(z) {
  const W = 2.1, H = 2.7;
  const group = new THREE.Group();

  // Marco blanco
  group.add(new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.12, H + 0.12, 0.08),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  ));

  // Vidrio traslúcido
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    new THREE.MeshBasicMaterial({
      color: 0xc8e8ff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    })
  );
  glass.position.z = 0.05;
  group.add(glass);

  group.rotation.y = Math.PI / 2;
  // Centrada verticalmente con los cuadros (y=2.55 ≈ centro de cuadros a y=2.4)
  group.position.set(-HALF_W + 0.05, 2.55, z);
  scene.add(group);

  // Luz natural sin sombras (barata en GPU)
  const light = new THREE.PointLight(0xfff8e8, 2.2, 9, 1.8);
  light.position.set(-HALF_W + 2.2, 2.6, z);
  scene.add(light);
}

// Centradas entre los cuadros: z=-6↔0 y z=0↔6
addWindow(-3);
addWindow(3);

// ── Banco de concreto (pared izquierda) ───────────────
const benchLength = ROOM.D * 0.68;

const benchTop = new THREE.Mesh(
  new THREE.BoxGeometry(1.05, 0.34, benchLength),
  concMat
);
benchTop.position.set(-HALF_W + 0.525, 0.17, -1);
scene.add(benchTop);

const benchBase = new THREE.Mesh(
  new THREE.BoxGeometry(1.05, 0.17, benchLength),
  new THREE.MeshLambertMaterial({ color: 0x8c8c84 })
);
benchBase.position.set(-HALF_W + 0.525, 0.085, -1);
scene.add(benchBase);
