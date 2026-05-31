const { validarReserva } = require("./validation");

describe("validarReserva", () => {
  test("rechaza datos incompletos", () => {
    const errores = validarReserva({
      nombre: "",
      email: "email-invalido",
      fecha: "",
      hora: "",
      personas: 0
    });

    expect(errores.nombre).toBeTruthy();
    expect(errores.email).toBeTruthy();
    expect(errores.fecha).toBeTruthy();
    expect(errores.hora).toBeTruthy();
    expect(errores.personas).toBeTruthy();
  });

  test("acepta una reserva válida", () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    const errores = validarReserva({
      nombre: "Gisela",
      email: "gisela@email.com",
      fecha: manana.toISOString().slice(0, 10),
      hora: "20:00",
      personas: 2
    });

    expect(errores).toEqual({});
  });
});
