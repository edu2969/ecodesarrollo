Meteor.publish('eco_organizaciones', function() {
	return ECOOrganizaciones.find();
});

Meteor.publish('eco_organizaciones.imagenes', function() {
	return Images.find({
		"meta.tipo": "ecoorganizacion"
	}).cursor;
});

Meteor.publish('eco_campanas', function() {
	return ECOCampanas.find();
});

Meteor.publish('eco_campanas.imagenes', function() {
	return Images.find({
		"meta.tipo": "ecocampana"
	}).cursor;
});

Meteor.publish('eco_sos', function() {
	return ECOSos.find();
});

Meteor.publish('eco_sos.imagenes', function() {
	return Images.find({
		"meta.tipo": "ecosos"
	}).cursor;
});

Meteor.publish('eco_desarrollos', function() {
	return ECODesarrollos.find();
});

Meteor.publish('eco_desarrollos.imagenes', function() {
	return Images.find({
		"meta.tipo": "ecodesarrollo"
	}).cursor;
});
Meteor.publish('eco_desarrollos.documentos', function() {
	return Documents.find({
		"meta.tipo": "ecodesarrollo"
	}).cursor;
});