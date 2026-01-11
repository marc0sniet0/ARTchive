const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const searchBtn = document.getElementById("searchBtn");
const search = document.getElementById("search");
const searchInput = document.getElementById("searchInput");

let autocompleteInitialized = false;

/* -----------------------------
   MENÚ HAMBURGUESA
----------------------------- */
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

/* -----------------------------
   BUSCADOR (LUPA)
----------------------------- */
searchBtn.addEventListener("click", () => {
  const isHidden = search.hasAttribute("hidden");

  if (isHidden) {
    // Mostrar buscador
    search.removeAttribute("hidden");
    search.classList.add("is-open");
    searchBtn.setAttribute("aria-expanded", "true");

    // Inicializar autocomplete solo una vez
    if (!autocompleteInitialized) {
      initAutocomplete();
      autocompleteInitialized = true;
    }

    setTimeout(() => searchInput.focus(), 0);

  } else {
    // Ocultar buscador
    search.setAttribute("hidden", "");
    search.classList.remove("is-open");
    searchBtn.setAttribute("aria-expanded", "false");
    searchInput.value = "";
  }
});

/* -----------------------------
   CERRAR TODO CON ESCAPE
----------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  // Cerrar buscador
  if (!search.hasAttribute("hidden")) {
    search.setAttribute("hidden", "");
    search.classList.remove("is-open");
    searchBtn.setAttribute("aria-expanded", "false");
    searchInput.value = "";
  }

  // Cerrar menú
  nav.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
});

/* -----------------------------
   AUTOCOMPLETE + REDIRECCIÓN
----------------------------- */
function initAutocomplete() {
  const availableTags = [
    "Whaam!",
    "Drowning Girl",
    "Look Mickey",
    "Crying Girl",
    "Marilyn",
    "Campbell's Soup",
    "Brillo Box",
    "Flowers",
    "LOVE",
    "Flag"
  ];

  const urls = {
    "Whaam!": "./PopArt.html?obra=0",
    "Drowning Girl": "./PopArt.html?obra=1",
    "Look Mickey": "./PopArt.html?obra=2",
    "Crying Girl": "./PopArt.html?obra=3",
    "Marilyn": "./PopArt.html?obra=4",
    "Campbell's Soup": "./PopArt.html?obra=5",
    "Brillo Box": "./PopArt.html?obra=6",
    "Flowers": "./PopArt.html?obra=7",
    "LOVE": "./PopArt.html?obra=8",
    "Flag": "./PopArt.html?obra=9"
  };

  $("#searchInput").autocomplete({
    source: availableTags,
    minLength: 1,
    delay: 0,
    select: function (event, ui) {
      const value = ui.item.value;
      if (urls[value]) {
        window.location.href = urls[value];
      } else {
        alert("No hay página asignada para: " + value);
      }
    }
  });
}
