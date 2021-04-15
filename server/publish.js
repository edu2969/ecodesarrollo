Meteor.publishComposite('eco_organizaciones', function() {
	return {
		find() {
			return ECOOrganizaciones.find();
		},
		children: [{
			find(ecoOrganizacion) {
				return Images.find({
					$or: [{
						"meta.ecoOrganizacionId": ecoOrganizacion._id
					}, {
						"meta.pendiente": true
					}]
				}).cursor;
			}
		}]
	}
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

