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

const MATERIALES = {
	"PET1": {
		unidad: "Tons",
		etiqueta: "Plástico PET1",
	},
	"ORG": {
		unidad: "Tons",
		etiqueta: "Residuo orgánico",
	},
	"LAT": {
		unidad: "Tons",
		etiqueta: "Latas",
	},
	"CAR": {
		unidad: "Tons",
		etiqueta: "Cartón",
	},
	"VID": {
		unidad: "Tons",
		etiqueta: "Vidrios",
	},
	"Pead2": {
		unidad: "Tons",
		etiqueta: "Pead2",
	},
	"Tetra": {
		unidad: "Tons",
		etiqueta: "Tetra Pack",
	}
};

const INTERESES = [
	"ecología", "cultura", "arte",
	"pintura", "reciclaje", "agricultura",
	"innovación"]

module.exports = {
	ECO_SOS,
	ECO_CAMPANAS,
	ECO_ACCIONES,
	INTERESES,
	PERIODICIDAD_ACCIONES,
	MATERIALES
}



