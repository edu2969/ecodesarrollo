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
	PROBLEMA: {
		"DE": { icono: "sports_kabaddi", etiqueta: "Delincuencia" },
		"SC": { icono: "night_shelter", etiqueta: "Situación de calle" },
		"EN": { icono: "sick", etiqueta: "Enfermedad" },
		"OT": { icono: "support", etiqueta: "Otro" }
	}
}
const ECO_CAMPANAS = {
	TIPOS: {
		"ECO": "Ecológica",
		"SOC": "Social",
		"MIX": "Mixta"
	}
}

const INTERESES = ["ecología", "cultura", "arte", "pintura", "reciclaje", "agricultura", "innovación"]

module.exports = { ECO_SOS, ECO_CAMPANAS, INTERESES }



