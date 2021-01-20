Template.cuentas.onCreated(function () {
	this.perfil = new ReactiveVar(1);
})

Template.cuentas.rendered = function() {
	Tracker.autorun(() => {
		Meteor.subscribe('cuentas');
	});
}

Template.cuentas.helpers({
	cuentas() {
		let perfil = Template.instance().perfil.get();
		return Meteor.users.find({ "profile.rol": perfil }).map(function(usuario) {
			return {
				_id: usuario._id,
				nombres: usuario.profile.nombres,
				username: usuario.username,
				esAdmin: usuario.profile.rol == 1
			}
		})
	},
	perfil() {
		return Template.instance().perfil.get();	
	},
	perfilAlumno() {
		return Template.instance().perfil.get() == 2;
	}
});

Template.cuentas.events({
	"click .btn-juegas.primario, click #btn-nuevo"(e, template) {
		let id = e.currentTarget.id;
		let perfil = template.perfil.get();
		if( id !== "btn-nuevo" ) {
			let usuario = Meteor.users.findOne({ _id: id });
			Session.set("CuentaSeleccionada", usuario);
		} else {
			let defecto = {
				profile: {
					rol: perfil
				}
			};
			if(perfil==3) {
				defecto.profile.asignaturas = [];
			}
			Session.set("CuentaSeleccionada", defecto);
		}
    document.querySelector(".contenedor-editor-cuenta")
			.classList.toggle("activo");
	},
	"change .selector-perfil"(e, template) {
		let perfil = e.currentTarget.value;
		template.perfil.set(Number(perfil));
	}
})