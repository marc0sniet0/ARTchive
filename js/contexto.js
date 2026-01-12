
    const scroller = document.getElementById("scroller");
    const story = document.getElementById("story");
    const root = document.documentElement;

    function clamp01(v){ return Math.max(0, Math.min(1, v)); }

    function update(){
      const maxScroll = story.scrollHeight - scroller.clientHeight;
      const p = maxScroll > 0 ? clamp01(scroller.scrollTop / maxScroll) : 0;
      root.style.setProperty("--p", p.toFixed(4));
    }

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    document.getElementById("btnRecorrido").addEventListener("click", () => {
      alert("Seguir recorrido ✨ (pon aquí tu link)");
    });

    document.getElementById("btnSalas").addEventListener("click", () => {
      alert("Explorar las salas 🗺️ (pon aquí tu link)");
    });