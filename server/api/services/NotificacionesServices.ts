import { Notificaciones } from '/lib/collections/BaseCollections'
import { EstadosType } from "./EstadosType";
import { NotificacionType } from "./NotificationType";

export const nuevoUsuario = (usuarioId: string) {
  Notificaciones.insert({
    tipo: NotificacionType.NuevoUsuario,
    fecha: new Date(),
    estado: EstadosType.Pendiente,
    usuarioId: usuarioId
  })
}

const cambiarEstadoNotificacion = (id: string, estado: EstadosType) {
  const notificacion = Notificaciones.findOne(id);
  let estados = notificacion.historial
  estados.push({
    estado: estado,
    fecha: new Date()
  });
  Notificaciones.update({ _id: id }, { $set: { estado: estado } })
}