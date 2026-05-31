var e = React.createElement;
var TIEMPO_POR_PREGUNTA = 20;

var fallback = [
  {
    question: "¿Qué método convierte un JSON recibido por fetch en objeto JavaScript?",
    correct_answer: "response.json()",
    incorrect_answers: ["JSON.parse(response)", "response.text()", "fetch.json()"]
  },
  {
    question: "¿Qué hook se usa para ejecutar efectos secundarios en React?",
    correct_answer: "useEffect",
    incorrect_answers: ["useMemo", "useState", "useReducer"]
  },
  {
    question: "¿Qué propiedad CSS permite armar grillas?",
    correct_answer: "display: grid",
    incorrect_answers: ["position: grid", "display: table", "grid-mode: on"]
  }
];

function decodeHtml(text) {
  var textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

function mezclar(lista) {
  return lista
    .map(function (item) { return { item: item, sort: Math.random() }; })
    .sort(function (a, b) { return a.sort - b.sort; })
    .map(function (entry) { return entry.item; });
}

function prepararPreguntas(raw) {
  return raw.map(function (pregunta) {
    return {
      pregunta: decodeHtml(pregunta.question),
      correcta: decodeHtml(pregunta.correct_answer),
      opciones: mezclar(pregunta.incorrect_answers.concat([pregunta.correct_answer]).map(decodeHtml))
    };
  });
}

function App() {
  var preguntasState = React.useState([]);
  var preguntas = preguntasState[0];
  var setPreguntas = preguntasState[1];
  var indiceState = React.useState(0);
  var indice = indiceState[0];
  var setIndice = indiceState[1];
  var puntajeState = React.useState(0);
  var puntaje = puntajeState[0];
  var setPuntaje = puntajeState[1];
  var tiempoState = React.useState(TIEMPO_POR_PREGUNTA);
  var tiempo = tiempoState[0];
  var setTiempo = tiempoState[1];
  var estadoState = React.useState("cargando");
  var estado = estadoState[0];
  var setEstado = estadoState[1];

  function cargarPreguntas() {
    setEstado("cargando");
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setPreguntas(prepararPreguntas(data.results && data.results.length ? data.results : fallback));
        setIndice(0);
        setPuntaje(0);
        setTiempo(TIEMPO_POR_PREGUNTA);
        setEstado("jugando");
      })
      .catch(function () {
        setPreguntas(prepararPreguntas(fallback));
        setIndice(0);
        setPuntaje(0);
        setTiempo(TIEMPO_POR_PREGUNTA);
        setEstado("jugando");
      });
  }

  React.useEffect(function () {
    cargarPreguntas();
  }, []);

  React.useEffect(function () {
    if (estado !== "jugando") return;

    if (tiempo === 0) {
      siguiente();
      return;
    }

    var timer = setTimeout(function () {
      setTiempo(tiempo - 1);
    }, 1000);

    return function () { clearTimeout(timer); };
  }, [tiempo, estado]);

  function siguiente() {
    if (indice + 1 >= preguntas.length) {
      setEstado("resultado");
      return;
    }
    setIndice(indice + 1);
    setTiempo(TIEMPO_POR_PREGUNTA);
  }

  function responder(opcion) {
    if (opcion === preguntas[indice].correcta) {
      setPuntaje(puntaje + 1);
    }
    siguiente();
  }

  var preguntaActual = preguntas[indice];

  return e("main", { className: "page" },
    e("a", { className: "volver", href: "../../index.html#tarjetas" }, "Volver al portfolio"),
    e("section", { className: "hero" },
      e("h1", null, "Trivia Vibrante"),
      e("p", null, "Preguntas con timer, puntaje acumulado y resultados. Usa useState, useEffect y renderizado condicional.")
    ),
    e("section", { className: "panel" },
      estado === "cargando" ? e("p", { className: "notice" }, "Cargando preguntas...") : null,
      estado === "jugando" && preguntaActual ? e(React.Fragment, null,
        e("div", { className: "status" },
          e("span", null, "Pregunta " + (indice + 1) + " de " + preguntas.length),
          e("span", null, "Puntaje: " + puntaje),
          e("span", { className: "timer" }, tiempo)
        ),
        e("div", { className: "question" },
          e("h2", null, preguntaActual.pregunta),
          e("div", { className: "answers" },
            preguntaActual.opciones.map(function (opcion) {
              return e("button", { key: opcion, onClick: function () { responder(opcion); } }, opcion);
            })
          )
        )
      ) : null,
      estado === "resultado" ? e("div", { className: "results" },
        e("h2", null, "Resultado final"),
        e("strong", null, puntaje + "/" + preguntas.length),
        e("p", null, puntaje >= Math.ceil(preguntas.length / 2) ? "Muy buen resultado." : "Podés intentarlo otra vez."),
        e("button", { className: "primary", onClick: cargarPreguntas }, "Jugar de nuevo")
      ) : null
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));
