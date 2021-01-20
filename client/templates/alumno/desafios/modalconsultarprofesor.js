Template.modalconsultarprofesor.onCreated(function() {
	this.profesorSeleccionado = new ReactiveVar(false);
})

Template.modalconsultarprofesor.rendered = () => {
	UIUtils.toggleVisible('seleccion', 'asignaturas');
	Tracker.autorun(() => {
		Meteor.subscribe('profesores');
	});
}

Template.modalconsultarprofesor.helpers({
	profesores() {
		return Meteor.users.find({ "profile.rol": 3 }).map(function(profesor) {
			profesor.asignatura = ASIGNATURAS[profesor.profile.asignaturas[0]];
			profesor.avatar = "/img/profesores/profe1.jpg";
			return profesor;
		});
	},
	profesor() {
		return Template.instance().profesorSeleccionado.get();
	}
})

Template.modalconsultarprofesor.events({
	"click .opcion"(e, template) {
		const id = e.currentTarget.id;
		var profesor = Meteor.users.findOne({ _id: id });
		profesor.asignatura = ASIGNATURAS[profesor.profile.asignaturas[0]];
		profesor.avatar = "/img/profesores/profe1.jpg";
		template.profesorSeleccionado.set(profesor);			
		UIUtils.toggleVisible('seleccion', 'mensaje');
	},
	"click .btn-enviar-consulta"(e, template) {
		template.profesorSeleccionado.set(false);
		UIUtils.toggleVisible('seleccion', 'asignaturas');
		document.querySelector("#modalconsultarprofesor")
      .classList.remove("activo");
	}
});