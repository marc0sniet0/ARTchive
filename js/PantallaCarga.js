const NEXT_URL = "./index.html"; 

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");

  let redirected = false;

  function goHome() {
    if (redirected) return;
    redirected = true;
    window.location.replace(NEXT_URL);
  }

  function onAnimEnd(e) {
    if (e.animationName === "dissolve") goHome();
  }

  title.addEventListener("animationend", onAnimEnd);
  subtitle.addEventListener("animationend", onAnimEnd);
  setTimeout(goHome, 5500);
});
