var e = React.createElement;
var Router = ReactRouterDOM.HashRouter;
var Switch = ReactRouterDOM.Switch;
var Route = ReactRouterDOM.Route;
var Link = ReactRouterDOM.Link;
var useHistory = ReactRouterDOM.useHistory;

function fechaISO(offset) {
  var fecha = new Date();
  fecha.setDate(fecha.getDate() + offset);
  return fecha.toISOString().slice(0, 10);
}

function Calendario(props) {
  var dias = Array.from({ length: 14 }, function (_, index) {
    return fechaISO(index);
  });

  return e("aside", { className: "calendar-card" },
    e("h2", null, "Calendario"),
    e("div", { className: "calendar" },
      dias.map(function (dia) {
        var numero = new Date(dia + "T00:00:00").getDate();
        return e("button", {
          key: dia,
          type: "button",
          className: "day" + (props.fecha === dia ? " selected" : ""),
          onClick: function () { props.onSelect(dia); }
        }, numero);
      })
    )
  );
}

function FormularioReserva(props) {
  var history = useHistory();
  var initial = { nombre: "", email: "", fecha: fechaISO(1), hora: "20:00", personas: "2", notas: "" };
  var formState = React.useState(initial);
  var form = formState[0];
  var setForm = formState[1];
  var erroresState = React.useState({});
  var errores = erroresState[0];
  var setErrores = erroresState[1];

  function updateField(event) {
    setForm(Object.assign({}, form, { [event.target.name]: event.target.value }));
  }

  function setFecha(fecha) {
    setForm(Object.assign({}, form, { fecha: fecha }));
  }

  function submit(event) {
    event.preventDefault();
    var nuevosErrores = validarReserva(form);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onConfirm(form);
      history.push("/confirmacion");
    }
  }

  return e("div", { className: "panel" },
    e("form", { className: "form-card", onSubmit: submit, noValidate: true },
      e("div", { className: "form-grid" },
        e("label", null, "Nombre",
          e("input", { name: "nombre", value: form.nombre, onChange: updateField, placeholder: "Tu nombre" }),
          errores.nombre ? e("p", { className: "error" }, errores.nombre) : null
        ),
        e("label", null, "Email",
          e("input", { name: "email", value: form.email, onChange: updateField, placeholder: "tu@email.com" }),
          errores.email ? e("p", { className: "error" }, errores.email) : null
        ),
        e("label", null, "Fecha",
          e("input", { name: "fecha", type: "date", value: form.fecha, onChange: updateField }),
          errores.fecha ? e("p", { className: "error" }, errores.fecha) : null
        ),
        e("label", null, "Horario",
          e("select", { name: "hora", value: form.hora, onChange: updateField },
            ["19:00", "20:00", "21:00", "22:00"].map(function (hora) {
              return e("option", { key: hora, value: hora }, hora);
            })
          ),
          errores.hora ? e("p", { className: "error" }, errores.hora) : null
        ),
        e("label", null, "Personas",
          e("input", { name: "personas", type: "number", min: "1", max: "8", value: form.personas, onChange: updateField }),
          errores.personas ? e("p", { className: "error" }, errores.personas) : null
        ),
        e("label", { className: "full" }, "Notas",
          e("input", { name: "notas", value: form.notas, onChange: updateField, placeholder: "Alergias, preferencias o comentarios" })
        )
      ),
      e("button", { className: "submit", type: "submit" }, "Confirmar reserva")
    ),
    e(Calendario, { fecha: form.fecha, onSelect: setFecha })
  );
}

function Confirmacion(props) {
  var history = useHistory();

  if (!props.reserva) {
    return e("section", { className: "confirm-card" },
      e("h2", null, "Todavía no hay reserva"),
      e("p", null, "Completá el formulario para ver la confirmación."),
      e("button", { className: "submit", onClick: function () { history.push("/"); } }, "Ir al formulario")
    );
  }

  return e("section", { className: "confirm-card" },
    e("h2", null, "Reserva confirmada"),
    e("p", null, e("strong", null, props.reserva.nombre), ", te esperamos el ", e("strong", null, props.reserva.fecha), " a las ", e("strong", null, props.reserva.hora), "."),
    e("p", null, "Mesa para ", props.reserva.personas, " personas."),
    props.reserva.notas ? e("p", null, "Notas: ", props.reserva.notas) : null,
    e("button", { className: "submit", onClick: function () { history.push("/"); } }, "Crear otra reserva")
  );
}

function App() {
  var reservaState = React.useState(null);
  var reserva = reservaState[0];
  var setReserva = reservaState[1];

  return e(Router, null,
    e(React.Fragment, null,
      e("header", { className: "hero" },
        e("a", { className: "volver", href: "../../index.html#tarjetas" }, "Volver al portfolio"),
        e("div", null,
          e("h1", null, "Reservas Cálidas"),
          e("p", null, "Formulario controlado con validación, calendario simple, React Router y pantalla de confirmación.")
        )
      ),
      e("main", { className: "shell" },
        e("nav", { className: "tabs", "aria-label": "Navegación de reservas" },
          e(Link, { to: "/" }, "Formulario"),
          e(Link, { to: "/confirmacion" }, "Confirmación")
        ),
        e(Switch, null,
          e(Route, { path: "/confirmacion" }, e(Confirmacion, { reserva: reserva })),
          e(Route, { path: "/" }, e(FormularioReserva, { onConfirm: setReserva }))
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));
