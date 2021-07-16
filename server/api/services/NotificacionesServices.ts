import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { EstadoType } from '/lib/types/EstadoType';
import { NotificacionType } from '/lib/types/NotificacionType';

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

const cambiarEstadoNotificacion = (id: string, estado: EstadoType) {
  const notificacion = Notificaciones.findOne(id);
  let estados = notificacion.historial
  estados.push({
    estado: estado,
    fecha: new Date()
  });
  Notificaciones.update({ _id: id }, { $set: { estado: estado } })
}