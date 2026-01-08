function createCircularText({
  elementId,
  text,
  spinDuration = 80,
  onHover = "speedUp",
  clickUrl = "../contexto.html"
}) {
  const container = document.getElementById(elementId);
  const wrapper = container.parentElement;
  const image = wrapper.querySelector(".center-image");
  const revealCircle = wrapper.querySelector("#revealCircle");
  const letters = Array.from(text);

  container.innerHTML = "";

  const radius = 110;

  letters.forEach((letter, i) => {
    const angle = (i / letters.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const rotationDeg = (angle * 180) / Math.PI + 90;

    const span = document.createElement("span");
    span.textContent = letter;

    span.style.transform =
      `translate(${x}px, ${y}px) rotate(${rotationDeg}deg)`;

    container.appendChild(span);
  });


  let rotation = 0;
  let speed = 360 / spinDuration;

  function animate() {
    rotation += speed;
    container.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(animate);
  }

  animate();

  
  image.addEventListener("mouseenter", () => {
    if (onHover === "speedUp") speed = 360 / (spinDuration / 4);
  });

  image.addEventListener("mouseleave", () => {
    speed = 360 / spinDuration;
  });

  image.addEventListener("click", () => {
    image.classList.add("zoom-in");

    setTimeout(() => {
      window.location.href = clickUrl;
    }, 600);
  });


  const scrollThreshold = 200; 
  let opened = false;

  window.addEventListener("scroll", () => {
    if (!opened && window.scrollY > scrollThreshold) {
      revealCircle.classList.add("open");
      opened = true;
    }
  });
}

const scrollThreshold = 400; 
let opened = false;

window.addEventListener("scroll", () => {
  if (!opened && window.scrollY > scrollThreshold) {
    revealCircle.classList.add("open");
    opened = true;

   
    setTimeout(() => {
      revealCircle.classList.add("hide");
    }, 1000); 
  }
});




createCircularText({
  elementId: "circularText",
  text: " PINCHA PARA COMENZAR",
  spinDuration: 580,
  onHover: "speedUp",
  clickUrl: "../contexto.html"
});
