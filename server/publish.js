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

Meteor.publishComposite('eco_desarrollos', function() {
	return {
		find() {
			return ECODesarrollos.find();
		},
		children: [{
			find(ecoDesarrollo) {
				return Images.find({
					$or: [{
						"meta.ecoDesarrolloId": ecoDesarrollo._id,
						"meta.tipo": "ecodesarrollo"
					}, {
						"meta.pendiente": true,
						"meta.tipo": "ecodesarrollo"
					}]
				}).cursor;
			}
		}]
	}
});

