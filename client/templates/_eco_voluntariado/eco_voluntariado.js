Template.eco_voluntariado.helpers({
	eco_voluntarios() {
		return [{
			titulo: "ECOTeam",
			tipo: "Laboral",
			subtipo: "Maestros",
			avatar: "/img/avatares/team01.png",
			integrantes: 9,
			ultimaActividad: new Date(),
			puntos: 89,
			donaciones: 8.7,
			participaciones: 44
		}, {
			titulo: "Familia Madonlin",
			tipo: "Familiar",
			subtipo: "Sanguineos 2 generaciones",
			avatar: "/img/avatares/team02.png",
			integrantes: 4,
			ultimaActividad: new Date(),
			donaciones: 2,
		}, {
			titulo: "Colegio Andalién",
			tipo: "Colegio",
			subtipo: "Colegio",
			avatar: "/img/avatares/team03.png",
			integrantes: 120,
			ultimaActividad: new Date(),
			donaciones: 1.1,
		}, {
			titulo: "Jóvenes Cristianos",
			tipo: "Iglesia",
			subtipo: "Evangélica",
			avatar: "/img/avatares/team04.png",
			integrantes: 24,
			ultimaActividad: new Date(),
			donaciones: 0.2,
		}]
	}
});

Template.eco_voluntariado.events({
	"click .marco-voluntario"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	}
})