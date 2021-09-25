import { Meteor } from 'meteor/meteor'
import { NotificacionType } from '/lib/types/NotificacionType'
import { EstadoType } from '/lib/types/EstadoType'
import { Depositos, Notificaciones } from '../../lib/collections/BaseCollections'
import { Images } from '../../lib/collections/FilesCollections'
import {
  ECOOrganizaciones,
  ECOCampanas,
  ECODesarrollos,
  ECOSos
} from '../../lib/collections/ECODimensionesCollections'

Meteor.publishComposite('Notificaciones.listado', function () {
  return {
    find() {
      const usuario = Meteor.user()
      if (!usuario) return false
      let tipos: Array<string>
      let query: any = {}
      if (usuario.profile.rol == 1) {
        tipos = [
          NotificacionType.NuevoUsuario,
          NotificacionType.Donacion,
          NotificacionType.NuevaECOCampana,
          NotificacionType.NuevaECOOrganizacion,
          NotificacionType.NuevoECODesarrollo,
          NotificacionType.NuevoECOSos
        ]
      } else {
        tipos = [
          NotificacionType.EntrarECOOrganizacion,
          NotificacionType.EntrarECOCampana,
          NotificacionType.EntrarECOdesarrollo,
          NotificacionType.EntrarECOSos
        ]
        query.usuarioId = usuario._id
      }
      query.estado = EstadoType.Pendiente
      query.tipo = {
        $in: tipos
      }
      return Notificaciones.find(query)
    },
    children(notificacion: any) {
      let respuesta = [{
        find(notificacion: any) {
          return Meteor.users.find({ _id: notificacion.usuarioId })
        }
      }, {
        find(notificacion: any) {
          return Images.find({ userId: notificacion.usuarioId, meta: {} }).cursor
        }
      }]
      if (notificacion.tipo === NotificacionType.NuevoUsuario) {
        respuesta.push({
          find(notificacion: any) {
            return Depositos.find({ usuarioId: notificacion.usuarioId, estado: EstadoType.Pendiente })
          }
        }, {
          find(notificacion: any) {
            return Images.find({ userId: notificacion.usuarioId, "meta.tipo": "deposito" }).cursor
          }
        })
      } else if (notificacion.tipo === NotificacionType.NuevaECOOrganizacion) {
        respuesta.push({
          find(notificacion: any) {
            return ECOOrganizaciones.find({ _id: notificacion.ecoOrganizacionId })
          }
        }, {
          find(notificacion: any) {
            return Images.find({ userId: notificacion.usuarioId, "meta.tipo": "ecoorganizacion" }).cursor
          }
        })
      } else if (notificacion.tipo === NotificacionType.NuevaECOCampana) {
        respuesta.push({
          find(notificacion: any) {
            return ECOCampanas.find({ _id: notificacion.ecoCampanaId })
          }
        }, {
          find(notificacion: any) {
            return Images.find({ userId: notificacion.usuarioId, "meta.tipo": "ecocampana" }).cursor
          }
        })
      } else if (notificacion.tipo === NotificacionType.NuevoECODesarrollo) {
        respuesta.push({
          find(notificacion: any) {
            return ECODesarrollos.find({ _id: notificacion.ecoDesarrolloId })
          }
        }, {
          find(notificacion: any) {
            return Images.find({ userId: notificacion.usuarioId, "meta.tipo": "ecodesarrollo" }).cursor
          }
        })
      } else if (notificacion.tipo === NotificacionType.NuevoECOSos) {
        respuesta.push({
          find(notificacion: any) {
            return ECOSos.find({ _id: notificacion.ecoSosId })
          }
        }, {
          find(notificacion: any) {
            return Images.find({ userId: notificacion.usuarioId, "meta.tipo": "ecosos" }).cursor
          }
        })
      } else if (notificacion.tipo === NotificacionType.EntrarECOOrganizacion) {
        respuesta.push({
          find(notificacion) {
            return ECOOrganizaciones.find({ _id: notificacion.ecoOrganizacionId })
          }
        }, {
          find(notificacion: any) {
            return Meteor.users.find({ _id: notificacion.solicitanteId })
          }
        }, {
          find(notificacion: any) {
            return Images.find({ userId: notificacion.solicitanteId, meta: {} }).cursor
          }
        }, {
          find(notificacion: any) {
            return Images.find({
              userId: notificacion.usuarioId,
              "meta.ecoOrganizacionId": notificacion.ecoOrganizacionId
            }).cursor
          }
        })
      }
      return respuesta
    }
  }
})
