/**
 * config.js
 * ─────────────────────────────────────────────────────
 * Fuente única de verdad para todas las constantes del
 * proyecto. Modificar aquí afecta a toda la aplicación.
 */

// ── Dimensiones de la sala (metros) ──────────────────
export const ROOM = {
  W: 14,    // ancho  (eje X)
  H: 5.5,   // alto   (eje Y)
  D: 22,    // fondo  (eje Z)
};

// Derivadas (usadas frecuentemente)
export const HALF_W = ROOM.W / 2;
export const HALF_D = ROOM.D / 2;

// ── Cuadros ───────────────────────────────────────────
/** Ancho del cuadro en unidades de mundo */
export const PW = 1.8;
/** Alto del cuadro en unidades de mundo */
export const PH = 2.7;
/** Grosor del marco */
export const FT = 0.06;

// ── Movimiento FPS ────────────────────────────────────
export const SPEED = 5;      // unidades/seg
export const PLAYER_EYE_H = 1.72;  // altura de la cámara
export const WALL_MARGIN = 1.0;   // distancia mín a las paredes

// ── Texturas de arte ─────────────────────────────────
/** Dimensión máxima (px) antes de subir a la GPU */
export const MAX_TEX = 1024;

// ── Rutas de imágenes ────────────────────────────────
export const IMAGE_FILES = [
  'asset/img/006C _DSC8734 T R300 40X60 PI.jpg',
  'asset/img/016D _DSC8744 T R300 40X60 PI.jpg',
  'asset/img/05082025-0G7A0427.jpg',
  'asset/img/0G7A2344-2.jpg',
  'asset/img/13082025-0G7A1117.jpg',
  'asset/img/IMG_4768.jpg',
  'asset/img/MAAC_Artisticas_AML_04.jpg',
  'asset/img/_MG_8628-7.jpg',
  'asset/img/Esc%C3%A1ner_20251018.png',
];

