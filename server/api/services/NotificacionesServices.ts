import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { EstadoType } from "./EstadoType";
import { NotificacionType } from "./NotificacionType";

export const nuevoUsuario = (usuarioId: string) {
  Notificaciones.insert({
    tipo: NotificacionType.NuevoUsuario,
    fecha: new Date(),
    estado: EstadoType.Pendiente,
    usuarioId: usuarioId,
    historial: [{
      estado: EstadoType.Pendiente,
      fecha: new Date()
    }]
  })
}

export const nuevaECOOrganizacion = (usuarioId: string, ecoOrganizacionId: string) {
  Notificaciones.insert({
    tipo: NotificacionType.NuevaECOOrganizacion,
    fecha: new Date(),
    estado: EstadoType.Pendiente,
    usuarioId: usuarioId,
    ecoOrganizacionId: ecoOrganizacionId,
    historial: [{
      estado: EstadoType.Pendiente,
      fecha: new Date()
    }]
  })
}

export const nuevaECOCampana = (usuarioId: string, ecoCampanaId: string) {
  Notificaciones.insert({
    tipo: NotificacionType.NuevaECOCampana,
    fecha: new Date(),
    estado: EstadoType.Pendiente,
    usuarioId: usuarioId,
    ecoCampanaId: ecoCampanaId,
    historial: [{
      estado: EstadoType.Pendiente,
      fecha: new Date()
    }]
  })
}

export const nuevoECODesarrollo = (usuarioId: string, ecoDesarrolloId: string) {
  Notificaciones.insert({
    tipo: NotificacionType.NuevoECODesarrollo,
    fecha: new Date(),
    estado: EstadoType.Pendiente,
    usuarioId: usuarioId,
    ecoDesarrolloId: ecoDesarrolloId,
    historial: [{
      estado: EstadoType.Pendiente,
      fecha: new Date()
    }]
  })
}
export const nuevoECOSos = (usuarioId: string, ecoSosId: string) {
  Notificaciones.insert({
    tipo: NotificacionType.NuevoECOSos,
    fecha: new Date(),
    estado: EstadoType.Pendiente,
    usuarioId: usuarioId,
    ecoSosId: ecoSosId,
    historial: [{
      estado: EstadoType.Pendiente,
      fecha: new Date()
    }]
  })
}

const cambiarEstadoNotificacion = (id: string, estado: EstadoType) {
  const notificacion = Notificaciones.findOne(id);
  let estados = notificacion.historial
  estados.push({
    estado: estado,
    fecha: new Date()
  });
  Notificaciones.update({ _id: id }, { $set: { estado: estado } })
}