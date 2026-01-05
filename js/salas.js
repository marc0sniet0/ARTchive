const carousel = document.querySelector('.carousel');
const items = Array.from(document.querySelectorAll('.carousel-item'));

const total = items.length;

let rotationY = 0;
let rotationX = -10;
let radius = 0;

/* 🔑 Radio basado en el ancho REAL de la escena */
function calculateRadius() {
  const scene = document.querySelector('.scene');
  const sceneWidth = scene.offsetWidth;

  // el radio es proporcional al tamaño del contenedor
  return sceneWidth * 0.45;
}

/* Posicionar tarjetas */
function layoutItems() {
  radius = calculateRadius();
  const angleStep = 360 / total;

  items.forEach((item, i) => {
    const angle = angleStep * i;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius;

    item.style.transform = `
      translate(-50%, -50%)
      translate3d(${x}px, 0px, ${z}px)
      rotateY(${angle}deg)
    `;
  });
}

/* Rotación */
function updateTransform() {
  carousel.style.transform = `
    translate(-50%, -50%)
    rotateX(${rotationX}deg)
    rotateY(${rotationY}deg)
  `;
}

/* Scroll como input */
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  rotationY += e.deltaY * 0.15;
  updateTransform();
}, { passive: false });

/* Recalcular al cambiar tamaño */
window.addEventListener('resize', () => {
  layoutItems();
  updateTransform();
});

layoutItems();
updateTransform();
