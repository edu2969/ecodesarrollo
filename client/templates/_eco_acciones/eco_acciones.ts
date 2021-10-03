import { Meteor } from 'meteor/meteor'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'
import { UIUtils, FormUtils, IsEmpty } from '../../utils/utils'
import { ECOAcciones, ECOOrganizaciones, Participaciones } from '../../../lib/collections/ECODimensionesCollections'
import { EstadoType } from '../../../lib/types/EstadoType'
const { Comunas } = require('../../../lib/collections/BaseCollections')
const { Images } = require('../../../lib/collections/FilesCollections')
const { ECO_ACCIONES } = require('../../../lib/constantes')

const iniciarTimePickers = () => {
	setTimeout(function () {
		$("#input-fechaRetiro").datetimepicker({
			locale: moment.locale("es"),
			format: "DD/MM/YYYY",
			defaultDate: moment().startOf("day").hour(8),
		});
	}, 250)
}

Template.eco_acciones.onCreated(function () {
	this.currentUpload = new ReactiveVar();
	this.ecoAccionSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true)
	this.errores = ReactiveVar(false);
	this.indiceImagen = ReactiveVar(0);
});

var handler;

Template.eco_acciones.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_acciones');
		Meteor.subscribe('eco_acciones.imagenes');
		Meteor.subscribe('eco_acciones.participantes');
		Meteor.subscribe('eco_acciones.participaciones');
	});
	Meteor.subscribe('lugares.comunas')
	Meteor.subscribe('usuarios.coordinadores')
	Meteor.subscribe('eco_organizaciones')
	Meteor.subscribe('eco_organizaciones.imagenes');

	const instance = Template.instance();
	handler = ECOAcciones.find();
	handler.observeChanges({
		changed(id, fields) {
			const ecoAccion = instance.ecoAccionSeleccionada.get();
			if(id === ecoAccion._id) {
				instance.ecoAccionSeleccionada.set(ECOAcciones.findOne(id));
			}
		}
	})
}

Template.eco_acciones.helpers({
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	eco_acciones() {
		return ECOAcciones.find().map(ecoAccion => {
			ecoAccion.ultimaActividad = ecoAccion.ultimaActualizacion;
			const img = Images.findOne({
				$or: [{
					"meta.ecoAccionId": ecoAccion._id,
					"meta.tipo": "ecoAccion",
				}]
			});
			ecoAccion.avatar = img ? img.link() : '/img/no_image_available.jpg';
			ecoAccion.integrantes = 0;
			ecoAccion.donaciones = 0;
			if (ecoAccion.estado === EstadoType.Pendiente) {
				ecoAccion.estaPendiente = true
			}
			return ecoAccion;
		});
	},
	ecoAccion() {
		const template = Template.instance();
		let ecoAccion = JSON.parse(JSON.stringify(template.ecoAccionSeleccionada.get()));
		if (!ecoAccion) return;
		const userId = Meteor.userId();
		if (userId == ecoAccion.usuarioId) {
			ecoAccion.esPropia = true;
		}
		const img = Images.find({
			$or: [{
				"meta.tipo": "ecoAccion",
				"meta.ecoAccionId": ecoAccion._id
			}, {
				"meta.tipo": "ecoAccion",
				"meta.pendiente": true
			}]
		})
		ecoAccion.tieneImagenes = img.count() > 0 ? "true" : ""
		ecoAccion.ultimaActividad = ecoAccion.ultimaActualizacion
		ecoAccion.integrantes = 1 + ( ecoAccion.participantes ? ecoAccion.participantes.length : 0 );
		ecoAccion.puntos = 0;

		if (ecoAccion.cuadrillasId) {
			const cuadrillasId = ecoAccion.cuadrillasId.split(",")
			let cuadrillas = []
			ecoAccion.cuadrillas = cuadrillasId.map((id: string) => {
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
		
		ecoAccion.participantes = ecoAccion.participantes && 
		ecoAccion.participantes.map((participanteId)=>{
			var resultado = {};
			const participante = Meteor.users.findOne({ _id: participanteId })
			const nombre = participante.profile.nombre
			resultado.nombre = nombre
			const imgParticipante = Images.findOne({ userId: participanteId, meta: {} });
			if (imgParticipante) {
				resultado.imagen = imgParticipante.link()
			} else {
				const separado = nombre.split(" ")
				const iniciales = separado[0].charAt(0) + (separado.length > 1 ? separado[1].charAt(0) : "")
				resultado.iniciales = iniciales
			}
			resultado.participanteId = participanteId;
			const participacion = Participaciones.findOne({
				ecoAccionId: ecoAccion._id,
				participanteId: participanteId,
			});
			if(!participacion) {
				resultado.sinRegistro = true;
			} else if(participacion.participa) {
				resultado.siParticipa = true;
			} else {
				resultado.noParticipa = true;
			}
			return resultado;
		});

		return ecoAccion
	},
	cantidad() {
		return ECOAcciones.find().count();
	},
	tipos() {
		const keys = Object.keys(ECO_ACCIONES.TIPOS);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_ACCIONES.TIPOS[key]
			}
		});
	},
	materias() {
		return [{
			id: "PET1",
			etiqueta: "Plástico PET1",
		}, {
			id: "ORG",
			etiqueta: "Residuo orgánico",
		}, {
			id: "LAT",
			etiqueta: "Latas",
		}, {
			id: "CAR",
			etiqueta: "Cartón",
		}, {
			id: "VID",
			etiqueta: "Vidrios",
		}]
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
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
	},
})

