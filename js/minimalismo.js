$(function () {
  const filas = document.querySelectorAll(".fila");

  filas.forEach((fila) => {
    fila.addEventListener(
      "wheel",
      function (e) {
        const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
        if (!delta) return;

        e.preventDefault(); // evita scroll vertical de la página

        // AUMENTAR VELOCIDAD → cambia 2.5 si quieres más o menos
        const velocidad = 2.5;

        // Movimiento rápido y directo
        fila.scrollLeft += delta * velocidad;
      },
      { passive: false }
    );
  });
});
