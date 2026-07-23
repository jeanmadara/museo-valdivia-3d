# Museo Valdivia 3D

Recorrido virtual inmersivo en primera persona por una representación 3D del Museo de Valdivia, construido con Three.js vanilla.

## Descripción

Experiencia web inmersiva que simula el Museo de Valdivia con 9 exhibiciones distribuidas en 3 paredes. El usuario se desplaza en modo FPS (WASD + ratón) y explora el patrimonio y la riqueza de esta cultura ancestral ecuatoriana.

## Características

- **Movimiento en primera persona** – Controles WASD con colisiones contra paredes.
- **9 cuadros** distribuidos en paredes frontal, izquierda y derecha.
- **Barra de progreso** durante la carga de texturas de alta resolución.
- **Detección de WebGL** – Fallback si el dispositivo no soporta WebGL.
- **Optimización de texturas** – Redimensiona automáticamente a un máximo de 1024 px antes de subir a la GPU.
- **Responsive** – Se adapta a diferentes tamaños de pantalla.

## Estructura

```
Sala/
├── index.html            # Punto de entrada HTML
├── style.css             # Estilos de UI y overlay
├── js/
│   ├── main.js           # Orquestador y loop de animación
│   ├── config.js         # Constantes (dimensiones, rutas, layout)
│   ├── scene.js          # Renderer, escena, cámara
│   ├── room.js           # Geometría de la sala
│   ├── lights.js         # Iluminación
│   ├── paintings.js      # Cuadros y carga de texturas
│   ├── controls.js       # Controles FPS
│   ├── textures.js       # Utilidades de texturas
│   └── ui.js             # Overlay, crosshair, progreso
├── asset/
│   └── img/              # Imágenes de las obras
└── 3d-web-experience.md  # Skill de referencia
```

## Inicio rápido

1. Servir el proyecto con un servidor local (módulos ES requieren HTTP):

```bash
# Con Python
python -m http.server 8080

# Con Node.js
npx serve .
```

2. Abrir `http://localhost:8080` en el navegador.

## Controles

| Tecla / Acción | Función |
|----------------|---------|
| `W` | Avanzar |
| `S` | Retroceder |
| `A` | Izquierda |
| `D` | Derecha |
| `Mouse` | Mirar alrededor |
| `ESC` | Pausar / salir del modo exploración |

## Tecnologías

- **Three.js r160** (vía CDN import map)
- **HTML5 / CSS3 / JavaScript ES Modules** (sin bundler)

## Requisitos del navegador

- WebGL 1.0 o superior
- Soporte de ES Modules (Chrome, Firefox, Safari, Edge modernos)

## Licencia

Proyecto privado.
