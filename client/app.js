Session.setDefault("EstadoApp", {});

Template.body.helpers({
	enLogin() {
		return Session.get("EstadoApp").enLogin;
	},
})