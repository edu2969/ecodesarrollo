import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
import { EstadoType } from '../../../lib/types/EstadoType'
const { ECODesarrollos } = require('/lib/collections/ECODimensionesCollections')
const NoficacionesServices = require('../services/NotificacionesServices')
import { Notificaciones } from '../../../lib/collections/BaseCollections'

export const Actualizar = new ValidatedMethod({
  name: 'ECODesarrollos.Actualizar',
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    titulo: {
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
      ECODesarrollos.update({ _id: id }, { $set: doc });
    } else {
      doc.estado = EstadoType.Pendiente
      const usuarioId = this.userId
      doc.usuarioId = usuarioId
      doc.createdAt = new Date()
      doc.historial = [{
        estado: EstadoType.Pendiente,
        fecha: doc.createdAt,
      }]
      const ecoDesarrolloId = ECODesarrollos.insert(doc);
      NoficacionesServices.nuevoECODesarrollo(usuarioId, ecoDesarrolloId)
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
  name: 'ECODesarrollos.AprobarNuevo',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const usuarioId = this.userId
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
    const ecoDesarrollo = ECODesarrollos.findOne({ _id: notificacion.ecoDesarrolloId })
    ecoDesarrollo.historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date(),
    })
    ECODesarrollos.update({ _id: ecoDesarrollo._id }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: ecoDesarrollo.historial,
      }
    })
    return true
  }
})

export const RechazarNuevo = new ValidatedMethod({
  name: 'ECODesarrollos.RechazarNuevo',
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
    const ecoDesarrollo = ECODesarrollos.findOne({ _id: notificacion.ecoDesarrolloId })
    ecoDesarrollo.historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date(),
    })
    ECODesarrollos.update({ _id: ecoDesarrollo._id }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: ecoDesarrollo.historial,
      }
    })
    return true
  }
})