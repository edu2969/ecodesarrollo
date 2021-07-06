import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'
import { UIUtils } from '../../utils/utils'
const { ECOOrganizaciones } = require('../../../lib/collections/ECODimensionesCollections')
const { Images } = require('../../../lib/collections/FilesCollections')

Template.eco_organizaciones.onCreated(function () {
	this.currentUpload = new ReactiveVar();
	this.ecoOrganizacionSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true);
});

Template.eco_organizaciones.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_organizaciones');
		Meteor.subscribe('eco_organizaciones.imagenes');
	});
}

Template.eco_organizaciones.helpers({
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	ecoOrganizaciones() {
		return ECOOrganizaciones.find().map(ecoOrganizacion => {
			ecoOrganizacion.ultimaActividad = ecoOrganizacion.ultimaActualizacion;
			const img = Images.findOne({
				$or: [{
					"meta.ecoOrganizacionId": ecoOrganizacion._id,
					"meta.tipo": "ecoorganizacion"
				}, {
					"meta.pendiente": true,
					"meta.tipo": "ecoorganizacion"
				}]
			});
			ecoOrganizacion.avatar = img ? img.link() : '/img/no_image_available.jpg';
			ecoOrganizacion.integrantes = 0;
			ecoOrganizacion.donaciones = 0;
			return ecoOrganizacion;
		});
	},
	ecoOrganizacion() {
		const template = Template.instance();
		let ecoOrganizacion = template.ecoOrganizacionSeleccionada.get();
		if (!ecoOrganizacion) return;
		const userId = Meteor.userId();
		if (userId == ecoOrganizacion.userId) {
			ecoOrganizacion.esPropia = true;
		}
		const img = Images.findOne({
			$or: [{
				"meta.ecoOrganizacionId": ecoOrganizacion._id,
				"meta.tipo": "ecoorganizacion"
			}, {
				"meta.pendiente": true,
				"meta.tipo": "ecoorganizacion"
			}]
		});
		ecoOrganizacion.avatar = img ? img.link() : '/img/no_image_available.jpg';
		ecoOrganizacion.ultimaActividad = ecoOrganizacion.ultimaActualizacion;
		ecoOrganizacion.integrantes = 0;
		ecoOrganizacion.donaciones = 0;
		return ecoOrganizacion;
	},
	cantidad() {
		return ECOOrganizaciones.find().count();
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	}
});

Template.eco_organizaciones.events({
	"click .marco-entidad"(e, template) {
		const id = e.currentTarget.id;
		const entidad = ECOOrganizaciones.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoOrganizacionSeleccionada.set(entidad);
		UIUtils.toggle("carrousel", "modo-listado");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e, template) {
		template.ecoOrganizacionSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		UIUtils.toggle("carrousel", "modo-listado");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e, template) {
		const doc = FormUtils.getFields();
		const ecoOrganizacion = template.ecoOrganizacionSeleccionada.get();
		if (ecoOrganizacion._id) {
			doc._id = ecoOrganizacion._id;
		} else {
			doc.userId = Meteor.userId();
			doc.ultimaActualizacion = new Date();
		}

		Meteor.call("ActualizarECOOrganizacion", doc, function (err, resp) {
			if (!err) {
				UIUtils.toggle("carrousel", "modo-listado");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoOrganizacionSeleccionada.set(false);
				template.editando.set(false);
				template.enListado.set(true);
			}
		})
	},
	"click #btn-editar, click #btn-cancelar"(e, template) {
		const editando = template.editando.get();
		template.editando.set(!editando);
	},
	"click .navegacion-atras"(e, template) {
		UIUtils.toggle("carrousel", "modo-listado");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
		template.ecoOrganizacionSeleccionada.set(false);
		template.editando.set(false);
		template.enListado.set(true);
		$(".detalle").scrollTop(0);
	},


	"dragover .marco-upload": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".marco-drop").addClass("activo");
	},
	"dragleave .marco-upload": function (e, t) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".marco-drop").removeClass("activo");
	},
	"dragenter .marco-upload": function (e, t) {
		e.preventDefault();
		e.stopPropagation();
	},
	"drop .marco-upload": function (e, template) {
		e.stopPropagation();
		e.preventDefault();
		var ecoOrganizacion = template.ecoOrganizacionSeleccionada.get();
		if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			let meta = {};
			var img;
			if (!ecoOrganizacion._id) {
				img = Images.findOne({
					userId: Meteor.userId(),
					"meta.pendiente": true
				});
				meta = { pendiente: true };
			} else {
				img = Images.findOne({
					userId: Meteor.userId(),
					"meta.ecoOrganizacion": ecoOrganizacion._id,
					"meta.tipo": "ecoorganizacion"
				});
				meta = {
					ecoOrganizacionId: ecoOrganizacion._id,
					tipo: "ecoorganizacion"
				};
			}
			if (img) {
				Images.remove({ _id: img._id });
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
				template.$(".marco-drop").removeClass("activo");
			});
			upload.start();
		}
	},
	"click .marco-upload"(e) {
		$("#upload-image").click();
	},
	"change #upload-image"(e, template) {
		var ecoOrganizacion = template.ecoOrganizacionSeleccionada.get();
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			let meta = {};
			if (!ecoOrganizacion._id) {
				Images.remove({
					userId: Meteor.userId(),
					"meta.pendiente": true,
					"meta.tipo": "ecoorganizacion"
				});
				meta = {
					pendiente: true,
					tipo: "ecoorganizacion"
				};
			} else {
				meta = {
					ecoOrganizacionId: ecoOrganizacion._id,
					tipo: "ecoorganizacion"
				};
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
				template.$(".marco-drop").removeClass("activo");
			});

			upload.start();
		}
	},





});