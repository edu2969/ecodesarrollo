Template.eco_organizaciones.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_organizaciones');
	});
}

Template.eco_organizaciones.helpers({
	eco_organizaciones() {
		return ECOOrganizaciones.find();
	},
	cantidad() {
		return ECOOrganizaciones.find().count();
	},
	
});

Template.eco_organizaciones.events({
	"click .marco-organizacion"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"() {
		Session.set("ECOOrganizacionSeleccionada", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"() {
		const doc = FormUtils.getFields();
		const ecoorganizacion = Session.get("ECOOrganizacionSeleccionada");
		if(ecoorganizacion._id) {
			doc._id = ecoorganizacion._id;
		}
		Meteor.call("ActualizarECOOrganizacion", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	}
});