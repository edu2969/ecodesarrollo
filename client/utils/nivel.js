const Nivel = {
  setNivelUsuario() {
    const nivel = {};
    for(let i=1; i<=4; i++) {
      nivel["nivel" + i] = false;
    }
    const usuario = Meteor.user();
    if(usuario) {
      nivel.nivel1 = {
        completado: false,
        porcentaje: 0
      };
      if(usuario.profile.secretCodeOK) {
        nivel.nivel1.porcentaje = 100;
        nivel.nivel1.completado = true;
        nivel.nivel2 = {
          completado: false,
          porcentaje: 0
        };
        const img = Images.findOne({
          userId: usuario._id,
          "meta.tipo": "rostro"
        });
        if(img) {
          nivel.nivel2.completado = true;
          nivel.nivel2.porcentaje = 100;
          if(true) {
            nivel.nivel3 = {
              completado: true,
              porcentaje: 100,
            }
            const tieneDonaciones = Donaciones.find({ usuarioId: usuario._id }).count() ? true : false;
            if(tieneDonaciones) {
              nivel.nivel4 = {
                completado: tieneDonaciones,
                porcentaje: tieneDonaciones ? 100 : 0
              }
            }
          }
        }
      } else {
        nivel.nivel1.pasos = {
          paso1: { completado: true },
          paso2: { completado: true },
          paso3: { completado: true },
          paso4: { actual: true }
        }
      }
    } else {
      nivel.nivel1 = { 
        pasos: { 
          paso1: { actual: true },
          paso2: {},
          paso3: {},
          paso4: {}
        }
      }
    }
    console.log("NIVEL INICIAL", nivel);
    Session.set("Nivel", nivel);
  },
  get() {
    return Session.get("Nivel");
  },
  set(nivel) {
    Session.set("Nivel", nivel);
  }
}

module.exports = {
  Nivel
}