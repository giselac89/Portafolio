// ============================================================
// ÁMBAR — Reservas de restaurante
// React sin JSX: todo en una página, sin Router
// ============================================================

var e = React.createElement;

// ------------------------------------------------------------
// UTILIDADES
// ------------------------------------------------------------
var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
var DIAS_SEMANA = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];

function formatearFecha(fechaStr) {
  var f = new Date(fechaStr + "T00:00:00");
  var opciones = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  return f.toLocaleDateString("es-AR", opciones);
}

function textoPersonas(n) {
  if (n === 1) return "persona";
  return "personas";
}

// ------------------------------------------------------------
// COMPONENTE: selector de personas
// ------------------------------------------------------------
function SelectorPersonas(props) {
  var personas = props.personas;
  var setPersonas = props.setPersonas;

  function sumar() { if (personas < 12) setPersonas(personas + 1); }
  function restar() { if (personas > 1) setPersonas(personas - 1); }

  return e("section", { className: "seccion" },
    e("h2", { className: "seccion-titulo" }, "¿Cuántos comensales?"),
    e("p", { className: "seccion-sub" }, "Seleccioná el tamaño de tu grupo"),

    e("div", { className: "personas-grid" },
      [1, 2, 3, 4].map(function (n) {
        return e("button", {
          key: n,
          type: "button",
          className: "persona-btn" + (personas === n ? " activo" : ""),
          onClick: function () { setPersonas(n); }
        },
          e("span", { className: "persona-numero" }, n),
          e("span", { className: "persona-label" }, textoPersonas(n))
        );
      })
    ),

    e("div", { className: "contador" },
      e("button", { type: "button", className: "contador-btn", onClick: restar }, "−"),
      e("div", { style: { textAlign: "center" } },
        e("div", { className: "contador-valor" }, personas),
        e("div", { className: "contador-texto" },
          personas === 1 ? "Solo" : "Con compañía"
        )
      ),
      e("button", { type: "button", className: "contador-btn", onClick: sumar }, "+")
    )
  );
}

