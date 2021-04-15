Meteor.publish('eco_organizaciones', function() {
	return ECOOrganizaciones.find();
});

Meteor.publish('eco_campanas', function() {
	return ECOCampanas.find();
});
Meteor.publish('eco_sos', function() {
	return ECOSos.find();
});
Meteor.publish('eco_desarrollos', function() {
	return ECODesarrollos.find();
});

