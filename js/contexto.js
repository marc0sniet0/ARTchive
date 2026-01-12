const scroller = document.getElementById("scroller");
const story = document.getElementById("story");
const root = document.documentElement;

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function update() {
  const maxScroll = story.scrollHeight - scroller.clientHeight;
  const p = maxScroll > 0 ? clamp01(scroller.scrollTop / maxScroll) : 0;
  root.style.setProperty("--p", p.toFixed(4));
}

update();
scroller.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", update);

// BOTÓN: Seguir recorrido
document.getElementById("btnRecorrido").addEventListener("click", () => {
  window.location.href = "PopArt.html";
});

// BOTÓN: Explorar las salas
document.getElementById("btnSalas").addEventListener("click", () => {
  window.location.href = "Salas.html";
  // Cambia "salas.html" por la ruta correcta si es otra
});
