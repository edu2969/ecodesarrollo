import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { Depositos, Notificaciones } from '../../../lib/collections/BaseCollections'
import { NotificacionesTraductor } from '../../../lib/NotificacionesUtils'
import { Images } from '../../../lib/collections/FilesCollections'

Template.notificaciones.rendered = function () {
  this.autorun(function () {
    Meteor.subscribe('Notificaciones.listado')
  })
}

Template.notificaciones.helpers({
  listado() {
    return Notificaciones.find().map((notificacion) => {
      notificacion.tipoTraducido = NotificacionesTraductor[notificacion.tipo].glosa
      notificacion.icono = NotificacionesTraductor[notificacion.tipo].icono
      const usuario = Meteor.users.findOne(notificacion.usuarioId)
      const nombre = usuario.profile.nombre
      const email = usuario.emails[0].address
      notificacion.descripcion = '<b>' + nombre + '</b><br/>' + email
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
  "click .notificacion"(e, template) {
    console.log("POR ACA VAMOS")
    const id = e.currentTarget.id
    const notificacion = Notificaciones.findOne({ _id: id })
    const avatar = Images.findOne({ userId: notificacion.usuarioId, meta: {} })
    const usuario = Meteor.users.findOne({ _id: notificacion.usuarioId })
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
    const params = {
      titulo: NotificacionesTraductor[notificacion.tipo].glosa,
      texto: '<div class="notificacion-content">' +
        '<div class="avatar">' + avatarHTML + '</div>' +
        '<div class="nombre">' + usuario.profile.nombre + '</div>' +
        '<div class="deposito">' + depositoHTML + '</div>' +
        '<div class="fecha">' + moment(notificacion.fecha).format('DD/MM/yyyy HH:mm') + '</div>' +
        '</div>',
      esDecision: true,
      method: "Usuarios.AprobarDeposito",
      params: {
        notificacionId: notificacion._id
      }
    }
    Session.set("ModalParams", params)
    $("#modalgeneral").modal("show")
  }
})