Template.eco_acciones.events({
	"click .marco-entidad"(e: any, template: Blaze.TemplateInstance) {
		const id = e.currentTarget.id;
		const entidad = ECOAcciones.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoAccionSeleccionada.set(entidad)
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e: any, template: Blaze.TemplateInstance) {
		template.ecoAccionSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		Session.set("ECOAccioneseleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
		iniciarTimePickers()
	},
	"click #btn-guardar"(e: any, template: Blaze.TemplateInstance) {
		const customValidation = (invalido) {
			const fi = $("#input-fechaInicio").val()
			const ff = $("#input-fechaFin").val()
			if (IsEmpty(fi) || IsEmpty(ff)) {
				return invalido
			}
			const fechaInicio = moment(fi, 'DD/MM/YYYY')
			const fechaFin = moment(ff, 'DD/MM/YYYY')
			if (fechaInicio.isAfter(fechaFin)) {
				if (!invalido) {
					invalido = {}
				}
				invalido.fechaFin = "Debe ser mayor que la fecha inicial"
			}
			return invalido
		}

		let invalido = FormUtils.invalid()
		const doc = FormUtils.getFields()
		const ecoAccion = template.ecoAccionSeleccionada.get()

		if (ecoAccion._id) {
			doc._id = ecoAccion._id
		} else {
			doc.ultimaActualizacion = new Date()
		}

		if (ecoAccion.comunaId) {
			doc.comunaId = ecoAccion.comunaId
		}

		template.ecoAccionSeleccionada.set(doc)

		invalido = customValidation(invalido)

		if (invalido) {
			template.errores.set(invalido)
			return false
		}

		Meteor.call("ECOAcciones.Actualizar", doc, function (err: Meteor.error, resp: boolean) {
			if (!err) {
				UIUtils.toggle("carrousel", "modo-listado");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoAccionSeleccionada.set(false);
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
		template.ecoAccionSeleccionada.set(false);
		template.editando.set(false);
		template.enListado.set(true);
		$(".detalle").scrollTop(0);
	},
	"autocompleteselect #input-comuna"(event: any, template: Blaze.TemplateInstance, doc: any) {
		//console.log("selected ", doc);
		var ecoAccion = template.ecoAccionSeleccionada.get();
		ecoAccion.comundaId = doc._id
		template.ecoAccionSeleccionada.set(ecoAccion)
	},
	"autocompleteselect #input-cuadrilla"(event: any, template: Blaze.TemplateInstance, doc: any) {
		var ecoAccion = template.ecoAccionSeleccionada.get()
		let cuadrillasId = ecoAccion.cuadrillasId || ""
		if (cuadrillasId.split(",").indexOf(doc._id) == -1) {
			cuadrillasId += (cuadrillasId == "" ? "" : ",") + doc._id
			ecoAccion.cuadrillasId = cuadrillasId
			template.ecoAccionSeleccionada.set(ecoAccion)
		}
		$("#input-cuadrilla").val("")
	},
	"click #reasignar-cuadrilla"(event: any, template: Blaze.TemplateInstance) {
		const id = event.currentTarget.attributes["cuadrillaId"].value
		var ecoAccion = template.ecoAccionSeleccionada.get()
		var cuadrillasId = ecoAccion.cuadrillasId.split(",")
		const indice = cuadrillasId.indexOf(id)
		cuadrillasId.splice(indice, 1)
		ecoAccion.cuadrillasId = cuadrillasId.join()
		template.ecoAccionSeleccionada.set(ecoAccion)
	},
})