// ── Info de cada obra ──────────────────────────────────
export const PAINTING_INFO = [
  { title: 'GA-1-1286-79', artist: 'Javier Paez', desc: 'Figura antropomorfa moldeada en la parte anterior y modelada en la posterior; hueca; sexo femenino; postura de pie; tocado sencillo forma de gorro; cabeza dolicocéfala; cara ovalada; nariz recta; ojos en forma de granos de café; boca incisa; orejas indicadas por dos orejeras discoidales; cuello incipiente; brazos y piernas cortas y robustas; dedos de manos y pies insinuados por incisos profundos. Presenta 2 perforaciones a los costados del cuello y 2 en las orejeras. Como decoración la cara tiene pintura facial amarillo ocre y ornamentada con incisos y pintura marrón insinuando "tatuajes".' },
  { title: 'GA-35-1924-81', artist: 'Jeff Castro', desc: 'Figura gigante, hueca, que representa a un felino en posición de pie. La cabeza tiene un tocado con dos adornos cónicos en cuyo origen tiene como adornos en pastillaje dos tiras lineales y entre ellas presenta pequeños discos. Los ojos son salientes y redondos; la nariz con las dos fosas nasales bien definidas; la boca está abierta mostrando las fauces, presente todos los dientes y cuatro colmillos, entre los colmillos inferiores tiene un faltante; en las orejas su extremo superior es curvo y su extremo inferior termina en un vértice. En el cuello posee un gran pectoral que le cubre todo el tórax, el cual tiene dos juegos de adornos a manera de pastillaje similar al que presenta en el origen de los adornos cónicos de la cabeza, es decir tiras lineales y entre ellas presenta pequeños discos. En cuanto a los brazo, uno está totalmente ausente y el otro solo está la parte superior del mismo. El vientre redondeado. Las piernas son robustas, se encuentran separadas, se puede apreciar ligeramente las rodillas y en las patas presenta las garras. La parte posterior tiene una gran cola cuyo extremo es curvo; la cola junto con las patas sirve de apoyo a la gran figura. En los adornos cónicos de la cabeza y en el pectoral ligeramente se observa pintura verde turquesa y también presenta una coloración rojiza en varias partes del cuerpo del felino.' },
  { title: 'GA-2-1089-78', artist: 'Javier Paez', desc: 'Botella de clase estructural restringida independiente; clase de contorno complejo; base plana; borde evertido; labio redondeado; asa plana. La botella representa a una figura antropomorfa; sexo masculino; postura sentada con el tronco ligeramente inclinado; representación prisionero; tocado en forma de gorro; cabeza dolicocéfala; cara ovalada; nariz realista con dos orificios indicando las fosas nasales; pómulos alientes; boca con reborde; orejas curvas; cuello ornamentado con collar y pendiente con incisos verticales; brazos flexionados hacia atrás con las manos atadas; piernas dobladas hacia un lado; a los costados del torso tiene una secuencia de rebordes en ambos lados simulando las costillas. En la espalda se localiza el pico de la botella y un asa que se une a la cabeza donde se encuentra la cámara de resonancia.' },
  { title: 'GA-2-1675-80', artist: 'Julian Torres', desc: 'Figura antropomorfa femenina, sedente, presenta un tocado que en su parte central tiene incisos curvos y en un lado tiene un adorno alargado con incisos verticales simulado cabello y en el otro lado presenta un adorno circular con incisos verticales. Rostro ovalado con el mentón ligeramente alargado y con leve pintura facial amarilla ocre; ojos protuberantes con fino reborde y almendrados, nariz semi curva con fosas nasales indicadas, boca semi abierta con reborde indicando labios, orejas realistas indicadas con incisos en forma curva. Cuello alto, senos realistas, posición sentada con la espalda erguida y plana en su parte inferior, brazo y pierna del mismo lado están extendidas; y el otro brazo y pierna del mismo lado están flexionados, dedos de las manos y pies están indicados con incisos. Sólida.' },
  { title: 'GA-1-2139-82', artist: 'David Ramos', desc: 'Figura antropomorfa; sexo masculino; postura sentada; actitud coquero; tocado decorado a pastillaje; cabeza braquicéfala; ojos prominentes en "D"; nariz aguileña con nariguera; boca abierta mostrando dentadura; orejas adornadas con 2 grandes aretes y decorado con apliques circulares insinuando filigrana; alrededor del cuello se aprecia un collar segmentado de cuentas grandes con pendiente antropomorfo; torso cubierto por un poncho adornado con apliques; barbilla con tembetá; brazos flexionados hacia adelante sosteniendo con la mano derecha un pequeño recipiente globular y en la mano izquierda posiblemente una espátula; piernas cruzadas, dedos de las manos y pies realistas. La figura representa a un coquero, el mismo que en la cabeza tiene una manta que a los lados termina con flecos rematados con 3 apliques sobrepuestos, en el borde frontal encontramos unos botones pegados, en la parte superior de la manta encontramos unos apliques sobrepuestos, en la parte central hay una hilera vertical de apliques equidistantes, en la parte posterior de la manta se remata con apliques sobrepuestos bordeando la manta; en la cara tiene 2 aretes colgados tipo sombrero, con botones pequeños unidos bordeando y formando un círculo, en el centro de éste hay un botón y en el filo tiene 2 incisos circulares. En el cuello hay un collar con un colmillo que representada una figura antropomorfa, el resto del collar con cuentas tubulares; como adornos destacan los brazaletes hechos con cuentas formando hileras representados por incisiones en tiras sobrepuestas, en ambos brazos, en la cara hay una nariguera circular y una tembetá. En el cuerpo encontramos un poncho que tiene apliques sobrepuestos colocados en forma sesgada sólo en el frente, como prenda de vestir tiene un taparrabo cubriéndole solo la parte delantera, en la parte de atrás se ve un cinturón que lo sujeta, en la mano derecha tiene el recipiente y en la izquierda la espátula. Por sus características tecnológicas tiene una superficie alisada y lisa.' },
  { title: 'GA-63-971-78', artist: 'Josie Guadamud', desc: 'Figura antropomorfa elaborada en piedra mediante talla. Aunque el registro técnico no incorpora una descripción morfológica detallada, la pieza forma parte del repertorio escultórico de la cultura Milagro-Quevedo, una tradición arqueológica en la que las representaciones humanas en piedra son considerablemente menos frecuentes que las realizadas en cerámica o metal. La manufactura mediante talla evidencia el conocimiento de las propiedades de la materia prima lítica y el dominio de técnicas destinadas a modelar formas permanentes y resistentes. La cultura Milagro-Quevedo, identificada en las fuentes coloniales con los Chonos, ocupó gran parte de la cuenca del río Guayas durante el Período de Integración y desarrolló una compleja organización territorial basada en sistemas agrícolas, camellones y tolas artificiales. Sus asentamientos controlaban importantes rutas fluviales y redes de intercambio que conectaban la costa con la Sierra, favoreciendo la circulación de bienes como cobre, concha Spondylus, algodón, coca y otros productos especializados. Aunque esta sociedad es ampliamente conocida por su producción cerámica y metalúrgica, las esculturas antropomorfas en piedra constituyen un conjunto mucho menos común y, por ello, de especial interés arqueológico. En los Andes prehispánicos la piedra fue un material frecuentemente reservado para objetos de larga duración vinculados con la memoria colectiva, la representación de personajes y la materialización de espacios rituales. La elección de este soporte sugiere una intención de permanencia distinta a la de los objetos cerámicos de uso cotidiano.' },
  { title: 'GA-38-3183-02', artist: 'Ana Maria Leon', desc: 'Cuenco de clase estructural no restringida; clase de contorno compuesto; soporte tetrápodo, de patas cónicas sólidas (3 soporte reconstruidos); base plana (reconstruida); cuerpo semiesférico de paredes cóncavas; borde invertido; labio plano. El recipiente presenta como decoración en el exterior diseños geométricos, formando cenefas, realizadas mediante líneas excisas y punteado.' },
  { title: 'GA-2-1099-79', artist: 'Karen Farinango', desc: 'Figura antropomorfa; sexo femenino; hueca; postura sentada. La cabeza posee un tocado con un cintillo como adorno; ojos almendrados; nariz con nariguera; boca semi-abierta; orejas con orejeras; en el cuello un collar segmentado; senos indicados por dos protuberancias; brazos robustos con pulseras en antebrazos, con las manos sostiene un recipiente rectangular en cuyo interior hay un machacador con la punta aguda; dedos de los pies y manos delineados por incisos. Como vestimenta posee una falda pintura de color negro, el resto del cuerpo de amarillo-ocre; el recipiente de pintura negra en bandas.' },
  { title: 'GA-8-928-78', artist: 'Juan Pablo', desc: 'Figura antropomorfa moldeada en la parte frontal y modelada en la posterior; sexo masculino; hueca; postura sentada; actitud músico; alrededor del tocado y cara una tira invertida que remata a la altura de los hombros; en la parte frontal de la cabeza a manera de antenas presenta dos apliques semiesféricos que en el interior presenta un rollo tubular corto con un botón en el extremo; ojos redondos con pintura negra en el interior y en el contorno; nariz indicada por un botón incipiente; boca abierta con labios indicados mediante un reborde; orejas con aretes largos; brazos adosados al cuerpo y flexionados hacia arriba, sosteniendo entre su manos un instrumento musical. "zampoña"; piernas separadas, flexionadas y cortas Como vestimenta presenta un cubre sexo. Presenta una oquedad en la parte posterior de la cabeza.' },
];

