import { Meteor } from 'meteor/meteor'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { UIUtils, FormUtils } from '../../utils/utils'
import { ECOCampanas, ECOOrganizaciones } from '../../../lib/collections/ECODimensionesCollections'
const { Comunas } = require('../../../lib/collections/BaseCollections')
const { Images } = require('../../../lib/collections/FilesCollections')
const { ECO_CAMPANAS } = require('../../../lib/constantes')

const iniciarTimePickers = () => {
	setTimeout(function () {
		$("#input-fechaInicio").datetimepicker({
			locale: moment.locale("es"),
			format: "DD/MM/YYYY",
			defaultDate: moment().startOf("day").hour(8),
		});

		$("#input-fechaFin").datetimepicker({
			locale: moment.locale("es"),
			format: "DD/MM/YYYY",
			defaultDate: moment().startOf("day").hour(8),
		});
	}, 250)
}

Template.eco_campanas.onCreated(function () {
	this.currentUpload = new ReactiveVar();
	this.ecoCampanaSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true)
	this.errores = ReactiveVar(false)
});

Template.eco_campanas.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_campanas');
		Meteor.subscribe('eco_campanas.imagenes');
	});
	Meteor.subscribe('lugares.comunas')
	Meteor.subscribe('usuarios.coordinadores')
	Meteor.subscribe('eco_organizaciones')
	Meteor.subscribe('eco_organizaciones.imagenes')
}

Template.eco_campanas.helpers({
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	eco_campanas() {
		return ECOCampanas.find().map(ecoCampana => {
			ecoCampana.ultimaActividad = ecoCampana.ultimaActualizacion;
			const img = Images.findOne({
				$or: [{
					"meta.ecoCampanaId": ecoCampana._id,
					"meta.tipo": "ecocampana",
				}]
			});
			ecoCampana.avatar = img ? img.link() : '/img/no_image_available.jpg';
			ecoCampana.integrantes = 0;
			ecoCampana.donaciones = 0;
			return ecoCampana;
		});
	},
	ecoCampana() {
		const template = Template.instance();
		let ecoCampana = template.ecoCampanaSeleccionada.get();
		if (!ecoCampana) return;
		const userId = Meteor.userId();
		if (userId == ecoCampana.usuarioId) {
			ecoCampana.esPropia = true;
		}
		const img = Images.find({
			$or: [{
				"meta.tipo": "ecocampana",
				"meta.ecoCampanaId": ecoCampana._id
			}, {
				"meta.tipo": "ecocampana",
				"meta.pendiente": true
			}]
		})
		ecoCampana.tieneImagenes = img.count() > 0 ? "true" : ""
		ecoCampana.ultimaActividad = ecoCampana.ultimaActualizacion
		ecoCampana.integrantes = 0
		ecoCampana.donaciones = 0

		if (ecoCampana.organizadorId) {
			const organizador = Meteor.users.findOne({ _id: ecoCampana.organizadorId })
			const nombre = organizador.profile.nombre
			ecoCampana.nombreOrganizador = nombre
			const imgOrganizador = Images.findOne({ userId: ecoCampana.organizadorId, meta: {} })
			if (imgOrganizador) {
				ecoCampana.imagenOrganizador = imgOrganizador.link()
			} else {
				const separado = nombre.split(" ")
				const iniciales = separado[0].charAt(0) + (separado.length > 1 ? separado[1].charAt(0) : "")
				delete ecoCampana.imagenOrganizador
				ecoCampana.inicialesOrganizador = iniciales
			}
		}

		if (ecoCampana.coordinadorId) {
			const coordinador = Meteor.users.findOne({ _id: ecoCampana.coordinadorId })
			const nombre = coordinador.profile.nombre
			ecoCampana.nombreCoordinador = nombre
			const imgCoordinador = Images.findOne({ userId: ecoCampana.coordinadorId, meta: {} })
			if (imgCoordinador) {
				ecoCampana.imagenCoordinador = imgCoordinador.link()
			} else {
				const separado = nombre.split(" ")
				const iniciales = separado[0].charAt(0) + (separado.length > 1 ? separado[1].charAt(0) : "")
				delete ecoCampana.imagenCoordinador
				ecoCampana.inicialesCoordinador = iniciales
			}
		}

		if (ecoCampana.cuadrillasId) {
			const cuadrillasId = ecoCampana.cuadrillasId.split(",")
			let cuadrillas = []
			ecoCampana.cuadrillas = cuadrillasId.map((id: string) => {
				const img = Images.findOne({
					"meta.ecoOrganizacionId": id,
					"meta.tipo": "ecoorganizacion"
				})
				const ecoorganizacion = ECOOrganizaciones.findOne(id)
				return {
					id: id,
					imagen: img ? img.link() : '/img/no_image_available.jpg',
					nombre: ecoorganizacion.nombre
				}
			})
		}

		return ecoCampana
	},
	cantidad() {
		return ECOCampanas.find().count();
	},
	tipos() {
		const keys = Object.keys(ECO_CAMPANAS.TIPOS);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_CAMPANAS.TIPOS[key]
			}
		});
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	imagenes() {
		const template = Template.instance();
		const ecoCampana = template.ecoCampanaSeleccionada.get();
		let selector = {};
		if (ecoCampana._id) {
			selector = {
				userId: Meteor.userId(),
				"meta.ecoCampanaId": ecoCampana._id,
				"meta.tipo": "ecocampana"
			}
		} else {
			selector = {
				userId: Meteor.userId(),
				"meta.pendiente": true,
				"meta.tipo": "ecocampana"
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
	settingsCoordinador() {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.users,
					field: "profile.nombre",
					matchAll: false,
					template: Template.avatar,
					noMatchTemplate: Template.noComuna,
				}
			]
		};
	},
	settingsOrganizador() {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.users,
					field: "profile.nombre",
					matchAll: false,
					template: Template.avatar,
					noMatchTemplate: Template.noComuna,
				}
			]
		};
	},
	settingsCuadrillas() {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: ECOOrganizaciones,
					field: "nombre",
					matchAll: false,
					template: Template.cuadrilla,
					noMatchTemplate: Template.noComuna,
				}
			]
		};
	},
	errores() {
		return Template.instance().errores.get()
	},
	enLogin() {
		return Meteor.userId()
	}
})

