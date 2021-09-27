import { Meteor } from 'meteor/meteor'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { EstadoType } from '../../../lib/types/EstadoType'
const { Comunas } = require('../../../lib/collections/BaseCollections')
const { ECOSos } = require('../../../lib/collections/ECODimensionesCollections')
const { Images } = require('../../../lib/collections/FilesCollections')
const { ECO_SOS } = require('../../../lib/constantes')
const {
	UIUtils,
	FormUtils
} = require('../../utils/utils')

Template.eco_sos.onCreated(function () {
	this.currentUpload = new ReactiveVar();
	this.ecoSosSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true);
	this.errores = ReactiveVar(false);
	this.indiceImagen = ReactiveVar(0);
});

Template.eco_sos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_sos');
		Meteor.subscribe('eco_sos.imagenes');
	});
	Meteor.subscribe('lugares.comunas')
}

Template.eco_sos.helpers({

	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	cantidad() {
		return ECOSos.find().count();
	},
	eco_soss() {
		return ECOSos.find().map(ecosos => {
			const img = Images.findOne({
				$or: [{
					"meta.ecoSosId": ecosos._id,
					"meta.tipo": "ecosos",

				}, {
					"meta.pendiente": true,
					"meta.tipo": "ecosos"
				}]
			});
			ecosos.avatar = img ? img.link() : '/img/no_image_available.jpg';
			ecosos.integrantes = 0;
			ecosos.donaciones = 0;
			if (ecosos.estado === EstadoType.Pendiente) {
				ecosos.estaPendiente = true
			}
			return ecosos;
		});
	},
	ecoSos() {
		const template = Template.instance();
		let ecoSos = template.ecoSosSeleccionada.get();
		if (!ecoSos) return;
		const userId = Meteor.userId();
		if (userId == ecoSos.usuarioId) {
			ecoSos.esPropia = true;
		}
		const img = Images.findOne({
			$or: [{
				"meta.ecoSosId": ecoSos._id
			}, {
				"meta.pendiente": true
			}]
		});
		ecoSos.avatar = img ? img.link() : '/img/no_image_available.jpg';
		ecoSos.ultimaActividad = ecoSos.ultimaActualizacion;
		ecoSos.integrantes = 0;
		ecoSos.donaciones = 0;
		return ecoSos;
	},
	tipos() {
		const keys = Object.keys(ECO_SOS.TIPOS);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.TIPOS[key]
			}
		});
	},
	afectados() {
		const keys = Object.keys(ECO_SOS.AFECTADO);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.AFECTADO[key]
			}
		});
	},
	problemas() {
		const keys = Object.keys(ECO_SOS.PROBLEMA);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.PROBLEMA[key].etiqueta,
				icono: ECO_SOS.PROBLEMA[key].icono
			}
		});
	},
	eco_sos() {
		return Session.get("ECOSosSeleccionado");
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	imagenes() {
		const template = Template.instance();
		const ecoSos = template.ecoSosSeleccionada.get();
		let selector = {};
		if (ecoSos._id) {

			selector = {
				"meta.ecoSosId": ecoSos._id,
				"meta.tipo": "ecosos"
			}
		} else {
			selector = {
				"meta.pendiente": true,
				"meta.tipo": "ecosos"
			}
		}
		return Images.find(selector).map(img => {
			const imagen = Images.findOne({ _id: img._id });
			return {
				_id: img._id,
				link: imagen.name,
				imagen: imagen.link()
			}
		});
	},
	settingsComunas() {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Comunas,
					field: "nombre",
					matchAll: false,
					template: Template.itemComuna,
					noMatchTemplate: Template.noComuna,
				}
			]
		};
	},
	enLogin() {
		return Meteor.userId()
	},
	errores() {
		return Template.instance().errores.get()
	},
	carrousel() {
		const instance = Template.instance();
		const ecoSos = instance.ecoSosSeleccionada.get();
		const counter = Images.find({
			"meta.ecoSosId": ecoSos._id,
			"meta.tipo": "ecosos"
		}).count();
		const indiceImagen = instance.indiceImagen.get();
		return {
			total: ( counter * 100 ) + '%',
			ancho: ( 100 / counter ) + '%',
			left: ( indiceImagen * -100 ) + '%'
		}
	},
});

