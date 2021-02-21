Template.eco_campanas.helpers({
	eco_campanas() {
		return [{
			titulo: "Paraíso Penco limpio",
			tipo: "ECO",
			esECO: true,
			ultimaActividad: new Date(),
			donaciones: 4.3,
			impacto: 73,
			imagen: '/img/campanas/campana01.jpg'
		}, {
			titulo: "Ollazo Cerro Alegre",
			tipo: "SOC",
			esSOC: true,
			ultimaActividad: new Date(),
			donaciones: 0.13,
			impacto: 7,
			imagen: '/img/campanas/campana02.jpg'
		}]
	}
})

Template.eco_campanas.events({
	"click .marco-campana"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	}
})
