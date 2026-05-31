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
