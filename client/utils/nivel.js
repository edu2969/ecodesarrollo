const { Depositos } = require("../../lib/collections/BaseCollections");

const Nivel = {
  setNivelUsuario() {
    const nivel = {};
    for (let i = 1; i <= 4; i++) {
      nivel["nivel" + i] = false;
    }
    const usuario = Meteor.user();
    if (usuario) {
      nivel.nivel1 = {
        completado: true,
        porcentaje: 100,
        pasos: {
          paso1: { completado: true },
          paso2: { completado: true },
          paso3: { completado: true },
          paso4: { completado: true }
        }
      }
      nivel.nivel2 = {
        porcentaje: 0,
        actual: true
      }
      const depositoInicial = Depositos.findOne();
      if (depositoInicial) {
        if (depositoInicial.pendiente) {
          nivel.nivel2 = {
            completado: false,
            porcentaje: 50,
            actual: true
          }
        } else {
          nivel.nivel2 = {
            completado: true,
            porcentaje: 100
          }
          nivel.nivel3 = {
            porcentaje: 0,
            actual: true
          }
          if (usuario.profile.codigoSecretoOK) {
            nivel.nivel3.porcentaje = 100;
            nivel.nivel3.completado = true;
            nivel.nivel4 = {
              actual: true,
              puntos: 0
            }
          }
        }
      }
    } else {
      nivel.nivel1 = {
        actual: true,
        pocentaje: 0,
        pasos: {
          paso1: { actual: true },
          paso2: {},
          paso3: {},
          paso4: {}
        }
      }
    }
    Session.set("Nivel", nivel);
  },
  get() {
    return Session.get("Nivel");
  },
  set(nivel) {
    console.log("SETEANDO NIVEL", nivel);
    Session.set("Nivel", nivel);
  }
}

module.exports = {
  Nivel
}