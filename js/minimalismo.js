$(document).ready(function () {
  const $galeria = $(".galeria");
  const $fila1 = $(".fila-1");
  const $fila2 = $(".fila-2");

  $galeria.on("wheel", function (e) {
    const delta = e.originalEvent.deltaY || e.originalEvent.deltaX;

    // Bloquear scroll vertical de la página
    e.preventDefault();

    // Fila de arriba → en el sentido del scroll
    $fila1.scrollLeft($fila1.scrollLeft() + delta);

    // Fila de abajo → en sentido contrario
    $fila2.scrollLeft($fila2.scrollLeft() - delta);
  });
});
