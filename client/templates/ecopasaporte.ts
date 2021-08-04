import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Nivel } from '../utils/nivel'
import { ECOActividades } from '../../lib/ECOActividades'
import { UIUtils } from '../utils/utils';

const menuPrincipal = () => {
	UIUtils.toggle("cruz-principal", "oculto");
	$(".tombola").removeClass("flotalatombola2x");
	$(".tombola").removeClass("flotalatombola5x");
	$(".tombola").addClass("flotalatombola2x");
	UIUtils.toggle("tombola", "desaparece");
	setTimeout(function () {
		ECOActividades.set([{
			espacio: true
		}, {
			espacio: true
		}, {
			nombre: "identificate",
			icono: "fingerprint",
			activo: true,
			accion: "Soy <b>&hearts;</b> verde"
		}, {
			nombre: "sabermas",
			icono: "contact_support",
			accion: "Quiero saber"
		}]);
		UIUtils.toggle("tombola", "reaparece");
		UIUtils.toggle("tombola", "desaparece");
		setTimeout(function () {
			UIUtils.toggle("tombola", "reaparece");
		}, 500);
	}, 500);
}

const menuECODimensiones = () => {
	UIUtils.toggle("tombola", "desaparece");
	UIUtils.toggle("tombola", "flotalatombola2x");
	setTimeout(function () {
		UIUtils.toggle("tombola", "flotalatombola5x");
		ECOActividades.set([{
			nombre: "eco_organizaciones",
			icono: "share",
			activo: true,
			accion: "ECO Organizaciones"
		}, {
			nombre: "eco_campanas",
			icono: "campaign",
			accion: "ECO Campañas"
		}, {
			nombre: "eco_desarrollos",
			icono: "architecture",
			accion: "ECO Desarrollos"
		}, {
			nombre: "eco_sos",
			icono: "support",
			accion: "ECO S.O.S."
		}]);
		UIUtils.toggle("tombola", "reaparece");
		UIUtils.toggle("tombola", "desaparece");
		UIUtils.toggle("cruz-principal", "oculto");
		setTimeout(function () {
			UIUtils.toggle("tombola", "reaparece");
		}, 500);
	}, 500);
}

Template.ecopasaporte.onCreated(function () {
	ECOActividades.init();
	this.panel = new ReactiveVar(false);
	this.desecho = new ReactiveVar(false)
});

const setDesecho = (template) => {
	const numero = Math.floor(Math.random() * 12) + 1
	template.desecho.set("desecho_" + (numero < 10 ? "0" : "") + numero)
	$(".desecho img").addClass("rotando")
	$(".desecho").addClass("lanzamiento")
	$(".desecho").removeClass("golpe")
	$(".expresion img").attr("src", "/img/corazon/corazon_verde_cara_02.png")
}

const setGolpe = (template) => {
	template.desecho.set("golpe")
	$(".desecho img").removeClass("rotando")
	$(".desecho").removeClass("lanzamiento")
	$(".desecho").addClass("golpe")
	const cara = Math.floor(Math.random() * 3)
	$(".expresion img").attr("src", "/img/corazon/corazon_verde_cara_1" + cara + ".png")
}

Template.ecopasaporte.rendered = function () {
	setInterval(function () {
		setTimeout(function () {
			UIUtils.toggle("cuerpo", "latido");
		}, 500);

		setTimeout(function () {
			UIUtils.toggle("cuerpo", "latido");
		}, 650);

		setTimeout(function () {
			UIUtils.toggle("cuerpo", "latido");
		}, 800);

		setTimeout(function () {
			UIUtils.toggle("cuerpo", "latido");
		}, 950);

	}, 1500);

	const template = Template.instance()
	setInterval(function () {
		setDesecho(template)
		setTimeout(() => {
			setGolpe(template)
		}, 2500)
	}, 2750)
}

