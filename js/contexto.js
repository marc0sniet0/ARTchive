(() => {
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const scroller = document.getElementById("scroller");
  const story = document.getElementById("story");
  const hint = document.querySelector(".hint");

  const btnRecorrido = document.getElementById("btnRecorrido");
  const btnSalas = document.getElementById("btnSalas");

  // Si por lo que sea este JS se carga en otra página, no rompemos nada
  if (!scroller || !story) return;

  const root = document.documentElement;

  // --------- TOPBAR HEIGHT (para que calc(100vh - --topbarH) sea exacto) ----------
  const topbar = document.querySelector(".topbar");
  function syncTopbarH() {
    if (!topbar) return;
    const h = Math.round(topbar.getBoundingClientRect().height || 0);
    if (h) root.style.setProperty("--topbarH", `${h}px`);
  }

  // --------- PROGRESO --p (para tus transforms) ----------
  let ticking = false;
  let locked = false;

  function getMaxScroll() {
    return Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  }

  function setLocked(v) {
    locked = !!v;
    scroller.classList.toggle("isLocked", locked);
    if (hint) hint.style.display = locked ? "none" : "";
  }

  function updateP() {
    ticking = false;

    const max = getMaxScroll();
    const top = scroller.scrollTop;

    const p = max === 0 ? 0 : clamp(top / max, 0, 1);
    root.style.setProperty("--p", String(p));

    // Oculta hint en cuanto el usuario se mueve un poco
    if (hint && p > 0.02) hint.style.display = "none";

    // ✅ Lock si estás MUY cerca del final real (no “a ojo” con 0.84)
    // margen de 2px para iOS/zoom
    const nearEnd = max > 0 && (max - top) <= 2;

    if (!locked && nearEnd) {
      setLocked(true);
      // clavar abajo para evitar “bounce”
      scroller.scrollTop = max;
    }

    // ✅ Unlock en cuanto subas un poco (para que puedas volver atrás)
    if (locked && top < max - 8) {
      setLocked(false);
    }
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateP);
  }

  scroller.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", () => {
    syncTopbarH();
    requestUpdate();
  });

  // --------- BLOQUEAR SOLO SCROLL HACIA ABAJO CUANDO locked ----------
  // Wheel (trackpad/ratón)
  scroller.addEventListener(
    "wheel",
    (e) => {
      if (!locked) return;
      // deltaY > 0 = intención de bajar
      if (e.deltaY > 0) e.preventDefault();
    },
    { passive: false }
  );

  // Touch (móvil)
  let lastTouchY = null;

  scroller.addEventListener(
    "touchstart",
    (e) => {
      if (!locked) return;
      lastTouchY = e.touches?.[0]?.clientY ?? null;
    },
    { passive: true }
  );

  scroller.addEventListener(
    "touchmove",
    (e) => {
      if (!locked) return;
      const y = e.touches?.[0]?.clientY ?? null;
      if (y == null || lastTouchY == null) return;

      // Si el dedo sube (y disminuye), el contenido baja -> bloquear
      const fingerMovedUp = y < lastTouchY;
      if (fingerMovedUp) e.preventDefault();

      lastTouchY = y;
    },
    { passive: false }
  );

  scroller.addEventListener(
    "touchend",
    () => {
      lastTouchY = null;
    },
    { passive: true }
  );

  // --------- BOTONES (si quieres rutas) ----------
  btnRecorrido?.addEventListener("click", () => {
    window.location.href = "./recorrido.html";
  });

  btnSalas?.addEventListener("click", () => {
    window.location.href = "./salas.html";
  });

  // init
  syncTopbarH();
  updateP();
})();
