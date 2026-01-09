
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  const searchBtn = document.getElementById("searchBtn");
  const search = document.getElementById("search");
  const searchInput = document.getElementById("searchInput");

  let autocompleteInitialized = false;

  // Menú móvil
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  // Buscador desplegable
  searchBtn.addEventListener("click", () => {
    const isHidden = search.hasAttribute("hidden");

    if (isHidden) {
      search.removeAttribute("hidden");
      searchBtn.setAttribute("aria-expanded", "true");

      // 🔥 Inicializar autocomplete SOLO cuando el input ya es visible
      if (!autocompleteInitialized) {
        initAutocomplete();
        autocompleteInitialized = true;
      }

      setTimeout(() => searchInput.focus(), 0);
    } else {
      search.setAttribute("hidden", "");
      searchBtn.setAttribute("aria-expanded", "false");
      searchInput.value = "";
    }
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!search.hasAttribute("hidden")) {
      search.setAttribute("hidden", "");
      searchBtn.setAttribute("aria-expanded", "false");
      searchInput.value = "";
    }
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  });

  // 🔥 Función que inicializa el autocomplete
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

    // URLs asociadas a cada palabra
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



