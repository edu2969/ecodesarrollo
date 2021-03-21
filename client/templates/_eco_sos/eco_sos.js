Template.eco_sos.helpers({
	eco_sos() {
		return [{
			tipo: "PR",
			afectado: "JO",
			problema: "SC",
			direccion: "Las fresias 988",
			comuna: "Las Chilcas",
			imagenes: [
				"/img/sos/ayuda01.png",
				"/img/sos/ayuda02.png",
				"/img/sos/ayuda03.png"
			]
		}, {
			tipo: "TE",
			afectado: "AM",
			problema: "EN",
			direccion: "Los huaitacos",
			comuna: "Chuchundo",
			imagenes: [
				"/img/sos/ayuda01.png",
				"/img/sos/ayuda02.png",
				"/img/sos/ayuda03.png"
			]
		}, {
			tipo: "PR",
			afectado: "LA",
			problema: "DE",
			direccion: "Los tocojos",
			comuna: "Flaitrufiolan",
			imagenes: [
				"/img/sos/ayuda01.png",
				"/img/sos/ayuda02.png",
				"/img/sos/ayuda03.png"
			]
		}, {
			tipo: "TE",
			afectado: "NI",
			problema: "EN",
			direccion: "Las tertulias",
			comuna: "Farellones",
			imagenes: [
				"/img/sos/ayuda01.png",
				"/img/sos/ayuda02.png",
				"/img/sos/ayuda03.png"
			]
		}]
	}
})

Template.eco_sos.events({
	"click .marco-ayuda"(e) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	}
})
