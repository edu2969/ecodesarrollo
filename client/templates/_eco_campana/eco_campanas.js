Template.eco_campanas.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_campanas');
	});
}

Template.eco_campanas.helpers({
	eco_campanas() {
		return ECOCampanas.find();
	},
	cantidad() {
		return ECOCampanas.find().count();
	}
})

Template.eco_campanas.events({
	"click .marco-campana"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"() {
		Session.set("ECOCampanaSeleccionada", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"() {
		const doc = FormUtils.getFields();
		Meteor.call("CrearECOCampana", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	}
})
