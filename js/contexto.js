(() => {
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  const scroller = document.getElementById("scroller");
  const story = document.getElementById("story");
  const hint = document.querySelector(".hint");

  const btnRecorrido = document.getElementById("btnRecorrido");
  const btnSalas = document.getElementById("btnSalas");

  if (!scroller || !story) return;

  const root = document.documentElement;


  const topbar = document.querySelector(".topbar");
  function syncTopbarH() {
    if (!topbar) return;
    const h = Math.round(topbar.getBoundingClientRect().height || 0);
    if (h) root.style.setProperty("--topbarH", `${h}px`);
  }


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

    
    if (hint && p > 0.02) hint.style.display = "none";

   
    const nearEnd = max > 0 && (max - top) <= 2;

    if (!locked && nearEnd) {
      setLocked(true);
     
      scroller.scrollTop = max;
    }

    
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

 
  scroller.addEventListener(
    "wheel",
    (e) => {
      if (!locked) return;
      if (e.deltaY > 0) e.preventDefault();
    },
    { passive: false }
  );


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

  
  btnRecorrido?.addEventListener("click", () => {
    window.location.href = "PopArt.html";
  });

  btnSalas?.addEventListener("click", () => {
    window.location.href = "Salas.html";
  });

  
  syncTopbarH();
  updateP();
})();
