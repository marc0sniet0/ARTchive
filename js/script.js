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
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
  ];

  const urls = {
    "BASIC": "basic.html",
    "JavaScript": "https://tuweb.com/js",
    "Python": "https://tuweb.com/python"
    // Añade más si quieres
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



