import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { Depositos, Notificaciones } from '../../../lib/collections/BaseCollections'
import {
  ECOOrganizaciones,
  ECOCampanas,
  ECOSos,
  ECODesarrollos
} from '../../../lib/collections/ECODimensionesCollections'
import { UIUtils, FormUtils, IsEmpty } from '../../utils/utils'
import { NotificacionesTraductor } from '../../../lib/NotificacionesUtils'
import { Images } from '../../../lib/collections/FilesCollections'
import { NotificacionType } from '/lib/types/NotificacionType'
const { ECO_SOS } = require('../../../lib/constantes')
const { ECO_CAMPANAS } = require('../../../lib/constantes')

Template.notificaciones.rendered = function () {
  this.autorun(function () {
    Meteor.subscribe('Notificaciones.listado')
  })
}

Template.notificaciones.helpers({
  listado() {
    return Notificaciones.find().map((notificacion: any) => {
      notificacion.tipoTraducido = NotificacionesTraductor[notificacion.tipo].glosa
      notificacion.icono = NotificacionesTraductor[notificacion.tipo].icono
      const usuario = Meteor.users.findOne(notificacion.usuarioId)
      const nombre = usuario.profile.nombre
      const email = usuario.emails[0].address
      if (notificacion.tipo === NotificacionType.EntrarECOOrganizacion) {
        const solicitante = Meteor.users.findOne({ _id: notificacion.solicitanteId })
        const emailSolicitante = solicitante.emails[0].address
        notificacion.descripcion = '<b>Solicita: ' + solicitante.profile.nombre + '</b><br/>' + emailSolicitante
      } else {
        notificacion.descripcion = '<b>' + nombre + '</b><br/>' + email
      }
      return notificacion
    })
  },
  cantidad() {
    const pendientes = Notificaciones.find({ estado: "Pendiente" }).count()
    return {
      pendientes: pendientes
    }
  }
})

