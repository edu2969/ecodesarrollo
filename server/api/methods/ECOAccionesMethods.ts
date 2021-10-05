import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
import { EstadoType } from '../../../lib/types/EstadoType'
const { ECOAcciones } = require('/lib/collections/ECODimensionesCollections');
const NoficacionesServices = require('../services/NotificacionesServices');
import { Notificaciones } from '../../../lib/collections/BaseCollections';

export const Actualizar = new ValidatedMethod({
  name: 'ECOAcciones.Actualizar',
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    tipo: {
      type: String
    },
    materiales: {
      type: String,
      optional: true,
    },
    'materiales.$': {
      type: String
    },
    direccion: {
      type: String,
      optional: true,
    },
    comuna: {
      type: String,
      optional: true,
    },
    carta: {
      type: String,
      optional: true,
    },
    fechaRetiro: {
      type: Date,
      optional: true,
    },
    periodicidad: {
      type: String,
      optional: true,
    },
    cuadrillas: {
      type: String,
      optional: true,
    },
    'cuadrillas.$': {
      type: String
    },
    celula: {
      type: Array,
      optional: true,
    },
    'celula.$': {
      type: String
    },
    detalleDonacion: {
      type: String,
      optional: true,
    }
  }).validator({
    clean: true,
  }),
  run(doc: any) {
    doc.ultimaActualizacion = new Date()
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOAcciones.update({ _id: id }, { $set: doc });
    } else {
      doc.estado = EstadoType.Pendiente
      const usuarioId = this.userId
      doc.usuarioId = usuarioId
      doc.createdAt = new Date()
      doc.historial = [{
        estado: EstadoType.Pendiente,
        fecha: doc.createdAt,
      }]
      const ecoDesarrolloId = ECOAcciones.insert(doc);
      NoficacionesServices.nuevaECOAccion(usuarioId, ecoDesarrolloId)
      const img = Images.findOne({
        userId: usuarioId,
        "meta.pendiente": true
      });
      if (img) {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoDesarrolloId": ecoDesarrolloId
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
  name: 'ECOAcciones.AprobarNuevo',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
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
    const ecoDesarrollo = ECOAcciones.findOne({ _id: notificacion.ecoDesarrolloId })
    ecoDesarrollo.historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date(),
    })
    ECOAcciones.update({ _id: ecoDesarrollo._id }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: ecoDesarrollo.historial,
      }
    })
    return true
  }
})

export const RechazarNuevo = new ValidatedMethod({
  name: 'ECOAcciones.RechazarNuevo',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
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
    const ecoDesarrollo = ECOAcciones.findOne({ _id: notificacion.ecoDesarrolloId })
    ecoDesarrollo.historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date(),
    })
    ECOAcciones.update({ _id: ecoDesarrollo._id }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: ecoDesarrollo.historial,
      }
    })
    return true
  }
})