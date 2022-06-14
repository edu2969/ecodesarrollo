const { Depositos } = require("../../lib/collections/BaseCollections")
const { EstadoType } = require("../../lib/types/EstadoType")

const getNivelUsuario = () => {
  const nivel = {};
  for (let i = 1; i <= 3; i++) {
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
    const depositoInicial = Depositos.findOne({ usuarioId: usuario._id });
    if (depositoInicial) {
      if (depositoInicial.estado === EstadoType.Pendiente) {
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
          porcentaje: 0
        }
        if (usuario.profile.codigoSecretoOK) {
          nivel.nivel3.porcentaje = 100;
          nivel.nivel3.completado = true;
          nivel.nivel4 = {
            actual: true,
            puntos: 0
          }
        } else {
          nivel.nivel3.actual = true;
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
  return nivel
}

const Nivel = {
  setNivelUsuario() {
    Session.set("Nivel", getNivelUsuario())
  },
  get() {
    let nivel = Session.get("Nivel")
    if (!nivel) {
      Session.set("Nivel", getNivelUsuario())
    }
    return Session.get("Nivel")
  },
  set(nivel) {
    Session.set("Nivel", nivel);
  }
}

module.exports = {
  Nivel
}