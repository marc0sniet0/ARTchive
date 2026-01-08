$(function () {
  // SCROLL HORIZONTAL GALERÍA
  const filas = document.querySelectorAll(".fila");

  filas.forEach((fila) => {
    fila.addEventListener("wheel", function (e) {
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault();
        fila.scrollLeft += e.deltaY * 1.5;
      }
      // touchpad: no bloqueamos nada
    });
  });

  // MENÚ HAMBURGUESA
  const $nav = $(".nav");
  const $burger = $(".burger");

  $burger.on("click", function () {
    $nav.toggleClass("nav-show");
    $burger.toggleClass("menu-open");
  });

  $nav.find("a").on("click", function () {
    $nav.removeClass("nav-show");
    $burger.removeClass("menu-open");
  });
});
