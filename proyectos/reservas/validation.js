function validarReserva(reserva) {
  var errores = {};
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  var fecha = reserva.fecha ? new Date(reserva.fecha + "T00:00:00") : null;

  if (!reserva.nombre || reserva.nombre.trim().length < 2) {
    errores.nombre = "Ingresá un nombre válido.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reserva.email || "")) {
    errores.email = "Ingresá un email válido.";
  }

  if (!fecha || fecha < hoy) {
    errores.fecha = "Elegí una fecha disponible.";
  }

  if (!reserva.hora) {
    errores.hora = "Seleccioná un horario.";
  }

  if (!reserva.personas || Number(reserva.personas) < 1 || Number(reserva.personas) > 8) {
    errores.personas = "Reservá para 1 a 8 personas.";
  }

  return errores;
}

if (typeof module !== "undefined") {
  module.exports = { validarReserva: validarReserva };
}
