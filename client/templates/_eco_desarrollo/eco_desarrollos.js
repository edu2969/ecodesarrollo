Template.eco_desarrollos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_desarrollos');
	});
}

Template.eco_desarrollos.helpers({
	eco_desarrollos(){
		
		return ECODesarrollos.find();
		
	},
	cantidad() {

		return ECODesarrollos.find().count();

	},
	eco_desarrollo() {
		return Session.get("ECODesarrolloSeleccionado");
	}
})

Template.eco_desarrollos.events({
	"click .marco-desarrollo"(e) {
		const id = e.currentTarget.id;
		const entidad = ECODesarrollos.findOne({ _id: id });
		//debugger;
		Session.set("ECODesarrolloSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"() {
		Session.set("ECODesarrolloSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"() {
		//debugger;
		const doc = FormUtils.getFields();
		const ecodesarrollo = Session.get("ECODesarrolloSeleccionado");
		if(ecodesarrollo._id) {
			doc._id = ecodesarrollo._id;
		}
		Meteor.call("ActualizarECODesarrollo", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
			}
		})
	}
})