// ------------------------------------------------------------
// COMPONENTE: calendario mensual
// ------------------------------------------------------------
function Calendario(props) {
  var fecha = props.fecha;
  var setFecha = props.setFecha;

  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  var hoyISO = hoy.toISOString().slice(0, 10);

  var mesState = React.useState(new Date(fecha + "T00:00:00").getMonth());
  var mes = mesState[0];
  var setMes = mesState[1];

  var anioState = React.useState(new Date(fecha + "T00:00:00").getFullYear());
  var anio = anioState[0];
  var setAnio = anioState[1];

  function mesAnterior() {
    if (mes === 0) { setMes(11); setAnio(anio - 1); }
    else { setMes(mes - 1); }
  }

  function mesSiguiente() {
    if (mes === 11) { setMes(0); setAnio(anio + 1); }
    else { setMes(mes + 1); }
  }

  // Primer día del mes (lunes = 0)
  var primerDia = new Date(anio, mes, 1);
  var diaInicio = primerDia.getDay();
  diaInicio = diaInicio === 0 ? 6 : diaInicio - 1; // Ajustar a lunes = 0

  var diasEnMes = new Date(anio, mes + 1, 0).getDate();

  var celdas = [];

  // Celdas vacías antes del primer día
  for (var i = 0; i < diaInicio; i++) {
    celdas.push(e("div", { key: "vacio-" + i, className: "cal-dia vacio" }));
  }

  // Días del mes
  for (var d = 1; d <= diasEnMes; d++) {
    var fechaDia = anio + "-" + String(mes + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    var esPasado = new Date(fechaDia + "T00:00:00") < hoy;
    var esHoy = fechaDia === hoyISO;
    var esSeleccionado = fechaDia === fecha;

    var clases = "cal-dia";
    if (esPasado) clases += " disabled";
    if (esHoy) clases += " hoy";
    if (esSeleccionado) clases += " selected";

    (function (f, pasado) {
      celdas.push(
        e("button", {
          key: f,
          type: "button",
          className: clases,
          disabled: pasado,
          onClick: function () { if (!pasado) setFecha(f); }
        }, new Date(f + "T00:00:00").getDate())
      );
    })(fechaDia, esPasado);
  }

  return e("section", { className: "seccion" },
    e("h2", { className: "seccion-titulo" }, "¿Cuándo te gustaría visitarnos?"),
    e("p", { className: "seccion-sub" }, "Seleccioná tu fecha preferida"),

    e("div", { className: "cal-header" },
      e("button", { type: "button", className: "cal-nav", onClick: mesAnterior }, "‹"),
      e("span", { className: "cal-mes" }, MESES[mes] + " " + anio),
      e("button", { type: "button", className: "cal-nav", onClick: mesSiguiente }, "›")
    ),

    e("div", { className: "cal-dias-semana" },
      DIAS_SEMANA.map(function (dia) {
        return e("span", { key: dia, className: "cal-dia-semana" }, dia);
      })
    ),

    e("div", { className: "cal-grid" }, celdas),

    fecha ? e("div", { className: "fecha-seleccionada" },
      e("p", { className: "fecha-label" }, "Fecha seleccionada"),
      e("p", { className: "fecha-valor" }, formatearFecha(fecha))
    ) : null
  );
}

// ------------------------------------------------------------
// COMPONENTE: selector de horarios
// ------------------------------------------------------------
function SelectorHorario(props) {
  var hora = props.hora;
  var setHora = props.setHora;
  var horarios = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

  return e("section", { className: "seccion" },
    e("h2", { className: "seccion-titulo" }, "Seleccioná una hora"),
    e("p", { className: "seccion-sub" }, "Elegí un horario disponible"),

    e("div", { className: "horarios-grid" },
      horarios.map(function (h) {
        return e("button", {
          key: h,
          type: "button",
          className: "hora-btn" + (hora === h ? " activo" : ""),
          onClick: function () { setHora(h); }
        },
          e("span", { className: "hora-icono" }, "🕐"),
          h
        );
      })
    )
  );
}

// ------------------------------------------------------------
// COMPONENTE: datos de contacto + botón confirmar
// ------------------------------------------------------------
function DatosContacto(props) {
  var form = props.form;
  var errores = props.errores;
  var updateField = props.updateField;
  var onSubmit = props.onSubmit;
  var personas = props.personas;

  return e("section", { className: "seccion" },
    e("h2", { className: "seccion-titulo" }, "Tus datos"),
    e("p", { className: "seccion-sub" }, "Para confirmar la reserva"),

    e("div", { className: "contacto-grid" },
      e("div", { className: "campo" },
        e("span", { className: "campo-label" }, "Nombre"),
        e("input", {
          name: "nombre",
          placeholder: "Tu nombre",
          value: form.nombre,
          onChange: updateField
        }),
        errores.nombre ? e("p", { className: "error" }, errores.nombre) : null
      ),
      e("div", { className: "campo" },
        e("span", { className: "campo-label" }, "Email"),
        e("input", {
          name: "email",
          type: "email",
          placeholder: "tu@email.com",
          value: form.email,
          onChange: updateField
        }),
        errores.email ? e("p", { className: "error" }, errores.email) : null
      )
    ),

    errores.fecha ? e("p", { className: "error", style: { marginTop: "0.75rem" } }, errores.fecha) : null,
    errores.hora ? e("p", { className: "error", style: { marginTop: "0.5rem" } }, errores.hora) : null,

    e("button", {
      type: "button",
      className: "btn-confirmar",
      onClick: onSubmit
    }, "🍽️ Confirmar reserva para " + personas + " " + textoPersonas(personas))
  );
}

// ------------------------------------------------------------
// COMPONENTE: pantalla de confirmación
// ------------------------------------------------------------
function Confirmacion(props) {
  var reserva = props.reserva;
  var onNueva = props.onNueva;

  return e("section", { className: "seccion", style: { textAlign: "center" } },
    e("div", { className: "confirm-icono" }, "✓"),
    e("h2", { className: "seccion-titulo" }, "¡Reserva confirmada!"),
    e("p", { className: "seccion-sub" }, "Te esperamos en Ámbar, " + reserva.nombre),

    e("div", { className: "confirm-detalle" },
      e("div", { className: "confirm-item" },
        e("span", { className: "confirm-item-label" }, "Fecha"),
        e("span", { className: "confirm-item-valor" }, formatearFecha(reserva.fecha))
      ),
      e("div", { className: "confirm-item" },
        e("span", { className: "confirm-item-label" }, "Horario"),
        e("span", { className: "confirm-item-valor" }, reserva.hora + " hs")
      ),
      e("div", { className: "confirm-item" },
        e("span", { className: "confirm-item-label" }, "Comensales"),
        e("span", { className: "confirm-item-valor" }, reserva.personas + " " + textoPersonas(reserva.personas))
      ),
      e("div", { className: "confirm-item" },
        e("span", { className: "confirm-item-label" }, "Email"),
        e("span", { className: "confirm-item-valor" }, reserva.email)
      )
    ),

    e("button", { type: "button", className: "btn-nueva", onClick: onNueva }, "Hacer otra reserva")
  );
}

// ------------------------------------------------------------
// COMPONENTE: app principal
// ------------------------------------------------------------
function App() {
  var manana = new Date();
  manana.setDate(manana.getDate() + 1);
  var mananaISO = manana.toISOString().slice(0, 10);

  var personasState = React.useState(2);
  var personas = personasState[0];
  var setPersonas = personasState[1];

  var fechaState = React.useState(mananaISO);
  var fecha = fechaState[0];
  var setFecha = fechaState[1];

  var horaState = React.useState("20:00");
  var hora = horaState[0];
  var setHora = horaState[1];

  var formState = React.useState({ nombre: "", email: "" });
  var form = formState[0];
  var setForm = formState[1];

  var erroresState = React.useState({});
  var errores = erroresState[0];
  var setErrores = erroresState[1];

  var reservaState = React.useState(null);
  var reserva = reservaState[0];
  var setReserva = reservaState[1];

  function updateField(event) {
    setForm(Object.assign({}, form, { [event.target.name]: event.target.value }));
    setErrores(Object.assign({}, errores, { [event.target.name]: "" }));
  }

  function confirmar() {
    var datos = {
      nombre: form.nombre,
      email: form.email,
      fecha: fecha,
      hora: hora,
      personas: personas
    };

    var nuevosErrores = validarReserva(datos);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setReserva(datos);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function nuevaReserva() {
    setReserva(null);
    setPersonas(2);
    setFecha(mananaISO);
    setHora("20:00");
    setForm({ nombre: "", email: "" });
    setErrores({});
  }

  return e(React.Fragment, null,
    e("header", { className: "header" },
      e("div", { className: "header-top" },
        e("a", { className: "volver", href: "../../index.html#tarjetas" }, "← Portfolio")
      ),
      e("h1", { className: "brand-name" }, "Santorini Garden"),
      e("p", { className: "brand-sub" }, "reservas")
    ),

    e("main", { className: "shell" },
      reserva
        ? e(Confirmacion, { reserva: reserva, onNueva: nuevaReserva })
        : e(React.Fragment, null,
            e(SelectorPersonas, { personas: personas, setPersonas: setPersonas }),
            e(Calendario, { fecha: fecha, setFecha: setFecha }),
            e(SelectorHorario, { hora: hora, setHora: setHora }),
            e(DatosContacto, {
              form: form,
              errores: errores,
              updateField: updateField,
              onSubmit: confirmar,
              personas: personas
            })
          )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));