import { Nivel } from '../utils/nivel'
import { ECOActividades } from '../../lib/ECOActividades' 

const menuPrincipal = (template) => {
	UIUtils.toggle("cruz-principal", "oculto");
	UIUtils.toggle("tombola", "flotalatombola5x");
	UIUtils.toggle("tombola", "flotalatombola2x");
	UIUtils.toggle("tombola", "desaparece");
	setTimeout(function() {
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
		setTimeout(function() {
			UIUtils.toggle("tombola", "reaparece");
		}, 500);
	}, 500);
}

Template.ecopasaporte.onCreated(function() {
	ECOActividades.init();
	this.panel = new ReactiveVar(false);
});

Template.ecopasaporte.rendered = function() {		
	setInterval(function() {
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 500);
		
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 650);
		
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 800);
		
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 950);
		
	}, 1500);

	if(Meteor.userId()) {
		$(".menu-preferencias").toggleClass("oculto");
	}
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
		if(!usuario) return {
			cara: 1,
			nivel: 0,
			puntaje: arregloVacio
		};
		var corazonVerde = usuario.profile.corazonVerde;
		corazonVerde.cara = corazonVerde.nivel + 1;
		corazonVerde.puntaje = arregloVacio;
		if(corazonVerde.puntos) {
			for(var i = 0; i < corazonVerde.puntos; i++) {
				corazonVerde.puntaje[9 - i] = "lleno";
			}
		}
		return corazonVerde;
	}
})

Template.ecopasaporte.events({
	"click .actividad"(e, template) {
		let actividad = e.currentTarget.classList.value;
		if(actividad.indexOf("sabermas")!=-1) {
			UIUtils.toggle("tombola", "desaparece");
			UIUtils.toggle("tombola", "flotalatombola2x");
			setTimeout(function() {
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
				setTimeout(function() {
					UIUtils.toggle("tombola", "reaparece");
				}, 500);
			}, 500);
		} else if(actividad.indexOf("identificate")!=-1) {
			template.panel.set({
				clase: "identificate",
				color: "verde",
				esIdentificate: true
			});
			UIUtils.toggle("eco-panel", "activo");
			setTimeout(function() {
				if(Meteor.userId()) {
					$(".tipo-identificacion").removeClass("oculto");
					$(".contendor-identificate").addClass("oculto");
				} else {
					$(".contendor-identificate").removeClass("oculto");
					$(".tipo-identificacion").addClass("oculto");
				}
			}, 300);
		} else if(actividad.indexOf("eco_organizaciones")!=-1) {
			template.panel.set({
				clase: "eco_organizaciones",
				esECOOrganizaciones: true,
				color: "purpura"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if(actividad.indexOf("eco_campanas")!=-1) {
			template.panel.set({
				clase: "eco_campanas",
				esECOCampanas: true,
				color: "azul"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if(actividad.indexOf("eco_desarrollos")!=-1) {
			template.panel.set({
				clase: "eco_desarrollos",
				esECODesarrollos: true,
				color: "verde"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if(actividad.indexOf("eco_sos")!=-1) {
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
		setTimeout(function() {
			$(".contendor-identificate").removeClass("oculto");
			$(".tipo-identificacion").removeClass("oculto");
			template.panel.set(false);	
		}, 1000);
	},
	"click .cruz-principal"(e, template) {
		menuPrincipal(template);
	},
	"click .menu-preferencias"(e, template) {
		$(".panel-preferencias").toggleClass("activo");
	},
	"click .opcion-logout"(e, template) {
		$(".menu-preferencias").toggleClass("oculto");
		$(".panel-preferencias").toggleClass("activo");
		Meteor.logout();
		menuPrincipal(template);
	}
});