Template.eco_sos.events({
	"click .marco-entidad"(e, template) {
		const id = e.currentTarget.id;
		const entidad = ECOSos.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoSosSeleccionada.set(entidad);
		//Session.set("ECOSosSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e, template) {
		template.ecoSosSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		Session.set("ECOSosSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e, template) {
		const invalido = FormUtils.invalid()
		const doc = FormUtils.getFields();
		const ecoSos = template.ecoSosSeleccionada.get();

		if (ecoSos._id) {
			doc._id = ecoSos._id;
		} else {
			doc.userId = Meteor.userId();
			doc.ultimaActualizacion = new Date();
		}
		if (ecoSos.comunaId) {
			doc.comunaId = ecoSos.comunaId
		}
		if (invalido) {
			template.errores.set(invalido)
			return false
		}
		Meteor.call("ECOSos.Actualizar", doc, function (err, resp) {
			if (!err) {
				UIUtils.toggle("carrousel", "modo-listado");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoSosSeleccionada.set(false);
				template.editando.set(false);
				template.enListado.set(true);
			} else {
				console.error(err)
			}
		})
	},
	"click #btn-editar, click #btn-cancelar"(e, template) {
		const editando = template.editando.get();
		template.editando.set(!editando);
	},
	"click .navegacion-atras"(e, template) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
		template.ecoSosSeleccionada.set(false);
		template.editando.set(false);
		template.enListado.set(true);
		$(".detalle").scrollTop(0);
	},
	"dragover .camara .marco-upload": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".camara .marco-drop").addClass("activo");
	},
	"dragleave .camara .marco-upload": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".camara .marco-drop").removeClass("activo");
	},
	"dragenter .camara .marco-upload": function (e, t) {
		e.preventDefault();
		e.stopPropagation();
	},
	"drop .camara .marco-upload": function (e, template) {
		e.stopPropagation();
		e.preventDefault();
		var ecoSos = template.ecoSosSeleccionada.get();
		if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			let meta = {}
			var img;
			if (!ecoSos._id) {
				meta = {
					pendiente: true,
					tipo: "ecosos",
				}
			} else {
				meta = {
					ecoSosId: ecoSos._id,
					tipo: "ecosos"
				};
			}
			const upload = Images.insert({
				file: e.originalEvent.dataTransfer.files[0],
				meta: meta
			}, false)

			upload.on('start', function () {
				template.currentUpload.set(this);
			});

			upload.on('end', function (error, fileObj) {
				if (error) {
					alert('Error during upload: ' + error);
				} else {
					//console.log("FileImage", fileObj);
				}
				template.currentUpload.set(false);
				template.$(".marco-drop").removeClass("activo");
			});
			upload.start();
		}
	},
	"click .camara .marco-upload"(e) {
		$("#upload-image").click();
	},
	"change #upload-image"(e, template) {
		var ecoSos = template.ecoSosSeleccionada.get();
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			var meta = {
				tipo: "ecosos"
			}
			if (!ecoSos._id) {
				meta.pendiente = true;
			} else {
				meta.ecoSosId = ecoSos._id;
			}
			const upload = Images.insert({
				file: e.currentTarget.files[0],
				meta: meta
			}, false);

			upload.on('start', function () {
				template.currentUpload.set(this);
			});

			upload.on('end', function (error, fileObj) {
				template.currentUpload.set(false);
				template.$(".camara .marco-drop").removeClass("activo");
			});

			upload.start();
		}
	},
	"click .eliminar"(e) {
		const id = e.currentTarget.id;
		Images.remove({ _id: id });
	},
	"autocompleteselect #input-comuna"(event, template, doc) {
		//console.log("selected ", doc);
		var ecoSos = template.ecoSosSeleccionada.get();
		ecoSos.comundaId = doc._id
		template.ecoSosSeleccionada.set(ecoSos)
	},
	"click .flecha-derecha, click .flecha-izquierda"(e, template) {
		const ecoSos = template.ecoSosSeleccionada.get();
		const counter = Images.find({
			"meta.ecoSosId": ecoSos._id,
			"meta.tipo": "ecosos"
		}).count();
		let indiceImagen = template.indiceImagen.get();
		const esIzq = e.currentTarget.classList.value.indexOf("izquierda") != -1;
		indiceImagen = indiceImagen + ( esIzq ? -1 : +1);
		if(indiceImagen == -1) {
			indiceImagen = counter - 1;
		}
		if(indiceImagen == counter) {
			indiceImagen = 0;
		}
		template.indiceImagen.set(indiceImagen);
	},
})
