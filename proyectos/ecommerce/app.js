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
    descripcion: "Cadena con dije de corazón en resina natural.",
    precio: 62990,
    imagen: "https://product-images.therealreal.com/NECKL302512_1_enlarged.jpg"
  },
  {
    id: 2,
    nombre: "Collar India",
    categoria: "Collar",
    descripcion: "Piedras naturales en tonos verdes y tierra, facetadas.",
    precio: 112890,
    imagen: "https://eversonmanufacturingjewellers.co.nz/cdn/shop/products/310040_800x.jpg?v=1584346438"
  },
  {
    id: 3,
    nombre: "Collar Egipto",
    categoria: "Collar",
    descripcion: "Baño tono oro rosa, Cadena de 45cm con extensión de 5cm.",
    precio: 189890,
    imagen: "https://newswarovskiargentina.vtexassets.com/unsafe/1280x0/center/middle/https%3A%2F%2Fnewswarovskiargentina.vtexassets.com%2Farquivos%2Fids%2F658027%2F5736984-1.jpg%3Fv%3D639040205843200000"
  },
  {
    id: 4,
    nombre: "Aro Siena",
    categoria: "Aro",
    descripcion: "Aro bañado en oro de 18k, uso diario.",
    precio: 48500,
    imagen: "https://dediosjoyas.com/ar/1858-large_default/aros-circulares-dorados.jpg"
  },
  {
  id: 5,
  nombre: "Pulsera Verona",
  categoria: "Pulsera",
  descripcion: "Pulsera ajustable con cuentas de piedra volcánica y doradas.",
  precio: 45990,
  imagen: "https://m.media-amazon.com/images/I/61K8Ynv3j0L.jpg_BO30,255,255,255_UF750,750_SR1910,1000,0,C_QL100_.jpg"
  },
  {
    id: 6,
    nombre: "Aros Firenze",
    categoria: "Aros",
    descripcion: "Aros colgantes en plata 925 con incrustaciones de circonias brillantes.",
    precio: 38990,
    imagen: "https://www.bluemoonjoyas.com.ar/assets/fotos/Z71788_.jpg"
  },
  {
    id: 7,
    nombre: "Anillo Milano",
    categoria: "Anillo",
    descripcion: "Anillo en acero inoxidable con acabado pulido espejo.",
    precio: 24990,
    imagen: "https://amalaya.com.mx/cdn/shop/files/1185-P_AnilloDonnaplateado-2copia.jpg?v=1751509695&width=3840"
  },
  {
    id: 8,
    nombre: "Tobillera Capri",
    categoria: "Tobillera",
    descripcion: "Tobillera delicada con cadena fina y pequeños dijes.",
    precio: 19990,
    imagen: "https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/drobin1/diamond/diamond-Brillant_AAA/alloycolour/yellow.jpg"
  },
  {
    id: 9,
    nombre: "Broche Argentina",
    categoria: "Broche",
    descripcion: "Broche elegante con forma de tallo y detalles en cristal.",
    precio: 32990,
    imagen: "https://img.nihaojewelry.com/fit-in/800x800/product/2025/8/15/1956276270409060352/Nuevo-Broche-De-Orqu-dea-Elegante-Dise-o-De-Lujo-Ligero-Broche-De-Cristal-Azul-Accesorio-De-Traje-Exquisito-Y-Gracioso.webp"
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
   e("div", { className: "producto-img" },  producto.imagen ? e("img", { src: producto.imagen, alt: producto.nombre }) : producto.icono),
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
// COMPONENTE: popup de método de pago
// ------------------------------------------------------------
function PopupPago(props) {
  var total = props.total;
  var nombre = props.nombre;
  var onCerrar = props.onCerrar;
  var onConfirmar = props.onConfirmar;

  return e("div", { className: "popup-overlay" },
    e("div", { className: "popup-pago" },
      e("p", { className: "popup-tagline" }, "art · design"),
      e("h2", { className: "popup-titulo" }, "AURORA"),
      e("div", { className: "popup-linea" }),
      e("p", { className: "popup-saludo" }, "Hola, " + nombre),
      e("p", { className: "popup-monto" }, "Total: " + formatoPrecio(total)),
      e("p", { className: "popup-pregunta" }, "¿Cómo querés abonar?"),
      e("div", { className: "popup-opciones" },
      e("button", { className: "popup-btn", onClick: function () { onConfirmar("transferencia"); } },
        e("span", { className: "popup-btn-icono" }, "🏦"),
        e("span", { className: "popup-btn-label" }, "Transferencia"),
        e("span", { className: "popup-btn-sub" }, "10% de descuento")
      ),
      e("button", { className: "popup-btn", onClick: function () { onConfirmar("tarjeta"); } },
        e("span", { className: "popup-btn-icono" }, "💳"),
        e("span", { className: "popup-btn-label" }, "Tarjeta de crédito"),
        e("span", { className: "popup-btn-sub" }, "Pago en 1 cuota")
      )
    ),
      e("button", { className: "popup-cancelar", onClick: onCerrar }, "Cancelar")
    )
  );
}

function PopupTransferencia(props) {
  var onConfirmar = props.onConfirmar;
  var onCerrar = props.onCerrar;
  var nombre = props.nombre;

  return e("div", { className: "popup-overlay" },
    e("div", { className: "popup-pago" },
      e("p", { className: "popup-tagline" }, "art · design"),
      e("h2", { className: "popup-titulo" }, "AURORA"),
      e("div", { className: "popup-linea" }),
      e("p", { className: "popup-saludo" }, "¡Casi listo, " + nombre + "!"),
      e("div", { className: "transferencia-info" },
        e("p", { className: "transferencia-item" }, "🏦  Te enviamos el CBU a tu mail"),
        e("p", { className: "transferencia-item" }, "📎  Respondé con el comprobante de pago"),
        e("p", { className: "transferencia-item" }, "🚚  Coordinamos el envío al confirmar"),
        e("p", { className: "transferencia-descuento" }, "10% de descuento aplicado")
      ),
      e("button", { className: "popup-btn-confirmar", onClick: onConfirmar }, "Confirmar pedido"),
      e("button", { className: "popup-cancelar", onClick: onCerrar }, "Volver")
    )
  );
}

function PopupTarjeta(props) {
  var onConfirmar = props.onConfirmar;
  var onCerrar = props.onCerrar;
  var total = props.total;

  var cardState = React.useState({ numero: "", vencimiento: "", cvv: "", titular: "" });
  var card = cardState[0];
  var setCard = cardState[1];
  var errorState = React.useState("");
  var error = errorState[0];
  var setError = errorState[1];
  var pagadoState = React.useState(false);
  var pagado = pagadoState[0];
  var setPagado = pagadoState[1];

  function updateCard(event) {
    setCard(Object.assign({}, card, { [event.target.name]: event.target.value }));
    setError("");
  }

  function pagar(event) {
    event.preventDefault();
    if (card.numero.replace(/\s/g, "").length < 16) {
      setError("Ingresá los 16 dígitos de la tarjeta."); return;
    }
    if (card.vencimiento.length < 5) {
      setError("Ingresá el vencimiento. Ej: 08/27."); return;
    }
    var partes = card.vencimiento.split("/");
    var mes = parseInt(partes[0]);
    var anio = parseInt("20" + partes[1]);
    var hoy = new Date();
    if (mes < 1 || mes > 12) {
      setError("El mes debe ser entre 01 y 12."); return;
    }
    if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
      setError("La tarjeta está vencida."); return;
    }
    if (card.cvv.length < 3) {
      setError("El código de seguridad debe tener 3 o 4 dígitos."); return;
    }
    if (card.titular.trim() === "") {
      setError("Ingresá el nombre como figura en la tarjeta."); return;
    }
    setPagado(true);
    setTimeout(function() { onConfirmar(); }, 2500);
  }

  function formatNumero(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatVencimiento(val) {
    val = val.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) return val.slice(0, 2) + "/" + val.slice(2);
    return val;
  }

  if (pagado) {
    return e("div", { className: "popup-overlay" },
      e("div", { className: "popup-pago" },
        e("p", { className: "popup-tagline" }, "art · design"),
        e("h2", { className: "popup-titulo" }, "AURORA"),
        e("div", { className: "popup-linea" }),
        e("div", { className: "pago-exito" },
          e("span", { className: "pago-exito-icono" }, "✓"),
          e("p", { className: "pago-exito-titulo" }, "¡Pago exitoso!"),
          e("p", { className: "pago-exito-monto" }, formatoPrecio(total)),
          e("p", { className: "pago-exito-sub" }, "Te enviamos el comprobante a tu mail.")
        )
      )
    );
  }

  return e("div", { className: "popup-overlay" },
    e("div", { className: "popup-pago" },
      e("p", { className: "popup-tagline" }, "art · design"),
      e("h2", { className: "popup-titulo" }, "AURORA"),
      e("div", { className: "popup-linea" }),
      e("p", { className: "popup-monto" }, "Total: " + formatoPrecio(total)),
      e("form", { onSubmit: pagar, noValidate: true, className: "tarjeta-form" },
        e("input", {
          name: "numero", placeholder: "Número de tarjeta",
          value: card.numero, maxLength: 19,
          onChange: function(ev) {
            setCard(Object.assign({}, card, { numero: formatNumero(ev.target.value) }));
            setError("");
          }
        }),
        e("div", { className: "tarjeta-fila" },
          e("input", {
            name: "vencimiento", placeholder: "MM/AA",
            value: card.vencimiento, maxLength: 5,
            onChange: function(ev) {
              setCard(Object.assign({}, card, { vencimiento: formatVencimiento(ev.target.value) }));
              setError("");
            }
          }),
          e("input", {
            name: "cvv", placeholder: "CVV",
            value: card.cvv, maxLength: 4, type: "password",
            onChange: updateCard
          })
        ),
        e("input", {
          name: "titular", placeholder: "Titular (como figura en la tarjeta)",
          value: card.titular, onChange: updateCard
        }),
        error ? e("p", { className: "error-msg" }, error) : null,
        e("button", { type: "submit", className: "popup-btn-confirmar" }, "Pagar " + formatoPrecio(total))
      ),
      e("button", { className: "popup-cancelar", onClick: onCerrar }, "Volver")
    )
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
  var erroresState = React.useState({});
  var errores = erroresState[0];
  var setErrores = erroresState[1];
  var popupState = React.useState(false);
  var mostrarPopup = popupState[0];
  var setMostrarPopup = popupState[1];
  var mensajeState = React.useState("");
  var mensaje = mensajeState[0];
  var setMensaje = mensajeState[1];
  var tarjetaState = React.useState(false);
  var mostrarTarjeta = tarjetaState[0];
  var setMostrarTarjeta = tarjetaState[1];
  var transferenciaState = React.useState(false);
  var mostrarTransferencia = transferenciaState[0];
  var setMostrarTransferencia = transferenciaState[1];

  function updateField(event) {
    setForm(Object.assign({}, form, { [event.target.name]: event.target.value }));
    setErrores(Object.assign({}, errores, { [event.target.name]: "" }));
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validarDireccion(dir) {
    return dir.trim().length >= 10 && /\d/.test(dir);
  }

  function validarFormulario() {
    var nuevosErrores = {};
    var esValido = true;
    if (form.nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio.";
      esValido = false;
    }
    if (!validarEmail(form.email)) {
      nuevosErrores.email = "Ingresá un email válido. Ej: nombre@dominio.com";
      esValido = false;
    }
    if (!validarDireccion(form.direccion)) {
      nuevosErrores.direccion = "Ingresá calle y número. Ej: Av. Corrientes 1234";
      esValido = false;
    }
    setErrores(nuevosErrores);
    return esValido;
  }

  function enviar(event) {
    event.preventDefault();
    if (!props.total) {
      setMensaje("Agregá al menos un producto antes de comprar.");
      return;
    }
    if (!validarFormulario()) return;
    setMostrarPopup(true);
  }

function confirmarPago(metodo) {
    setMostrarPopup(false);
    if (metodo === "transferencia") {
      setMostrarTransferencia(true);
    } else {
      setMostrarTarjeta(true);
    }
  }

  function finalizarPedido(metodo) {
    var texto = metodo === "transferencia"
      ? "Pedido confirmado. Te enviamos el CBU a tu mail. ¡Gracias, " + form.nombre + "!"
      : "Pago procesado con éxito. ¡Gracias, " + form.nombre + "!";
    setMostrarTransferencia(false);
    setMostrarTarjeta(false);
    setMensaje(texto);
    setForm(initialForm);
    setErrores({});
    cart.dispatch({ type: "clear" });
  }

return e(React.Fragment, null,
    mostrarPopup ? e(PopupPago, { total: props.total, nombre: form.nombre, onCerrar: function() { setMostrarPopup(false); }, onConfirmar: confirmarPago }) : null,
    mostrarTransferencia ? e(PopupTransferencia, { nombre: form.nombre, onCerrar: function() { setMostrarTransferencia(false); }, onConfirmar: function() { finalizarPedido("transferencia"); } }) : null,
    mostrarTarjeta ? e(PopupTarjeta, { total: props.total, onCerrar: function() { setMostrarTarjeta(false); }, onConfirmar: function() { finalizarPedido("tarjeta"); } }) : null,
    e("section", { className: "checkout" },
      e("h2", null, "Checkout"),
      e("form", { onSubmit: enviar, noValidate: true },
        e("div", { className: "campo" },
          e("input", { name: "nombre", placeholder: "Nombre completo", value: form.nombre, onChange: updateField, className: errores.nombre ? "input-error" : "" }),
          errores.nombre ? e("span", { className: "error-msg" }, errores.nombre) : null
        ),
        e("div", { className: "campo" },
          e("input", { name: "email", type: "email", placeholder: "Email", value: form.email, onChange: updateField, className: errores.email ? "input-error" : "" }),
          errores.email ? e("span", { className: "error-msg" }, errores.email) : null
        ),
        e("div", { className: "campo" },
          e("input", { name: "direccion", placeholder: "Dirección de envío (calle y número)", value: form.direccion, onChange: updateField, className: errores.direccion ? "input-error" : "" }),
          errores.direccion ? e("span", { className: "error-msg" }, errores.direccion) : null
        ),
        e("button", { type: "submit" }, "Confirmar pedido")
      ),
      mensaje ? e("p", { className: "mensaje" }, mensaje) : null
    )
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
