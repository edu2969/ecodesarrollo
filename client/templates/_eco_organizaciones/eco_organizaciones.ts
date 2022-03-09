import { Meteor } from 'meteor/meteor'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { UIUtils, FormUtils, IsEmpty } from '../../utils/utils'
import { Images } from '../../../lib/collections/FilesCollections'
import { ECOAcciones, ECOOrganizaciones } from '../../../lib/collections/ECODimensionesCollections'
import { EstadoType } from '../../../lib/types/EstadoType'
const { ECO_ACCIONES } = require('../../../lib/constantes')
const { Images } = require('../../../lib/collections/FilesCollections')
const { Comunas } = require('../../../lib/collections/BaseCollections')

Template.eco_organizaciones.onCreated(function () {
	this.currentUpload = new ReactiveVar();
	this.ecoOrganizacionSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true)
	this.errores = ReactiveVar(false)
});

Template.eco_organizaciones.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_organizaciones');
		Meteor.subscribe('eco_organizaciones.imagenes');
		Meteor.subscribe('eco_organizaciones.participantes')
	});
		Meteor.subscribe('lugares.comunas')
		Meteor.subscribe('usuarios.coordinadores')
		Meteor.subscribe('eco_organizaciones')
		Meteor.subscribe('eco_organizaciones.imagenes');
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
		return ECOOrganizaciones.find().map((ecoOrganizacion: any) => {
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
			ecoOrganizacion.cantidadIntegrantes = 1 + (ecoOrganizacion.integrantes ? ecoOrganizacion.integrantes.length : 0);
			ecoOrganizacion.puntos = 0

			if (ecoOrganizacion.encargadoId) {
			const encargado = Meteor.users.findOne({ _id: ecoOrganizacion.encargadoId })

			const nombre = encargado.profile.nombre

			ecoOrganizacion.nombreEncargado = nombre
			const imgEncargado = Images.findOne({ userId: ecoOrganizacion.encargadoId, meta: {} })
			if (imgEncargado) {
				ecoOrganizacion.imagenEncargado = imgEncargado.link()
			} else {
				const separado = nombre.split(" ")
				const iniciales = separado[0].charAt(0) + (separado.length > 1 ? separado[1].charAt(0) : "")
				delete ecoOrganizacion.imagenEncargado
				ecoOrganizacion.inicialesEncargado = iniciales
			}
		}

			if (ecoOrganizacion.estado === EstadoType.Pendiente) {
				ecoOrganizacion.estaPendiente = true
			}
			return ecoOrganizacion;
		});
	},

	ecoOrganizacion() {
		const template = Template.instance();
		var ref = template.ecoOrganizacionSeleccionada.get()
		var ecoOrganizacion = JSON.parse(JSON.stringify(ref))
		if (!ecoOrganizacion.usuarioId) {
			ecoOrganizacion.usuarioId = Meteor.userId()
		}
		if (!ecoOrganizacion) return
		const usuarioId = Meteor.userId();
		if (usuarioId == ecoOrganizacion.usuarioId) {
			ecoOrganizacion.esPropia = true;
		}
		const img = Images.findOne({
			$or: [{
				"meta.ecoOrganizacionId": ecoOrganizacion._id,
				"meta.tipo": "ecoorganizacion"
			}, {
				userId: Meteor.userId(),
				"meta.pendiente": true,
				"meta.tipo": "ecoorganizacion"
			}]
		});
		ecoOrganizacion.avatar = img ? img.link() : false
		ecoOrganizacion.tieneAvatar = img ? true : ""
		ecoOrganizacion.ultimaActividad = ecoOrganizacion.ultimaActualizacion;
		ecoOrganizacion.cantidadIntegrantes = 1 + (ecoOrganizacion.integrantes ? ecoOrganizacion.integrantes.length : 0);
		ecoOrganizacion.puntos = 0
		var integrantes = ecoOrganizacion.integrantes ? ecoOrganizacion.integrantes : []
		integrantes.push({
			usuarioId: ecoOrganizacion.usuarioId,
			fecha: ecoOrganizacion.createdAt
		})
		ecoOrganizacion.participantes = integrantes.map((integrante: any) => {
			const ownerImage = Images.findOne({
				userId: integrante.usuarioId,
				meta: {}
			})
			let resultado: any = {
				usuarioId: integrante.usuarioId,
			}
			if (ecoOrganizacion.usuarioId === integrante.usuarioId) {
				resultado.isOwner = true
			}
			const usuario = Meteor.users.findOne({ _id: integrante.usuarioId })
			const nombre = usuario.profile.nombre
			resultado.nombre = nombre
			if (ownerImage) {
				resultado.imagen = ownerImage.link()
			} else {
				const separado = nombre.split(" ")
				const iniciales = separado[0].charAt(0) + (separado.length > 1 ? separado[1].charAt(0) : "")
				resultado.iniciales = iniciales
			}
			return resultado
		});
		if(ecoOrganizacion.encargadoId) {
			const imagenEncargado = Images.findOne({
				userId: ecoOrganizacion.encargadoId,
				meta: {}
			})
			ecoOrganizacion.imagenEncargado = imagenEncargado ? imagenEncargado.link() : false;
			if(!imagenEncargado) {
				const encargado = Meteor.users.findOne({ _id: ecoOrganizacion.encargadoId });
				const separado = encargado.profile.nombre.split(" ");
				ecoOrganizacion.inicialesEncargado = separado[0].charAt(0) + (separado.length > 1 ? separado[1].charAt(0) : "");	
			}
		}
		return ecoOrganizacion
	},
	cantidad() {
		return ECOOrganizaciones.find().count();
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	errores() {
		return Template.instance().errores.get()
	},
	enLogin() {
		return Meteor.userId()
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
	settingsEncargado() {
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
	materias() {
		return LISTADO_MATERIALES
	}
});

Template.eco_organizaciones.events({
	"click .marco-entidad"(e: any, template: any) {
		const id = e.currentTarget.id;
		var entidad = ECOOrganizaciones.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoOrganizacionSeleccionada.set(entidad);
		UIUtils.toggle("carrousel", "modo-listado");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e: any, template: Blaze.TemplateInstance) {
		template.ecoOrganizacionSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		UIUtils.toggle("carrousel", "modo-listado");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e: any, template: Blaze.TemplateInstance) {
		const invalido = FormUtils.invalid()
		const doc = FormUtils.getFields();
		const ecoOrganizacion = template.ecoOrganizacionSeleccionada.get();
		if (ecoOrganizacion._id) {
			doc._id = ecoOrganizacion._id;
		} else {
			doc.ultimaActualizacion = new Date();
		}
		template.ecoOrganizacionSeleccionada.set(doc)
		if (invalido) {
			template.errores.set(invalido)
			return false
		}
		Meteor.call("ECOOrganizaciones.Actualizar", doc, function (err, resp) {
			if (!err) {
				UIUtils.toggle("carrousel", "modo-listado");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoOrganizacionSeleccionada.set(false);
				template.editando.set(false);
				template.enListado.set(true);
			} else {

				console.error(err)
			}
		})
	},
	"click #btn-editar, click #btn-cancelar"(e: any, template: Blaze.TemplateInstance) {
		const editando = template.editando.get();
		template.editando.set(!editando);
	},
	"autocompleteselect #input-encargado"(event: any, template: Blaze.TemplateInstance, doc: any) {
		var ecoOrganizacion = template.ecoOrganizacionSeleccionada.get()
		ecoOrganizacion.encargadoId = doc._id
		template.ecoOrganizacionSeleccionada.set(ecoOrganizacion)
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
	"click #reasignar-encargado"(event: any, template: Blaze.TemplateInstance) {
		var ecoOrganizacion = template.ecoOrganizacionSeleccionada.get()
		delete ecoOrganizacion.encargadoId
		template.ecoOrganizacionSeleccionada.set(ecoOrganizacion)
	},
	"dragover .marco-upload": function (e: any, t: Blaze.TemplateInstance) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".marco-drop").addClass("activo");
	},
	"dragleave .marco-upload": function (e: any, t: Blaze.TemplateInstance) {
		e.stopPropagation();
		e.preventDefault();
		t.$(".marco-drop").removeClass("activo");
	},
	"dragenter .marco-upload": function (e: any, t: Blaze.TemplateInstance) {
		e.preventDefault();
		e.stopPropagation();
	},
	"drop .marco-upload": function (e: any, template: Blaze.TemplateInstance) {
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
				meta = {
					pendiente: true,
					tipo: "ecoorganizacion",
				}
			} else {
				img = Images.findOne({
					userId: Meteor.userId(),
					"meta.ecoOrganizacionId": ecoOrganizacion._id,
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
	"click .marco-upload"(e: any) {
		$("#upload-image").click();
	},
	"change #upload-image"(e: any, template: Blaze.TemplateInstance) {
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
	"click #btn-unirse"(e: any, template: Blaze.TemplateInstance) {
		var ecoOrganizacion = template.ecoOrganizacionSeleccionada.get();
		const params = {
			titulo: 'Solicitud para unirse',
			texto: '<div class="notificacion-content">' +
				'<p>Esta solicitando unirte a <b>' + ecoOrganizacion.nombre + '</b></p>' +
				'<p>Una solicitud será enviada al coordinador. ' +
				'Te informaremos si la aprueba o la rechaza en tus notificaciones.</p>' +
				'<p>¿Estás seguro?</p>' +
				'</div>',
			esConfirmacion: true,
			method: "ECOOrganizaciones.SolicitarEntrar",
			params: {
				ecoOrganizacionId: ecoOrganizacion._id,
				usuarioId: Meteor.userId(),
			}
		}
		Session.set("ModalParams", params)
		$("#modalgeneral").modal("show")
	}
});