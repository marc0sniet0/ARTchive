// Espera a que termine la animación del texto
// 2.5s (colores) + 1s (disolución) = 3.5s

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");

    // Desvanece la pantalla de carga
    loadingScreen.style.opacity = "0";
    loadingScreen.style.pointerEvents = "none";

    // Elimina del DOM después del fade-out
    setTimeout(() => {
      loadingScreen.remove();
    }, 800); // coincide con el transition del CSS
  }, 3500);
});