Template.eco_campanas.events({
	"click .marco-entidad"(e: any, template: Blaze.TemplateInstance) {
		const id = e.currentTarget.id;
		const entidad = ECOCampanas.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoCampanaSeleccionada.set(entidad);
		//Session.set("ECOCampanaSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e: any, template: Blaze.TemplateInstance) {
		template.ecoCampanaSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		Session.set("ECOCampanaSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
		iniciarTimePickers()
	},
	"click #btn-guardar"(e: any, template: Blaze.TemplateInstance) {
		const invalido = FormUtils.invalid()
		const doc = FormUtils.getFields()
		const ecoCampana = template.ecoCampanaSeleccionada.get()

		if (ecoCampana._id) {
			doc._id = ecoCampana._id
		} else {
			doc.ultimaActualizacion = new Date()
		}

		if (ecoCampana.comunaId) {
			doc.comunaId = ecoCampana.comunaId
		}

		template.ecoCampanaSeleccionada.set(doc)

		if (invalido) {
			template.errores.set(invalido)
			return false
		}

		Meteor.call("ECOCampanas.Actualizar", doc, function (err: Meteor.error, resp: boolean) {
			if (!err) {
				UIUtils.toggle("carrousel", "modo-listado");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoCampanaSeleccionada.set(false);
				template.editando.set(false);
				template.enListado.set(true);
			} else {
				console.error(err)
			}
		})
	},
	"click #btn-editar, click #btn-cancelar"(e: any, template: Blaze.TemplateInstance) {
		const editando = template.editando.get()
		template.editando.set(!editando)
		iniciarTimePickers()
	},
	"click .navegacion-atras"(e: any, template: Blaze.TemplateInstance) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
		template.ecoCampanaSeleccionada.set(false);
		template.editando.set(false);
		template.enListado.set(true);
		$(".detalle").scrollTop(0);
	},


	"dragover .camara .marco-upload": function (e: any, t: Blaze.TemplateInstance) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".camara .marco-drop").addClass("activo");
	},
	"dragleave .camara .marco-upload": function (e: any, t: Blaze.TemplateInstance) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".camara .marco-drop").removeClass("activo");
	},
	"dragenter .camara .marco-upload": function (e: any, t: Blaze.TemplateInstance) {
		e.preventDefault();
		e.stopPropagation();
	},
	"drop .camara .marco-upload": function (e: any, template: Blaze.TemplateInstance) {
		e.stopPropagation();
		e.preventDefault();
		var ecoCampana = template.ecoCampanaSeleccionada.get();
		if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			var img;
			var meta = {
				tipo: "ecocampana"
			}
			if (!ecoCampana._id) {
				meta.pendiente = true;
			} else {
				meta.ecoCampanaId = ecoCampana._id;
			}
			const upload = Images.insert({
				file: e.originalEvent.dataTransfer.files[0],
				//streams: 'dynamic',
				//chunkSize: 'dynamic',
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
	"click .camara .marco-upload"(e: any) {
		$("#upload-imagen").click();
	},
	"change #upload-imagen"(e: any, template: Blaze.TemplateInstance) {
		var ecoCampana = template.ecoCampanaSeleccionada.get();
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			var meta = {
				tipo: "ecocampana"
			}
			if (!ecoCampana._id) {
				meta.pendiente = true;
			} else {
				meta.ecoCampanaId = ecoCampana._id;
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

	"click .eliminar"(e: any) {
		const id = e.currentTarget.id;
		Images.remove({ _id: id });
	},
	"autocompleteselect #input-comuna"(event: any, template: Blaze.TemplateInstance, doc: any) {
		//console.log("selected ", doc);
		var ecoCampana = template.ecoCampanaSeleccionada.get();
		ecoCampana.comundaId = doc._id
		template.ecoCampanaSeleccionada.set(ecoCampana)
	},
	"autocompleteselect #input-coordinador"(event: any, template: Blaze.TemplateInstance, doc: any) {
		var ecoCampana = template.ecoCampanaSeleccionada.get()
		ecoCampana.coordinadorId = doc._id
		template.ecoCampanaSeleccionada.set(ecoCampana)
	},
	"autocompleteselect #input-organizador"(event: any, template: Blaze.TemplateInstance, doc: any) {
		var ecoCampana = template.ecoCampanaSeleccionada.get()
		ecoCampana.organizadorId = doc._id
		template.ecoCampanaSeleccionada.set(ecoCampana)
	},
	"click #reasignar-coordinador"(event: any, template: Blaze.TemplateInstance) {
		var ecoCampana = template.ecoCampanaSeleccionada.get()
		delete ecoCampana.coordinadorId
		template.ecoCampanaSeleccionada.set(ecoCampana)
	},
	"click #reasignar-organizador"(event: any, template: Blaze.TemplateInstance) {
		var ecoCampana = template.ecoCampanaSeleccionada.get()
		delete ecoCampana.organizadorId
		template.ecoCampanaSeleccionada.set(ecoCampana)
	},
	"autocompleteselect #input-cuadrilla"(event: any, template: Blaze.TemplateInstance, doc: any) {
		var ecoCampana = template.ecoCampanaSeleccionada.get()
		let cuadrillasId = ecoCampana.cuadrillasId || ""
		if (cuadrillasId.split(",").indexOf(doc._id) == -1) {
			cuadrillasId += (cuadrillasId == "" ? "" : ",") + doc._id
			ecoCampana.cuadrillasId = cuadrillasId
			template.ecoCampanaSeleccionada.set(ecoCampana)
		}
		$("#input-cuadrilla").val("")
	},
	"click #reasignar-cuadrilla"(event: any, template: Blaze.TemplateInstance) {
		const id = event.currentTarget.attributes["cuadrillaId"].value
		var ecoCampana = template.ecoCampanaSeleccionada.get()
		var cuadrillasId = ecoCampana.cuadrillasId.split(",")
		const indice = cuadrillasId.indexOf(id)
		cuadrillasId.splice(indice, 1)
		ecoCampana.cuadrillasId = cuadrillasId.join()
		template.ecoCampanaSeleccionada.set(ecoCampana)
	},
})
