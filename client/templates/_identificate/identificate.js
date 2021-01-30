Template.identificate.onCreated(function () {
  this.errores = new ReactiveVar(false);
});

Template.identificate.rendered = function () {

}

Template.identificate.helpers({
  errores() {
    return Template.instance().errores.get();
  }
});

Template.identificate.events({
  "click #btn-login"(e, template) {
    let email = document.querySelector("#input-email").value;
    let password = document.querySelector("#input-password").value;

    Meteor.loginWithPassword({
      username: email
    }, password, function (err, resp) {
      if (!err) {
				UIUtils.toggle("tipo-identificacion", "oculto");
				UIUtils.toggle("contenedor-login", "oculto");
        let estado = {
          enLogin: true
        };
        if (Meteor.user().profile.rol == 2) {
          estado.esCorazonVerde = true;
        } else if( Meteor.user().profile.rol == 1 ) {
          estado.esAdmin = true;
        } 
        Session.set("EstadoApp", estado);
      } else {
        template.errores.set("Ups!, no pareces corazón verde :(");
      }
    });
  }
});