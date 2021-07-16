import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
const { Comunas } = require('../../../lib/collections/BaseCollections')
const { ECODesarrollos } = require('../../../lib/collections/ECODimensionesCollections')
const {
	Images,
	Documents
} = require('../../../lib/collections/FilesCollections')
const {
	UIUtils,
	FormUtils
} = require('../../utils/utils')

Template.eco_desarrollos.onCreated(function () {
	this.currentUpload = new ReactiveVar();
	this.ecoDesarrolloSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true);
});

Template.eco_desarrollos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_desarrollos');
		Meteor.subscribe('eco_desarrollos.imagenes');
		Meteor.subscribe('eco_desarrollos.documentos');
	});
	Meteor.subscribe('lugares.comunas')
	Meteor.subscribe('usuarios.coordinadores')
}

Template.eco_desarrollos.helpers({
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	eco_desarrollos() {
		return ECODesarrollos.find().map(ecoDesarrollo => {
			ecoDesarrollo.ultimaActividad = ecoDesarrollo.ultimaActualizacion;
			const img = Images.findOne({
				$or: [{
					"meta.ecoDesarrolloId": ecoDesarrollo._id,
					"meta.tipo": "ecodesarrollo",

				}, {
					"meta.pendiente": true,
					"meta.tipo": "ecodesarrollo"
				}]
			});
			ecoDesarrollo.avatar = img ? img.link() : '/img/no_image_available.jpg';
			ecoDesarrollo.integrantes = 0;
			ecoDesarrollo.donaciones = 0;
			return ecoDesarrollo;
		});
	},
	ecoDesarrollo() {
		const template = Template.instance();
		let ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if (!ecoDesarrollo) return;
		const userId = Meteor.userId();
		if (userId == ecoDesarrollo.userId) {
			ecoDesarrollo.esPropia = true;
		}
		const img = Images.findOne({
			$or: [{
				"meta.ecoDesarrolloId": ecoDesarrollo._id
			}, {
				"meta.pendiente": true
			}]
		});
		ecoDesarrollo.avatar = img ? img.link() : '/img/no_image_available.jpg';
		ecoDesarrollo.ultimaActividad = ecoDesarrollo.ultimaActualizacion;
		ecoDesarrollo.integrantes = 10;
		ecoDesarrollo.donaciones = 0;
		return ecoDesarrollo;
	},
	cantidad() {
		return ECODesarrollos.find().count();
	},
	eco_desarrollo() {
		return Session.get("ECODesarrolloSeleccionado");
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	imagenes() {
		const template = Template.instance();
		const ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		let selector = {};
		if (ecoDesarrollo._id) {
			selector = {
				"meta.ecoDesarrolloId": ecoDesarrollo._id,
				"meta.tipo": "ecodesarrollo"
			}
		}
		else {
			selector = {
				"meta.pendiente": true,
				"meta.tipo": "ecodesarrollo"
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
	documentos() {
		const template = Template.instance();
		const ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		let selector = {};
		if (ecoDesarrollo._id) {
			selector = {
				"meta.ecoDesarrolloId": ecoDesarrollo._id,
				"meta.tipo": "ecodesarrollo"
			}
		}
		else {
			selector = {
				"meta.pendiente": true,
				"meta.tipo": "ecodesarrollo"
			}
		}
		return Documents.find(selector).map(arc => {
			const archivo = Documents.findOne({ _id: arc._id });
			return {
				_id: arc._id,
				link: archivo.name,
				archivo: archivo.link()
			}
		});
	}
})

Template.eco_desarrollos.events({
	"click .marco-entidad"(e, template) {
		const id = e.currentTarget.id;
		const entidad = ECODesarrollos.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoDesarrolloSeleccionada.set(entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e, template) {
		template.ecoDesarrolloSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		Session.set("ecoDesarrolloSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e, template) {
		const doc = FormUtils.getFields();
		const ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if (ecoDesarrollo._id) {
			doc._id = ecoDesarrollo._id;
		} else {
			doc.userId = Meteor.userId();
			doc.ultimaActualizacion = new Date();
		}
		Meteor.call("ECODesarrollos.Actualizar", doc, function (err, resp) {
			if (!err) {
				UIUtils.toggle("carrousel", "modo-listado");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoDesarrolloSeleccionada.set(false);
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
		template.ecoDesarrolloSeleccionada.set(false);
		template.editando.set(false);
		template.enListado.set(true);
		$(".detalle").scrollTop(0);
	},

	"dragover .camara .marco-drop": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".camara .marco-drop").addClass("activo");
	},
	"dragleave .camara .marco-drop": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".camara .marco-drop").removeClass("activo");
	},
	"dragenter .camara .marco-drop": function (e, t) {
		e.preventDefault();
		e.stopPropagation();
	},
	"drop .camara .marco-drop": function (e, template) {
		e.stopPropagation();
		e.preventDefault();
		var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			var img;
			var meta = {
				tipo: "ecodesarrollo"
			}
			if (!ecoDesarrollo._id) {
				meta.pendiente = true;
			} else {
				meta.ecoDesarrolloId = ecoDesarrollo._id;
			}
			const upload = Images.insert({
				file: e.originalEvent.dataTransfer.files[0],
				meta: meta
			}, false);

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
				template.$(".camara .marco-drop").removeClass("activo");
			});
			upload.start();
		}
	},
	"click .camara .marco-drop"(e) {
		$("#upload-image").click();
	},
	"change #upload-image"(e, template) {
		var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			var meta = {
				tipo: "ecodesarrollo"
			}
			if (!ecoDesarrollo._id) {
				meta.pendiente = true;
			} else {
				meta.ecoDesarrolloId = ecoDesarrollo._id;
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
	"click .imagen .eliminar"(e) {
		const id = e.currentTarget.id;
		Images.remove({ _id: id })
	},

	"dragover .archivo .marco-drop": function (e, t) {
		console.log("ENTRA");
		e.stopPropagation();
		e.preventDefault();
		t.$(".archivo .marco-drop").addClass("activo");
	},
	"dragleave .archivo .marco-drop": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".archivo .marco-drop").removeClass("activo");
	},
	"dragenter .archivo .marco-drop": function (e, t) {
		e.preventDefault();
		e.stopPropagation();
	},
	"drop .archivo .marco-drop": function (e, template) {
		e.stopPropagation();
		e.preventDefault();
		var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			var img;
			var meta = {
				tipo: "ecodesarrollo"
			}
			if (!ecoDesarrollo._id) {
				meta.pendiente = true;
			} else {
				meta.ecoDesarrolloId = ecoDesarrollo._id;
			}
			const upload = Documents.insert({
				file: e.originalEvent.dataTransfer.files[0],
				meta: meta
			}, false);

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
				template.$(".archivo .marco-drop").removeClass("activo");
			});
			upload.start();
		}
	},
	"click .archivo .marco-drop"(e) {
		$("#upload-documento").click();
	},
	"change #upload-documento"(e, template) {
		var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			var meta = {
				tipo: "ecodesarrollo"
			}
			if (!ecoDesarrollo._id) {
				meta.pendiente = true;
			} else {
				meta.ecoDesarrolloId = ecoDesarrollo._id;
			}
			const upload = Documents.insert({
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
	"click .archivo .eliminar"(e) {
		const id = e.currentTarget.id;
		Documents.remove({ _id: id })
	},
	"autocompleteselect #input-comuna"(event, template, doc) {
		//console.log("selected ", doc);
		var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		ecoDesarrollo.comundaId = doc._id
		template.ecoDesarrolloSeleccionada.set(ecoDesarrollo)
	}
})
