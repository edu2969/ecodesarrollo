const { ECO_SOS } = require("../../lib/constantes");
const { ECO_CAMPANAS } = require("../../lib/constantes");

Handlebars.registerHelper("formatoFecha", function (date, mask = 'dd/MM/yyyy') {
	if (!date) return '--/--';
	var m = moment(date);
	if (!m) return '--/--';
	return m.format(mask);
});

Handlebars.registerHelper("selectValor", (valor1, valor2) => {
	return valor1 == valor2 ? 'selected' : '';
});

Handlebars.registerHelper("version", () => {
	return VERSION;
});

Handlebars.registerHelper("traductorSOSTipos", (codigo) => {
	return ECO_SOS.TIPOS[codigo];
});

Handlebars.registerHelper("traductorSOSAfectados", (codigo) => {
	return ECO_SOS.AFECTADO[codigo];
});

Handlebars.registerHelper("traductorCAMPANASTipos", (codigo) => {
	return ECO_CAMPANAS.TIPOS[codigo];
});

Handlebars.registerHelper('sonIguales', function (val1, val2) {
	return val1 === val2
});

Handlebars.registerHelper('or', function (val1, val2) {
	return val1 || val2;
});

