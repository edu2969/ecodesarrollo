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
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOSos.update({ _id: id }, { $set: doc });
    } else {
      doc.pendiente = true
      const usuarioId = Meteor.userId()
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
export const AprobarNueva = new ValidatedMethod({
  name: 'ECOSos.AprobarNueva',
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
    return true
  }
})

export const RechazarNueva = new ValidatedMethod({
  name: 'ECOSos.Rechazar',
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
    return true
  }
})