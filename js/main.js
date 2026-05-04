// ============================================================
// GISELA CROCI — js/gisela.js
// ============================================================


// ------------------------------------------------------------
// FUNCION: animarAlScrollear()
// Que hace: los elementos con clase "animar" aparecen con
// fade + deslizamiento suave al llegar a esa parte de la pagina.
// ------------------------------------------------------------
function animarAlScrollear() {
  var elementos = document.querySelectorAll(".animar");
  if (!elementos.length) return;

  var observador = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observador.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach(function (el) {
    observador.observe(el);
  });
}


// ------------------------------------------------------------
// FUNCION: formularioConPopup()
// Que hace: intercepta el submit del formulario, evita que
// redirija a otra pagina, muestra un popup de "Enviado" y
// limpia los campos automaticamente.
// ------------------------------------------------------------
function formularioConPopup() {
  var form = document.querySelector(".formulario");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // evita la redireccion que daba error

    // Limpia el formulario
    form.reset();

    // Muestra el popup
    var popup = document.getElementById("popup-enviado");
    popup.classList.add("popup-visible");

    // Lo oculta solo despues de 3 segundos
    setTimeout(function () {
      popup.classList.remove("popup-visible");
    }, 3000);
  });
}


// ------------------------------------------------------------
// INICIO
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", function () {
  animarAlScrollear();
  formularioConPopup();
});