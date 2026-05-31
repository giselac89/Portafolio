// ============================================================
// AURORA — Accesorios de lujo
// React sin JSX: Context + useReducer + componentes funcionales
// ============================================================

var e = React.createElement;
var CartContext = React.createContext(null);

// ------------------------------------------------------------
// PRODUCTOS: catálogo de accesorios
// ------------------------------------------------------------
var productos = [
  {
    id: 1,
    nombre: "Collar Brescia",
    categoria: "Collar",
    descripcion: "Cadena paper clip con dije de corazón en resina natural.",
    precio: 62990,
    icono: "◈"
  },
  {
    id: 2,
    nombre: "Collar India",
    categoria: "Collar",
    descripcion: "Piedras naturales en tonos verdes y tierra, facetadas a mano.",
    precio: 112890,
    icono: "◉"
  },
  {
    id: 3,
    nombre: "Collar Lila",
    categoria: "Collar",
    descripcion: "Ópalo blanco con pieza central de granate, cierre dorado.",
    precio: 189890,
    icono: "◇"
  },
  {
    id: 4,
    nombre: "Aro Siena",
    categoria: "Aro",
    descripcion: "Aro argolla delgada bañada en oro de 18k, uso diario.",
    precio: 48500,
    icono: "○"
  }
];

// ------------------------------------------------------------
// UTILIDAD: formato de precio en pesos argentinos
// ------------------------------------------------------------
function formatoPrecio(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

// ------------------------------------------------------------
// REDUCER: maneja el estado del carrito
// ------------------------------------------------------------
function cartReducer(state, action) {
  if (action.type === "add") {
    var existe = state.items.find(function (item) {
      return item.id === action.producto.id;
    });
    if (existe) {
      return {
        items: state.items.map(function (item) {
          return item.id === action.producto.id
            ? Object.assign({}, item, { cantidad: item.cantidad + 1 })
            : item;
        })
      };
    }
    return {
      items: state.items.concat([Object.assign({}, action.producto, { cantidad: 1 })])
    };
  }

  if (action.type === "remove") {
    return { items: state.items.filter(function (item) { return item.id !== action.id; }) };
  }

  if (action.type === "decrement") {
    return {
      items: state.items
        .map(function (item) {
          return item.id === action.id
            ? Object.assign({}, item, { cantidad: item.cantidad - 1 })
            : item;
        })
        .filter(function (item) { return item.cantidad > 0; })
    };
  }

  if (action.type === "clear") {
    return { items: [] };
  }

  return state;
}

// ------------------------------------------------------------
// CONTEXT PROVIDER
// ------------------------------------------------------------
function CartProvider(props) {
  var reducerState = React.useReducer(cartReducer, { items: [] });
  return e(
    CartContext.Provider,
    { value: { state: reducerState[0], dispatch: reducerState[1] } },
    props.children
  );
}

function useCart() {
  return React.useContext(CartContext);
}

// ------------------------------------------------------------
// COMPONENTE: tarjeta de producto
// ------------------------------------------------------------
function ProductoCard(props) {
  var cart = useCart();
  var producto = props.producto;

  return e("article", { className: "producto" },
    e("div", { className: "producto-img" }, producto.icono),
    e("div", { className: "producto-info" },
      e("p", { className: "producto-categoria" }, producto.categoria),
      e("h2", null, producto.nombre),
      e("p", null, producto.descripcion),
      e("div", { className: "producto-footer" },
        e("span", { className: "precio" }, formatoPrecio(producto.precio)),
        e("button", {
          onClick: function () {
            cart.dispatch({ type: "add", producto: producto });
          }
        }, "Agregar")
      )
    )
  );
}

// ------------------------------------------------------------
// COMPONENTE: carrito lateral
// ------------------------------------------------------------
function Carrito() {
  var cart = useCart();
  var items = cart.state.items;
  var total = items.reduce(function (acc, item) {
    return acc + item.precio * item.cantidad;
  }, 0);

  return e("aside", { className: "carrito" },
    e("h2", null, "Carrito"),
    e("div", { className: "lineas" },
      items.length === 0
        ? e("p", null, "Todavía no agregaste productos.")
        : items.map(function (item) {
            return e("div", { className: "linea", key: item.id },
              e("div", null,
                e("strong", null, item.nombre),
                e("br"),
                e("small", null, formatoPrecio(item.precio))
              ),
              e("div", { className: "linea-controles" },
                e("button", {
                  onClick: function () { cart.dispatch({ type: "decrement", id: item.id }); }
                }, "−"),
                e("span", null, item.cantidad),
                e("button", {
                  onClick: function () { cart.dispatch({ type: "add", producto: item }); }
                }, "+"),
                e("button", {
                  onClick: function () { cart.dispatch({ type: "remove", id: item.id }); }
                }, "×")
              )
            );
          })
    ),
    e("div", { className: "total" },
      e("span", null, "Total"),
      e("span", null, formatoPrecio(total))
    ),
    e(Checkout, { total: total })
  );
}

// ------------------------------------------------------------
// COMPONENTE: formulario de checkout
// ------------------------------------------------------------
function Checkout(props) {
  var cart = useCart();
  var initialForm = { nombre: "", email: "", direccion: "" };
  var formState = React.useState(initialForm);
  var form = formState[0];
  var setForm = formState[1];
  var mensajeState = React.useState("");
  var mensaje = mensajeState[0];
  var setMensaje = mensajeState[1];

  function updateField(event) {
    setForm(Object.assign({}, form, { [event.target.name]: event.target.value }));
  }

  function enviar(event) {
    event.preventDefault();
    if (!props.total) {
      setMensaje("Agregá al menos un producto antes de comprar.");
      return;
    }
    setMensaje("Pedido confirmado para " + form.nombre + ". ¡Gracias!");
    setForm(initialForm);
    cart.dispatch({ type: "clear" });
  }

  return e("section", { className: "checkout" },
    e("h2", null, "Checkout"),
    e("form", { onSubmit: enviar },
      e("input", {
        name: "nombre",
        placeholder: "Nombre completo",
        value: form.nombre,
        onChange: updateField,
        required: true
      }),
      e("input", {
        name: "email",
        type: "email",
        placeholder: "Email",
        value: form.email,
        onChange: updateField,
        required: true
      }),
      e("input", {
        name: "direccion",
        placeholder: "Dirección de envío",
        value: form.direccion,
        onChange: updateField,
        required: true
      }),
      e("button", { type: "submit" }, "Confirmar pedido")
    ),
    mensaje ? e("p", { className: "mensaje" }, mensaje) : null
  );
}

// ------------------------------------------------------------
// COMPONENTE: logo de la marca
// ------------------------------------------------------------
function Logo() {
  return e("div", { className: "brand" },
    e("p", { className: "brand-tagline" }, "art · design"),
    e("h1", { className: "brand-nombre" }, "AURORA"),
    e("div", { className: "brand-linea" }),
    e("p", { className: "brand-sub" }, "accesorios")
  );
}

// ------------------------------------------------------------
// COMPONENTE: aplicación principal
// ------------------------------------------------------------
function App() {
  var cart = useCart();
  var cantidad = cart.state.items.reduce(function (acc, item) {
    return acc + item.cantidad;
  }, 0);

  return e(React.Fragment, null,
    e("header", { className: "store-header" },
      e("div", { className: "topbar" },
        e("a", { className: "volver", href: "../../index.html#tarjetas" }, "← Portfolio"),
        e("button", { className: "cart-toggle" }, "Carrito (" + cantidad + ")")
      ),
      e(Logo)
    ),
    e("main", { className: "layout" },
      e("section", { className: "catalogo", "aria-label": "Catálogo de productos" },
        productos.map(function (producto) {
          return e(ProductoCard, { key: producto.id, producto: producto });
        })
      ),
      e(Carrito)
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  e(CartProvider, null, e(App))
);
