import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
const { ECOCampanas } = require('/lib/collections/ECODimensionesCollections')
const NotificacionesServices = require('../services/NotificacionesServices')

export const Actualizar = new ValidatedMethod({
  name: 'ECOCampanas.Actualizar',
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    tipo: {
      type: String
    },
    descripcion: {
      type: String,
    },
    direccion: {
      type: String
    },
    comuna: {
      type: String
    },
    descripcionLugar: {
      type: String
    },
    fechaInicio: {
      type: Date
    },
    fechaFin: {
      type: Date
    },
    organizadorId: {
      type: String
      optional: true
    },
    coordinadorId: {
      type: String
      optional: true
    },
    cuadrillas: {
      type: String
      optional: true
    }
  }).validator({
    clean: true,
  }),
  run(doc: any) {
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOCampanas.update({ _id: id }, { $set: doc });
    } else {
      doc.pendiente = true
      const usuarioId = Meteor.userId()
      doc.usuarioId = usuarioId
      const ecoCampanaId = ECOCampanas.insert(doc);
      NotificacionesServices.nuevaECOCampana(usuarioId, ecoCampanaId)
      const imagenes = Images.find({
        userId: usuarioId,
        "meta.pendiente": true
      });
      imagenes.forEach((img) => {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoCampanaId": ecoCampanaId
          },
          $unset: {
            "meta.pendiente": true
          }
        });
      })
    }
  }
});
export const AprobarNueva = new ValidatedMethod({
  name: 'ECOCampanas.AprobarNueva',
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
  name: 'ECOCampanas.Rechazar',
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