Meteor.publish('eco_organizaciones', function() {
	return ECOOrganizaciones.find();
});
