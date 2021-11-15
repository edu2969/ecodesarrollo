const ECO_SOS = {
	TIPOS: {
		"PR": "Propia",
		"TE": "Tercero"
	},
	AFECTADO: {
		"LA": "Lactante",
		"NI": "Niño",
		"JO": "Jóven",
		"AD": "Adulto",
		"AM": "Adulto Mayor"
	},
}
const ECO_CAMPANAS = {
	TIPOS: {
		"ECO": "Ecológica",
		"SOC": "Social",
		"MIX": "Mixta"
	}
}
const ECO_ACCIONES = {
	TIPOS: {
		"RM": "Retiro de Materiales",
		"DO": "Donación",
	}
}
const PERIODICIDAD_ACCIONES = {
	TIPOS: {
		"S": "Semanal",
		"Q": "Quincenal",
		"M": "Mensual"
	}
}

const LISTADO_MATERIALES = [{
	id: "PET1",
	etiqueta: "Plástico PET1",
}, {
	id: "ORG",
	etiqueta: "Residuo orgánico",
}, {
	id: "LAT",
	etiqueta: "Latas",
}, {
	id: "CAR",
	etiqueta: "Cartón",
}, {
	id: "VID",
	etiqueta: "Vidrios",
}]

const INTERESES = ["ecología", "cultura", "arte", "pintura", "reciclaje", "agricultura", "innovación"]

module.exports = { ECO_SOS, ECO_CAMPANAS, ECO_ACCIONES, INTERESES, PERIODICIDAD_ACCIONES, LISTADO_MATERIALES }



