Template.eco_organizaciones.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_organizaciones');
	});
}

Template.eco_organizaciones.helpers({
	eco_organizaciones() {
		return ECOOrganizaciones.find();
	}
});

Template.eco_organizaciones.events({
	"click .marco-organizacion"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	}
});