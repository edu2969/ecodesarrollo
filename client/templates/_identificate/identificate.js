const { Nivel } = require('../../utils/nivel');

Template.identificate.onCreated(function () {
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
				UIUtils.toggle("tipo-identificacion", "oculto");
				UIUtils.toggle("contendor-identificate", "oculto");
        let estado = {
          enLogin: true
        };
        if (Meteor.user().profile.rol == 2) {
          estado.esCorazonVerde = true;
        } else if( Meteor.user().profile.rol == 1 ) {
          estado.esAdmin = true;
        } 
        Session.set("EstadoApp", estado);
        Nivel.setNivelUsuario();
      } else {
        template.errores.set("Ups!, no pareces corazón verde :(");
        console.error(err);
      }
    });
  },
	"click .contenedor-registrame"() {
		UIUtils.toggle("contendor-identificate", "oculto");
		UIUtils.toggle("wizzard", "oculto");
	},
	"click .marco-tipo"() {
    if(Meteor.userId()) {
      UIUtils.toggle("tipo-identificacion", "oculto");
      UIUtils.toggle("wizzard", "oculto");
    } else {
      UIUtils.toggle("tipo-identificacion", "oculto");
      UIUtils.toggle("contendor-identificate", "oculto");
    }
	},
});