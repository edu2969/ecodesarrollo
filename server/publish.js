Meteor.publish('eco_organizaciones', function() {
	return ECOOrganizaciones.find();
});

Meteor.publish('eco_campanas', function() {
	return ECOCampanas.find();
});

