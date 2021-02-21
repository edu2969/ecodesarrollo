Template.eco_desarrollos.helpers({
	eco_desarrollos() {
		return [{
			titulo: "Cascos Nuez",
			direccion: "Las camelias 236",
			comuna: "Pañalolén",
			participantes: 73,
			imagen: '/img/desarrollos/voluntario01.jpg'
		}, {
			titulo: "Granel Bike",
			direccion: "Los Leones 299",
			comuna: "Providencia",
			participantes: 33,
			imagen: '/img/desarrollos/voluntario01.jpg'
		}, {
			titulo: "Compost a domicilio",
			direccion: "Balmaceda 102",
			comuna: "Talcahuano",
			participantes: 4,
			imagen: '/img/desarrollos/voluntario01.jpg'
		}]
	}
})

Template.eco_desarrollos.events({
	"click .marco-desarrollo"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	}
})
