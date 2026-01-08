const intro = document.getElementById("intro");
const title = document.getElementById("intro-title");

let target = 0;          // 0..1
let current = 0;         // suavizado
let transitionMode = true; // capturamos wheel o no

const SMOOTH = 0.1;
const SENS = 0.0016;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

// easing bonito
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Animación contínua
function render() {
  current += (target - current) * SMOOTH;
  const eased = easeOutCubic(current);

  // Intro anim
  title.style.opacity = 1 - eased;
  title.style.transform = `translateY(${eased * -70}px) scale(${1 + eased * 0.05})`;
  title.style.filter = `blur(${eased * 3}px)`;
  intro.style.opacity = 1 - eased;

  // Estados “técnicos”
  if (current < 0.02) {
    // estamos en intro
    intro.style.pointerEvents = "auto";
    document.body.classList.add("lock-scroll");
    transitionMode = true;
  } else if (current > 0.98) {
    // estamos en sala
    intro.style.pointerEvents = "none";
    document.body.classList.remove("lock-scroll");
    transitionMode = false; // scroll normal
  }

  requestAnimationFrame(render);
}

render();

// Captura wheel SOLO cuando toca
window.addEventListener(
  "wheel",
  (e) => {
    // Caso A: estamos en transición (intro ↔ sala)
    if (transitionMode) {
      e.preventDefault();
      target = clamp(target + e.deltaY * SENS, 0, 1);
      return;
    }

    // Caso B: estamos en sala con scroll normal
    // Si el usuario intenta subir y YA está arriba del todo,
    // reactivamos la transición para volver a la intro
    if (window.scrollY <= 0 && e.deltaY < 0) {
      transitionMode = true;
      e.preventDefault();
      target = clamp(target + e.deltaY * SENS, 0, 1); // empezará a ir hacia 0
    }
  },
  { passive: false }
);
