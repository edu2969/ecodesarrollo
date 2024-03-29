
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

const {
	UIUtils
} = require('../../utils/utils')
const { Nivel } = require("../../utils/nivel")

const validarFormulario = (paso, template) => {
	const errores = {};
	var formulario = template.formulario.get();
	$(".formulario[paso='" + paso + "'] .entrada").removeClass("is-invalid");
	$(".formulario[paso='" + paso + "'] .entrada").each((index, item) => {
		const input = item.children[1] && item.children[1].id.indexOf("input") != -1 ? item.children[1] :
			(item.children[2] && item.children[2].id && item.children[2].id.indexOf("input") != -1 ?
				item.children[2] : item);
		const id = input.id.split("-")[1];
		if (id) {
			const requerido = Boolean(input.attributes["required"] && input.attributes["required"].value);
			const type = input && input.attributes["type"].value;
			var valor = "";
			if (type == "text" || type == "password" || type == "email" || type == "numero") {
				valor = input && $("#input-" + id).val().trim();
				if (id === "reemail") {
					if ($("#input-email").val() != $("#input-reemail").val()) {
						errores[id] = {
							mensaje: "*ambos deben coincidir"
						}
						item.classList.add("is-invalid");
					}
				}
				if (id === "password") {
					if ($("#input-password").val() != $("#input-repassword").val()) {
						errores[id] = {
							mensaje: "*ambos deben coincidir"
						}
						item.classList.add("is-invalid")
					}
				}
			}
			if (requerido && valor == "" && (type != "password" || (type == "password" && !Meteor.userId()))) {
				errores[id] = {
					mensaje: "*requerido"
				}
				item.classList.add("is-invalid");
			} else if (valor != "") {
				if (!formulario) {
					formulario = {};
				}
				formulario[id] = {
					valor: valor,
					tipo: type
				};
			}
		}
	});
	const hayErrores = Object.keys(errores).length;
	if (hayErrores) {
		template.errores.set(errores);
	}
	template.formulario.set(formulario)
	return !hayErrores;
}

Template.registrame.onCreated(function () {
	this.errores = new ReactiveVar(false);
	this.formulario = new ReactiveVar(false)
	this.passwordStrength = new ReactiveVar(0)
});

Template.registrame.onCreated(function () {
	Nivel.setNivelUsuario();
})

Template.registrame.helpers({
	errores() {
		return Template.instance().errores.get();
	},
	usuario() {
		const usuario = Meteor.user();
		if (usuario) {
			return {
				nombre: usuario.profile.nombre,
				pseudonimo: usuario.username,
				direccion: usuario.profile.direccion,
				email: usuario.emails[0].address
			}
		} else {
			const template = Template.instance();
			const formulario = template.formulario.get();
			return {
				nombre: formulario.nombre && formulario.nombre.value,
				pseudonimo: formulario.pseudonimo && formulario.pseudonimo.value,
				direccion: formulario.direccion && formulario.direccion.value,
				email: formulario.email && formulario.email.value
			}
		}
	},
	nivel() {
		return Nivel.get();
	},
	paso() {
		const nivel = Nivel.get();
		if (!nivel || !nivel.nivel1) return false;
		const pasos = Object.keys(nivel.nivel1.pasos);
		const indice = pasos.findIndex(paso => {
			return nivel.nivel1.pasos[paso].actual;
		});
		console.log("paso" + (indice + 1))
		return "paso" + (indice + 1);
	},
	enLogin() {
		return Meteor.userId();
	},
	passwordStrength() {
		const valor = Template.instance().passwordStrength.get()
		let arreglo = Array(6).fill(0)
		return {
			arreglo: arreglo.fill(1, 0, valor),
			glosa: valor < 3 ? "débil" : valor < 5 ? "medio" : valor < 5 ? "fuerte" : "muy fuerte",
			porcentaje: valor < 3 ? 20 : valor < 5 ? 50 : valor < 5 ? 75 : 100,
		}
	}
})

Template.registrame.events({
	"click .navegador .boton"(e: any, template: Blaze.templating) {
		const nivel = Nivel.get();
		const pasos = Object.keys(nivel.nivel1.pasos);
		const paso = pasos.findIndex(paso => {
			return nivel.nivel1.pasos[paso].actual;
		}) + 1;
		var clase = e.currentTarget.classList.value;
		if (clase.indexOf("derecha") != -1 && !validarFormulario(paso, template)) {
			return;
		}
		if (clase.indexOf("izquierda") != -1 && paso > 1) {
			if (paso == 2) {
				UIUtils.toggle("izquierda", "deshabilitado");
			}
			if (paso == 4) {
				UIUtils.toggle("derecha", "deshabilitado");
			}
			UIUtils.toggle("carrousel", "paso" + paso);
			delete nivel.nivel1.pasos["paso" + paso].actual;
			nivel.nivel1.pasos["paso" + (paso - 1)].actual = true;
			Nivel.set(nivel);
		} else if (clase.indexOf("derecha") != -1 && paso <= 4) {
			if (paso == 1) {
				UIUtils.toggle("izquierda", "deshabilitado");
			}
			if (paso == 4) {
				const formulario = template.formulario.get();
				UIUtils.toggle("derecha", "deshabilitado");
				const account = {
					email: formulario.email.valor,
					nombre: formulario.nombre.valor,
					direccion: formulario.direccion.valor,
					password: formulario.password.valor
				}
				if (formulario.pseudonimo) {
					account.pseudonimo = formulario.pseudonimo.valor;
				}
				Meteor.call('Usuarios.RegistrarCuenta', account, function (err, resp) {
					if (!err) {
						Meteor.loginWithPassword({
							email: formulario.email.valor
						}, formulario.password.valor, function (err2, resp2) {
							Session.set("ModalParams", {
								esInfo: true,
								titulo: "Creacion de cuenta",
								texto: "Tu cuenta de e-mail <b>" + formulario.email.valor + "</b> fue creada con exito"
							});
							$(".seccion-identificate").addClass("oculto")
							Nivel.setNivelUsuario()
							$(".wizzard").toggleClass("oculto");
							$(".tipo-identificacion").removeClass("oculto");
							$("#modalgeneral").modal("show");
						});
					} else {
						template.errores.creacionCuenta = {
							mensaje: "No se pudo crear la cuenta (" + err.reason + ")"
						}
					}
				});
			} else {
				UIUtils.toggle("carrousel", "paso" + paso);
				delete nivel.nivel1.pasos["paso" + paso].actual;
				nivel.nivel1.pasos["paso" + paso].completado = true;
				nivel.nivel1.pasos["paso" + (paso + 1)].actual = true;
				Nivel.set(nivel);
			}
		}
	},
	"keyup #input-password"(e: any, template: Blaze.TemplateInstance) {
		var strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
		var mediumRegex = new RegExp("^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
		var enoughRegex = new RegExp("(?=.{8,}).*", "g");
		const password = $("#input-password").val()
		let valor = 0
		if (password.length > 0) {
			valor = 2
		}
		if (enoughRegex.test(password)) {
			valor = 4
		}
		if (mediumRegex.test(password)) {
			valor = 5
		}
		if (strongRegex.test(password)) {
			valor = 6
		}
		template.passwordStrength.set(valor)
	},
	"click .btn-share-location"(e) {
		$(".circle").show();
		Tracker.autorun((computation)=>{
			const location = Geolocation.currentLocation();
			if(location!=null) {
				console.log(location);
				$(".btn-share-location").removeClass("disabled");
				$(".share-location").text("Localización OK");
				$(".circle").hide();
				computation.stop();
			}
		})
	}
})

