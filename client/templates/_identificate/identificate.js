import { Nivel } from '../../utils/nivel'
import { ECOActividades } from '/lib/ECOActividades'

const iniciarTombola = (template) => {
  UIUtils.toggle("tombola", "desaparece");
  UIUtils.toggle("tombola", "flotalatombola2x");
  setTimeout(function() {
    UIUtils.toggle("tombola", "flotalatombola5x");
    ECOActividades.set([{
      nombre: "eco_organizaciones",
      icono: "share",
      activo: true,
      accion: "ECO Organizaciones"
    }, {
      nombre: "eco_campanas",
      icono: "campaign",
      accion: "ECO Campañas"
    }, {
      nombre: "eco_desarrollos",
      icono: "architecture",
      accion: "ECO Desarrollos"
    }, {
      nombre: "eco_sos",
      icono: "support",
      accion: "ECO S.O.S."
    }]);
    UIUtils.toggle("tombola", "reaparece");
    UIUtils.toggle("tombola", "desaparece");
    UIUtils.toggle("menu-preferencias", "oculto");
    setTimeout(function() {
      UIUtils.toggle("tombola", "reaparece");
    }, 500);
  }, 500);
}

Template.identificate.onCreated(function () {
  Tracker.autorun(() => {
    Meteor.subscribe('usuarios.depositos');
  })
  this.errores = new ReactiveVar(false);
});

Template.identificate.rendered = function () {
  const instance = Template.instance();
}

Template.identificate.helpers({
  errores() {
    return Template.instance().errores.get();
  },
  nivel() {
    return Nivel.get();
  },
  corazonVerde() {
    return Meteor.user();
  }
});

Template.identificate.events({
  "click #btn-login"(e, template) {
    let email = document.querySelector("#input-login-email").value;
    let password = document.querySelector("#input-login-password").value;

    Meteor.loginWithPassword({
      email: email
    }, password, function (err, resp) {
      if (!err) {
        Nivel.setNivelUsuario();
        const nivel = Nivel.get();
        if(nivel.nivel2 && nivel.nivel2.actual) {
          UIUtils.toggle("eco-panel", "activo");
          setTimeout(function() {
            iniciarTombola(template);
          }, 500)
        } else {
          UIUtils.toggle("contendor-identificate", "oculto");
          UIUtils.toggle("contendor-identificate", "oculto");
        }
      } else {
        template.errores.set("Ups!, no pareces corazón verde :(");
        console.error(err);
      }
    });
  },
	"click .contenedor-registrame"() {
    Nivel.setNivelUsuario();
		UIUtils.toggle("contendor-identificate", "oculto");
		UIUtils.toggle("seccion-identificate", "oculto");
	},
	"click .marco-tipo"() {
    $(".tipo-identificacion").toggleClass("oculto");
    $(".seccion-identificate").toggleClass("oculto");
	},
});