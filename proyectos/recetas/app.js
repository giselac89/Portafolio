var recetas = [];
var categoriaActual = "";

var recetasEl = document.getElementById("recetas");
var estadoEl = document.getElementById("estado");
var busquedaEl = document.getElementById("busqueda");
var categoriaEl = document.getElementById("categoria");
var btnBuscar = document.getElementById("btn-buscar");
var template = document.getElementById("receta-template");

function ingredientesDe(meal) {
  return Array.from({ length: 20 }, function (_, index) {
    var nombre = meal["strIngredient" + (index + 1)];
    var medida = meal["strMeasure" + (index + 1)];
    return nombre ? (medida || "").trim() + " " + nombre.trim() : "";
  })
    .map(function (item) { return item.trim(); })
    .filter(Boolean)
    .slice(0, 5);
}

function verReceta(id) {
  fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var meal = data.meals[0];
      mostrarPopupReceta(meal);
    });
}

function mostrarPopupReceta(meal) {
  var overlay = document.createElement("div");
  overlay.className = "popup-overlay";
  overlay.id = "popup-receta";

  var ingredientes = Array.from({ length: 20 }, function(_, i) {
    var nombre = meal["strIngredient" + (i + 1)];
    var medida = meal["strMeasure" + (i + 1)];
    return nombre && nombre.trim() ? (medida || "").trim() + " " + nombre.trim() : "";
  }).filter(Boolean);

  var liItems = ingredientes.map(function(ing) {
    return "<li>" + ing + "</li>";
  }).join("");

  var instrucciones = meal.strInstructions
    ? meal.strInstructions.replace(/\r?\n\r?\n/g, "</p><p>").replace(/\r?\n/g, " ")
    : "No hay instrucciones disponibles.";

  overlay.innerHTML = `
    <div class="popup-receta">
      <div class="popup-receta-header">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="popup-receta-img" />
        <div class="popup-receta-titulo">
          <span class="receta-categoria">${meal.strCategory || ""}</span>
          <h2>${meal.strMeal}</h2>
          <p class="receta-area">${meal.strArea ? "Cocina " + meal.strArea : "Cocina internacional"}</p>
        </div>
      </div>
      <div class="popup-receta-cuerpo">
        <div class="popup-seccion">
          <h3>Ingredientes completos</h3>
          <ul class="ingredientes-completos">${liItems}</ul>
        </div>
        <div class="popup-seccion">
          <h3>Instrucciones</h3>
          <div class="instrucciones"><p>${instrucciones}</p></div>
        </div>
      </div>
      <button class="popup-cerrar" id="cerrar-popup-receta">✕ Cerrar</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("cerrar-popup-receta").addEventListener("click", function() {
    overlay.remove();
  });

  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) overlay.remove();
  });
}

function renderRecetas(lista) {
  recetasEl.innerHTML = "";

  if (!lista.length) {
    estadoEl.textContent = "No encontré recetas con esos filtros.";
    return;
  }

  estadoEl.textContent = lista.length + " recetas encontradas";

  lista.forEach(function (meal) {
    var card = template.content.cloneNode(true);
    var imagen = card.querySelector(".receta-img");

    imagen.src = meal.strMealThumb;
    imagen.alt = "Foto de " + meal.strMeal;
    card.querySelector(".receta-categoria").textContent = meal.strCategory || "Receta";
    card.querySelector("h2").textContent = meal.strMeal;
    card.querySelector(".receta-area").textContent = meal.strArea ? "Cocina " + meal.strArea : "Cocina internacional";

    var ingredientesEl = card.querySelector(".ingredientes");
    ingredientesDe(meal).forEach(function (ingrediente) {
      var li = document.createElement("li");
      li.textContent = ingrediente;
      ingredientesEl.appendChild(li);
    });

      card.querySelector(".receta-card").addEventListener("click", function() {
        verReceta(meal.idMeal);
    });

    recetasEl.appendChild(card);
  });
}

function aplicarFiltros() {
  var texto = busquedaEl.value.trim().toLowerCase();
  var filtradas = recetas
    .filter(function (meal) {
      return !categoriaActual || meal.strCategory === categoriaActual;
    })
    .filter(function (meal) {
      return !texto || meal.strMeal.toLowerCase().includes(texto);
    });

  renderRecetas(filtradas);
}

function cargarCategorias() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      data.categories.forEach(function (categoria) {
        var option = document.createElement("option");
        option.value = categoria.strCategory;
        option.textContent = categoria.strCategory;
        categoriaEl.appendChild(option);
      });
    });
}

function cargarRecetas(busqueda) {
  estadoEl.textContent = "Buscando recetas...";
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(busqueda || ""))
    .then(function (res) { return res.json(); })
    .then(function (data) {
      recetas = data.meals || [];
      aplicarFiltros();
    })
    .catch(function () {
      estadoEl.textContent = "No pude conectar con TheMealDB. Probá de nuevo en unos segundos.";
    });
}

btnBuscar.addEventListener("click", function () {
  cargarRecetas(busquedaEl.value);
});

busquedaEl.addEventListener("input", aplicarFiltros);

categoriaEl.addEventListener("change", function (event) {
  categoriaActual = event.target.value;
  aplicarFiltros();
});

cargarCategorias();
cargarRecetas("");

document.getElementById("traducir-cerrar").addEventListener("click", function() {
  document.getElementById("traducir-overlay").remove();
});