Template.notificaciones.events({
  "click .notificacion"(e: any, template) {
    const id = e.currentTarget.id
    const notificacion = Notificaciones.findOne({ _id: id })
    const avatar = Images.findOne({ userId: notificacion.usuarioId, meta: {} })
    const usuario = Meteor.users.findOne({ _id: notificacion.usuarioId })
    let params
    if (notificacion.tipo == NotificacionType.NuevoUsuario) {
      const deposito = Depositos.findOne({ usuarioId: notificacion.usuarioId })
      let avatarHTML, depositoHTML
      if (avatar) {
        avatarHTML = '<img src="' + avatar.link() + '">'
      } else {
        const nombre = usuario.profile.nombre.split(" ");
        const iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
        avatarHTML = '<div class="no-image">' + iniciales + '</div>'
      }
      if (deposito.tipo == "texto") {
        depositoHTML = '<div class="texto">' + deposito.texto + '</div>'
      } else {
        const comprobante = Images.findOne({ userId: notificacion.usuarioId, "meta.tipo": "deposito" })
        depositoHTML = '<div class="comprobante"><img src="' + comprobante.link() + '"></div>'
      }
      params = {
        titulo: NotificacionesTraductor[notificacion.tipo].glosa,
        texto: '<div class="notificacion-content">' +
          '<div class="avatar">' + avatarHTML + '</div>' +
          '<div class="nombre">' + usuario.profile.nombre + '</div>' +
          '<div class="deposito ' + deposito.tipo + '">' + depositoHTML + '</div>' +
          '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
          '</div>',
        esDecision: true,
        methodAccept: "Usuarios.AprobarDeposito",
        methodReject: "Usuarios.RechazarDeposito",
        params: {
          notificacionId: notificacion._id
        }
      }
    } else if (notificacion.tipo == NotificacionType.NuevaECOOrganizacion) {
      const ecoOrganizacion = ECOOrganizaciones.findOne({
        _id: notificacion.ecoOrganizacionId
      })
      let avatarHTML
      const nombre = usuario.profile.nombre.split(" ");
      if (avatar) {
        avatarHTML = '<img src="' + avatar.link() + '">'
      } else {
        const iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
        avatarHTML = '<div class="no-image">' + iniciales + '</div>'
      }
      const imagen = Images.findOne({
        "meta.ecoOrganizacionId": ecoOrganizacion._id
      })
      params = {
        titulo: NotificacionesTraductor[notificacion.tipo].glosa,
        texto: '<div class="notificacion-content">' +
          '<div class="avatar">' + avatarHTML + '</div>' +
          '<div class="texto">Creador: ' + nombre + '</div>' +
          '<div class="nombre">' + usuario.profile.nombre + '</div>' +
          '<div class="ecodimension-content">' +
          '<div class="titulo">' + ecoOrganizacion.nombre + '</div>' +
          '<div class="imagen"><img src="' + (imagen ? imagen.link() : '/img/no_image_available.jpg') + '"/></div>' +
          '</div>' +
          '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
          '</div>',
        esDecision: true,
        methodAccept: "ECOOrganizaciones.AprobarNueva",
        methodReject: "ECOOrganizaciones.RechazarNueva",
        params: {
          notificacionId: notificacion._id
        }
      }
    } else if (notificacion.tipo == NotificacionType.NuevoECOSos) {
      const ecoSos = ECOSos.findOne({
        _id: notificacion.ecoSosId
      })
      let avatarHTML
      const nombre = usuario.profile.nombre.split(" ");
      if (avatar) {
        avatarHTML = '<img src="' + avatar.link() + '">'
      } else {
        const iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
        avatarHTML = '<div class="no-image">' + iniciales + '</div>'
      }
      const imagen = Images.findOne({
        "meta.ecoSosId": ecoSos._id
      })
      params = {
        titulo: NotificacionesTraductor[notificacion.tipo].glosa,
        texto: '<div class="notificacion-content">' +
          '<div class="avatar">' + avatarHTML + '</div>' +
          '<div class="texto">Creador: ' + nombre + '</div>' +
          '<div class="nombre">' + usuario.profile.nombre + '</div>' +
          '<div class="ecodimension-content">' +
          '<div class="titulo"> Tipo : ' + '<strong>' + ECO_SOS.TIPOS[ecoSos.tipo] + '</strong>' + '</div>' +
          '<div class="titulo"> Afectado : ' + '<strong>' + ECO_SOS.AFECTADO[ecoSos.afectado] + '</strong>' + '</div>' +
          '<div class="titulo"> Tipo LLamado : ' + '<strong>' + ECO_SOS.PROBLEMA[ecoSos.problema].etiqueta + '</strong>' + '</div>' +
          '<div class="contenido">Descripcion :' + '<strong>' + ecoSos.descripcion + '</strong>' + '</div>' +
          '<div class="imagen-avatar"><img src="' + (imagen ? imagen.link() : '/img/no_image_available.jpg') + '"/></div>' +
          '</div>' +
          '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
          '</div>',
        esDecision: true,
        methodAccept: "ECOSos.AprobarNuevo",
        methodReject: "ECOSos.RechazarNuevo",
        params: {
          notificacionId: notificacion._id
        }
      }
    } else if (notificacion.tipo == NotificacionType.NuevoECODesarrollo) {
      const ecoDesarrollo = ECODesarrollos.findOne({
        _id: notificacion.ecoDesarrolloId
      })
      let avatarHTML
      const nombre = usuario.profile.nombre.split(" ");
      if (avatar) {
        avatarHTML = '<img src="' + avatar.link() + '">'
      } else {
        const iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
        avatarHTML = '<div class="no-image">' + iniciales + '</div>'
      }
      const imagen = Images.findOne({
        "meta.ecoDesarrolloId": ecoDesarrollo._id
      })
      params = {
        titulo: NotificacionesTraductor[notificacion.tipo].glosa,
        texto: '<div class="notificacion-content">' +
          '<div class="avatar">' + avatarHTML + '</div>' +
          '<div class="texto">Creador: ' + nombre + '</div>' +
          '<div class="nombre">' + usuario.profile.nombre + '</div>' +
          '<div class="ecodimension-content">' +
          '<div class="contenido">Titulo Eco Desarrollo :' + '<strong>' + ecoDesarrollo.titulo + '</strong>' + '</div>' +
          '<div class="contenido">Direccion :' + '<strong>' + ecoDesarrollo.direccion + '</strong>' + '</div>' +
          '<div class="contenido">Comuna :' + '<strong>' + ecoDesarrollo.comuna + '</strong>' + '</div>' +
          '<div class="contenido">Descripcion :' + '<strong>' + ecoDesarrollo.descripcion + '</strong>' + '</div>' +
          '<div class="imagen"><img src="' + (imagen ? imagen.link() : '/img/no_image_available.jpg') + '"/></div>' +
          '</div>' +
          '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
          '</div>',
        esDecision: true,
        methodAccept: "ECODesarrollos.AprobarNuevo",
        methodReject: "ECODesarrollos.RechazarNuevo",
        params: {
          notificacionId: notificacion._id
        }
      }
    } else if (notificacion.tipo == NotificacionType.NuevaECOCampana) {
      const ecoCampana = ECOCampanas.findOne({
        _id: notificacion.ecoCampanaId
      })
      let avatarHTML
      const nombre = usuario.profile.nombre.split(" ");
      if (avatar) {
        avatarHTML = '<img src="' + avatar.link() + '">'
      } else {
        const iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
        avatarHTML = '<div class="no-image">' + iniciales + '</div>'
      }
      const imagen = Images.findOne({
        "meta.ecoCampanaId": ecoCampana._id
      })
      params = {
        titulo: NotificacionesTraductor[notificacion.tipo].glosa,
        texto: '<div class="notificacion-content">' +
          '<div class="avatar">' + avatarHTML + '</div>' +
          '<div class="texto">Creador: ' + nombre + '</div>' +
          '<div class="nombre">' + usuario.profile.nombre + '</div>' +
          '<div class="ecodimension-content">' +
          '<div class="titulo">' + ECO_CAMPANAS.TIPOS[ecoCampana.tipo] + '</div>' +
          '<div class="contenido">Descripcion :' + '<strong>' + ecoCampana.descripcion + '</strong>' + '</div>' +
          '<div class="contenido">Lugar :' + '<strong>' + ecoCampana.descripcionLugar + '</strong>' + '</div>' +
          '<div class="imagen-avatar"><img src="' + (imagen ? imagen.link() : '/img/no_image_available.jpg') + '"/></div>' +
          '</div>' +
          '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
          '</div>',
        esDecision: true,
        methodAccept: "ECOCampanas.AprobarNueva",
        methodReject: "ECOCampanas.RechazarNueva",
        params: {
          notificacionId: notificacion._id
        }
      }
    } if (notificacion.tipo == NotificacionType.EntrarECOOrganizacion) {
      const ecoOrganizacion = ECOOrganizaciones.findOne({
        _id: notificacion.ecoOrganizacionId
      })
      let avatarHTML
      const solicitante = Meteor.users.findOne({ _id: notificacion.solicitanteId })
      const avatarSolicitante = Images.findOne({ userId: solicitante._id })
      const nombreSolicitante = solicitante.profile.nombre
      if (avatarSolicitante) {
        avatarHTML = '<img src="' + avatarSolicitante.link() + '">'
      } else {
        const iniciales = nombreSolicitante[0].charAt(0)
          + (nombreSolicitante.length > 1 ? nombreSolicitante[1].charAt(0) : "")
        avatarHTML = '<div class="no-image">' + iniciales + '</div>'
      }
      const imagen = Images.findOne({
        "meta.ecoOrganizacionId": ecoOrganizacion._id,
        "meta.tipo": "ecoorganizacion"
      })
      params = {
        titulo: NotificacionesTraductor[notificacion.tipo].glosa,
        texto: '<div class="notificacion-content">' +
          '<div class="avatar">' + avatarHTML + '</div>' +
          '<div class="texto">Solicitante: ' + nombreSolicitante + '</div>' +
          '<div class="texto">Quiere ingresar a:' + ecoOrganizacion.nombre + '</div>' +
          '<div class="ecodimension-content">' +
          '<div class="imagen-avatar"><img src="' + (imagen ? imagen.link() : '/img/no_image_available.jpg') + '"/></div>' +
          '</div>' +
          '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
          '</div>',
        esDecision: true,
        methodAccept: "ECOOrganizaciones.AprobarIncorporacion",
        methodReject: "ECOOrganizaciones.RechazarIncorporacion",
        params: {
          notificacionId: notificacion._id
        }
      }
    }

    Session.set("ModalParams", params)
    $("#modalgeneral").modal("show")
  }
})