const { ECO_SOS } = require('../../../lib/constantes');

Template.eco_sos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_sos');
	});
}

Template.eco_sos.helpers({
	eco_soss() {
		return ECOSos.find().map(ecosos => {
			ecosos.icono = ECO_SOS.PROBLEMA[ecosos.problema].icono;
			return ecosos;
		});
	},
	cantidad() {
		return ECOSos.find().count();
	},
	tipos() {
		const keys = Object.keys(ECO_SOS.TIPOS);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.TIPOS[key]
			}
		});
	},
	afectados() {
		const keys = Object.keys(ECO_SOS.AFECTADO);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.AFECTADO[key]
			}
		});
	},
	problemas() {
		const keys = Object.keys(ECO_SOS.PROBLEMA);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.PROBLEMA[key].etiqueta,
				icono: ECO_SOS.PROBLEMA[key].icono
			}
		});
	},
	eco_sos() {
		return Session.get("ECOSosSeleccionado");
	}
});

Template.eco_sos.events({
	"click .marco-sos"(e) {
		const id = e.currentTarget.id;
		const entidad = ECOSos.findOne({ _id: id });
		Session.set("ECOSosSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"() {
		Session.set("ECOSosSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"() {
		const doc = FormUtils.getFields();
		const ecosos = Session.get("ECOSosSeleccionado");
		if(ecosos._id) {
			doc._id = ecosos._id;
		}
		Meteor.call("ActualizarECOSos", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	},
})