Template.ecopasaporte.helpers({
	ecoactividades() {
		return ECOActividades.get();
	},
	panel() {
		return Template.instance().panel.get();
	},
	corazonVerde() {
		const usuario = Meteor.user();
		var arregloVacio = new Array(10).fill("vacio");
		if (!usuario) return {
			cara: 1,
			nivel: 0,
			puntaje: arregloVacio
		}
		var corazonVerde = usuario.profile.corazonVerde;
		if (!corazonVerde) {
			const nivel = Nivel.get();
			const puntos = Math.floor(((nivel.nivel1.porcentaje || 0) * 30 +
				(nivel.nivel2.porcentaje || 0) * 40 +
				(nivel.nivel3.porcentaje || 0) * 30) / 1000)
			corazonVerde = {
				nivel: 0,
				puntos: puntos
			}
		}
		corazonVerde.cara = corazonVerde.nivel + 1;
		corazonVerde.puntaje = arregloVacio;
		if (corazonVerde.puntos) {
			for (var i = 0; i < corazonVerde.puntos; i++) {
				corazonVerde.puntaje[9 - i] = "lleno";
			}
		}
		return corazonVerde;
	},
	desecho() {
		return Template.instance().desecho.get()
	},
	enLogin() {
		return Meteor.userId()
	}
})

Template.ecopasaporte.events({
	"click .actividad"(e, template) {
		let actividad = e.currentTarget.classList.value;
		if (actividad.indexOf("sabermas") != -1) {
			menuECODimensiones()
		} else if (actividad.indexOf("identificate") != -1) {
			if (Meteor.userId()) {
				menuECODimensiones()
			} else {
				template.panel.set({
					clase: "identificate",
					color: "verde",
					esIdentificate: true
				});
				UIUtils.toggle("eco-panel", "activo");
				setTimeout(function () {
					if (Meteor.userId()) {
						$(".tipo-identificacion").removeClass("oculto");
						$(".contendor-identificate").addClass("oculto");
					} else {
						$(".contendor-identificate").removeClass("oculto");
						$(".tipo-identificacion").addClass("oculto");
					}
				}, 300);
			}
		} else if (actividad.indexOf("eco_organizaciones") != -1) {
			template.panel.set({
				clase: "eco_organizaciones",
				esECOOrganizaciones: true,
				color: "purpura"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if (actividad.indexOf("eco_campanas") != -1) {
			template.panel.set({
				clase: "eco_campanas",
				esECOCampanas: true,
				color: "azul"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if (actividad.indexOf("eco_desarrollos") != -1) {
			template.panel.set({
				clase: "eco_desarrollos",
				esECODesarrollos: true,
				color: "verde"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if (actividad.indexOf("eco_sos") != -1) {
			template.panel.set({
				clase: "eco_sos",
				esECOSOS: true,
				color: "amarillo"
			});
			UIUtils.toggle("eco-panel", "activo");
		}
	},
	"click .cruz-panel"(e, template) {
		UIUtils.toggle("eco-panel", "activo");
		setTimeout(function () {
			$(".contendor-identificate").removeClass("oculto");
			$(".tipo-identificacion").removeClass("oculto");
			template.panel.set(false);
		}, 500);
	},
	"click .cruz-principal"() {
		menuPrincipal();
	},
	"click .menu-preferencias"() {
		$(".panel-preferencias").toggleClass("activo");
	},
	"click .opcion-perfil"(e: any, template) {
		template.panel.set({
			clase: "perfil",
			color: "rojo",
			esPerfil: true
		});
		UIUtils.toggle("eco-panel", "activo");
		$(".panel-preferencias").toggleClass("activo");
	},
	"click .opcion-logout"(e) {
		$(".menu-preferencias").addClass("oculto");
		$(".panel-preferencias").toggleClass("activo");
		Meteor.logout();
		menuPrincipal();
	},
	"click .opcion-notificaciones"(e: any, template) {
		template.panel.set({
			clase: "notificaciones",
			color: "rojo",
			esNotificaciones: true
		});
		UIUtils.toggle("eco-panel", "activo");
		$(".panel-preferencias").toggleClass("activo");
	},
	"click .opcion-info"(e, template) {
		template.panel.set({
			clase: "mundo-corazones",
			color: "rojo",
			esMundoCorazones: true
		});
		UIUtils.toggle("eco-panel", "activo");
		$(".panel-preferencias").toggleClass("activo");
	},
});