// ── Layout de cuadros (3 paredes × 3 cuadros) ────────
export const PAINTING_LAYOUT = [
  // Pared del fondo (apunta hacia +Z, en z = -HALF_D)
  { i: 0, x: -3.8, y: 2.4, z: -HALF_D + 0.09, ry: 0 },
  { i: 1, x: 0, y: 2.4, z: -HALF_D + 0.09, ry: 0 },
  { i: 2, x: 3.8, y: 2.4, z: -HALF_D + 0.09, ry: 0 },
  // Pared izquierda (apunta hacia +X, en x = -HALF_W)
  { i: 3, x: -HALF_W + 0.09, y: 2.4, z: -6, ry: Math.PI / 2 },
  { i: 4, x: -HALF_W + 0.09, y: 2.4, z: 0, ry: Math.PI / 2 },
  { i: 5, x: -HALF_W + 0.09, y: 2.4, z: 6, ry: Math.PI / 2 },
  // Pared derecha (apunta hacia -X, en x = +HALF_W)
  { i: 6, x: HALF_W - 0.09, y: 2.4, z: -6, ry: -Math.PI / 2 },
  { i: 7, x: HALF_W - 0.09, y: 2.4, z: 0, ry: -Math.PI / 2 },
  { i: 8, x: HALF_W - 0.09, y: 2.4, z: 6, ry: -Math.PI / 2 },
];
