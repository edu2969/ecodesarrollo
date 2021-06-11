const ECOActividades = {
  init() {
    Session.set("ECOActividades", [{
      espacio: true
    }, {
      espacio: true
    }, {
      nombre: "identificate",
      icono: "fingerprint",
      activo: true,
      accion: "Soy <b>&hearts;</b> verde"
    }, {
      nombre: "sabermas",
      icono: "contact_support",
      accion: "Quiero saber"
    }])
  },
  set(actividades) {
    Session.set("ECOActividades", actividades);
  },
  get() {
    return Session.get("ECOActividades");
  }
}

module.exports = { ECOActividades };