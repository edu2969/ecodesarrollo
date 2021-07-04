import { Meteor } from 'meteor/meteor'
import { NotificacionType } from '../api/services/NotificacionType'
import { EstadoType } from '../api/services/EstadoType'
import { Depositos, Notificaciones } from '../../lib/collections/BaseCollections'
import { Images } from '../../lib/collections/FilesCollections'

Meteor.publishComposite('Notificaciones.listado', function () {
  return {
    find() {
      const usuario = Meteor.user()
      let tipos: Array<string>
      let query: any = {}
      if (usuario.profile.rol == 1) {
        tipos = [
          NotificacionType.NuevoUsuario,
          NotificacionType.Donacion,
          NotificacionType.NuevaECOCapana,
          NotificacionType.NuevaECOOrganizacion,
          NotificacionType.NuevoECODesarrollo,
          NotificacionType.NuevoECOSOS
        ]
      } else {
        tipos = [
          NotificacionType.EntrarECOOrganizacion,
          NotificacionType.ParticiparECOCamapa
        ]
        query.usuarioId = usuario._id
      }
      query.estado = EstadoType.Pendiente
      query.tipo = {
        $in: tipos
      }
      return Notificaciones.find(query)
    },
    children: [{
      find(notificacion: any) {
        return Meteor.users.find({ _id: notificacion.usuarioId })
      }
    }, {
      find(notificacion: any) {
        return Images.find({ userId: notificacion.usuarioId, meta: {} }).cursor
      }
    }, {
      find(notificacion: any) {
        return Depositos.find({ usuarioId: notificacion.usuarioId, pendiente: true })
      }
    }, {
      find(notificacion: any) {
        return Images.find({ userId: notificacion.usuarioId, "meta.tipo": "deposito" }).cursor
      }
    }]
  }
})