Template.menu.helpers({
	esProfesor() {
		return Meteor.user() && Meteor.user().profile.rol == 3;
	},
	esAlumno() {
		return Meteor.user() && Meteor.user().profile.rol == 2;
	},
	esAdmin() {
		return Meteor.user() && Meteor.user().profile.rol == 1;
	},
	asignaturas() {
		var keys = Object.keys(ASIGNATURAS);
		return keys.map(function(key) {
			return ASIGNATURAS[key];
		});
	},
	evaluaciones() {
		var keys = Object.keys(EVALUACIONES);
		return keys.map(function(key) {
			return EVALUACIONES[key];
		});
	}
})

Template.menu.events({
  "click #link-logout"() {
    Session.set("EstadoApp", false);
  }
});