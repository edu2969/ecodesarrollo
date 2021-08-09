import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { EstadoType } from '/lib/types/EstadoType'
const { ECOSos } = require('/lib/collections/ECODimensionesCollections')
const NoficacionesServices = require('../services/NotificacionesServices')

export const Actualizar = new ValidatedMethod({
  name: 'ECOSos.Actualizar',
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    tipo: {
      type: String
    },
    afectado: {
      type: String
    },
    problema: {
      type: String
    },
    direccion: {
      type: String
    },
    comuna: {
      type: String
    },
    descripcion: {
      type: String
    }

  }).validator({
    clean: true,
  }),
  run(doc: any) {
    doc.ultimaActualizacion = new Date()
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOSos.update({ _id: id }, { $set: doc });
    } else {
      doc.estado = EstadoType.Pendiente
      doc.createdAt = new Date()
      doc.historial = [{
        estado: EstadoType.Pendiente,
        fecha: doc.createdAt,
      }]
      const usuarioId = this.userId
      const ecoSosId = ECOSos.insert(doc);
      NoficacionesServices.nuevoECOSos(usuarioId, ecoSosId)
      const img = Images.findOne({
        userId: usuarioId,
        "meta.pendiente": true
      });
      if (img) {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoSosId": ecoSosId
          },
          $unset: {
            "meta.pendiente": true
          }
        });
      }
    }
  }

});
export const AprobarNuevo = new ValidatedMethod({
  name: 'ECOSos.AprobarNuevo',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const usuarioId = Meteor.userId()
    const notificacion = Notificaciones.findOne({ _id: doc.notificacionId })
    let historial = notificacion.historial
    historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date()
    })
    Notificaciones.update({
      _id: doc.notificacionId
    }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: historial
      }
    })
    const ecoSos = ECOSos.findOne({ _id: notificacion.ecoSosId })
    ecoSos.historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date(),
    })
    ECOSos.update({ _id: ecoSos._id }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: ecoSos.historial,
      }
    })
    return true
  }
})

export const RechazarNuevo = new ValidatedMethod({
  name: 'ECOSos.RechazarNuevo',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const usuarioId = Meteor.userId()
    const notificacion = Notificaciones.findOne({ _id: doc.notificacionId })
    let historial = notificacion.historial
    historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date()
    })
    Notificaciones.update({
      _id: doc.notificacionId
    }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: historial
      }
    })
    const ecoSos = ECOSos.findOne({ _id: notificacion.ecoSosId })
    ecoSos.historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date(),
    })
    ECOSos.update({ _id: ecoSos._id }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: ecoSos.historial,
      }
    })
    return true
  }
})