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

Meteor.publishComposite('eco_campanas', function() {
	return{
		find(){
			return ECOCampanas.find();
	},
	children: [{
			find(ecoCampana) {
				return Images.find({
					$or: [{
						"meta.ecoCampanaId": ecoCampana._id,
						"meta.tipo": "ecocampana"
					}, {
						"meta.pendiente": true,
						"meta.tipo": "ecocampana"
					}]
				}).cursor;
			}
		}]
	}
});

Meteor.publishComposite('eco_sos', function() {
	return{
		find(){
				return ECOSos.find();
},
	children: [{
			find(ecoSos) {
				return Images.find({
					$or: [{
						"meta.ecoSosId": ecoSos._id,
						"meta.tipo": "ecosos"
					}, {
						"meta.pendiente": true,
						"meta.tipo": "ecosos"
					}]
				}).cursor;
			}
		}]
	}
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

