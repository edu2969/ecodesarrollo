Template.eco_sos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_sos');
		Session.set('vpm','sesion de prueba');
		alert(Session.get('vpm'));
	});
}

Template.eco_sos.helpers({
	eco_sos() {
		return ECOSos.find();
	},
	cantidad() {
		return ECOSos.find().count();
	}
});

Template.eco_sos.events({
	"click .marco-ayuda"(e) {

		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"() {
		Session.set("ECOSosSeleccionada", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"() {
		const doc = FormUtils.getFields();
		Meteor.call("CrearECOSos", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	},
	"click #btn-modifciar"() {
		const doc = FormUtils.getFields();
		Meteor.call("ModificaECOSos", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	}
})
