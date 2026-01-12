const intro = document.getElementById("intro");
const title = document.getElementById("intro-title");
const introText = document.getElementById("introText");

// 👉 URL de la sala real
const SALA_URL = "./popart.html";

let target = 0;            // 0..1
let current = 0;           // suavizado
let transitionMode = true; // capturamos wheel o no

const SMOOTH = 0.1;
const SENS = 0.0016;

let redirected = false;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function goToSala() {
  if (redirected) return;
  redirected = true;

  intro.style.transition = "opacity 220ms ease";
  intro.style.opacity = "0";

  setTimeout(() => {
    window.location.replace(SALA_URL);
  }, 230);
}

function render() {
  current += (target - current) * SMOOTH;
  const eased = easeOutCubic(current);

  // ✅ Título: SIEMPRE centrado + anim
  title.style.opacity = 1 - eased;
  title.style.transform =
    `translate(-50%, -50%) translateY(${eased * -70}px) scale(${1 + eased * 0.05})`;
  title.style.filter = `blur(${eased * 3}px)`;

  // ✅ Texto: aparece y desaparece en el MISMO sitio
  const tIn = clamp((current - 0.22) / 0.22, 0, 1);
  const tOut = clamp((current - 0.78) / 0.18, 0, 1);
  const textAlpha = easeOutCubic(tIn) * (1 - easeOutCubic(tOut));

  if (introText) {
    introText.style.opacity = textAlpha;
    introText.style.transform =
      `translate(-50%, -50%) translateY(${(1 - textAlpha) * 14}px)`;
    introText.style.filter = `blur(${(1 - textAlpha) * 10}px)`;
    introText.setAttribute("aria-hidden", textAlpha > 0.05 ? "false" : "true");
  }

  // Estados
  if (current < 0.02) {
    intro.style.pointerEvents = "auto";
    document.body.classList.add("lock-scroll");
    transitionMode = true;
    redirected = false;

    intro.style.opacity = "1";
    intro.style.transition = "";
  } else if (current > 0.98) {
    intro.style.pointerEvents = "none";
    document.body.classList.remove("lock-scroll");
    transitionMode = false;

    goToSala();
  }

  requestAnimationFrame(render);
}

render();

window.addEventListener(
  "wheel",
  (e) => {
    if (transitionMode) {
      e.preventDefault();
      target = clamp(target + e.deltaY * SENS, 0, 1);
      return;
    }

    if (window.scrollY <= 0 && e.deltaY < 0) {
      transitionMode = true;
      e.preventDefault();
      target = clamp(target + e.deltaY * SENS, 0, 1);
    }
  },
  { passive: false }
);
