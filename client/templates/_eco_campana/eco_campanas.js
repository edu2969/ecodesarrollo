const { ECO_CAMPANAS } = require('../../../lib/constantes');

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
	},
	tipos() {

		const keys = Object.keys(ECO_CAMPANAS.TIPOS);

		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_CAMPANAS.TIPOS[key]
			}
		});
	},
	eco_campana() {
		return Session.get("ECOCampanaSeleccionado");
	}
})

Template.eco_campanas.events({
	"click .marco-campana"(e) {
		const id = e.currentTarget.id;
		const entidad = ECOCampanas.findOne({ _id: id });
		Session.set("ECOCampanaSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"() {
		Session.set("ECOCampanaSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"() {
		const doc = FormUtils.getFields();
		const ecocampana = Session.get("ECOCampanaSeleccionado");
		if(ecocampana._id) {
			doc._id = ecocampana._id;
		}
		Meteor.call("ActualizarECOCampana", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	}
})
