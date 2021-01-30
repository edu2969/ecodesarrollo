Meteor.publish('cuentas', function() {
	return Meteor.users.find();
});

Meteor.publish('desafios', function() {
	return Tareas.find();
});

Meteor.publish('profesores', function() {
	return Meteor.users.find({ "profile.rol": 3 });
});

Meteor.publish('entregas', function() {
	const alumnoId = this.userId;
	return Entregas.find({ alumnoId: alumnoId });
});

Meteor.publish('alumnos', function() {
	if(Meteor.user().profile.rol!=3) {
		return false;
	}
	const profesorId = Meteor.userId();
	// @TODO se trae solo el curso
	return Meteor.users.find({ "profile.rol": 2 });
});

Meteor.publish('curso', function(nivel) {
	return Meteor.users.find({ "profile.curso": nivel });
});

Meteor.publish('tareas', function(nivel) {
	var alumnosId = Meteor.users.find({ "profile.nivel": nivel });
	return Entregas.find({ alumnoId: { $in: alumnosId }});
});

Meteor.publish('misentregas', function(alumnoId, tareaId) {
	return Images.find({ userId: alumnoId, "meta.tareaId": tareaId }).cursor;
});

Meteor.publish('capsula', function(tareaId) {
	return Capsulas.find({ "meta.tareaId": tareaId }).cursor;
});

Meteor.publish('entregasPorNivel', function(nivel) {
	let alumnosId = Meteor.users.find({ "profile.curso": nivel }).map(function(alumno) {
		return alumno._id;
	});
	return Entregas.find({ alumnoId: { $in: alumnosId }});
})