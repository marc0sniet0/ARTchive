$(function () {
  const filas = document.querySelectorAll(".fila");

  filas.forEach((fila) => {
    fila.addEventListener("wheel", function (e) {
      // Si el usuario usa la rueda del ratón (scroll vertical)
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault();
        fila.scrollLeft += e.deltaY * 1.5;
      }

      // Si el usuario usa el touchpad → NO BLOQUEAR NADA
      // El navegador ya hace scroll horizontal nativo
    });
  });
});
