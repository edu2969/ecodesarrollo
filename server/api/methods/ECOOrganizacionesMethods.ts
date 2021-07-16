import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { EstadoType } from '/lib/types/EstadoType'
const { ECOOrganizaciones } = require('/lib/collections/ECODimensionesCollections')
const NoficacionesServices = require('../services/NotificacionesServices')

export const Actualizar = new ValidatedMethod({
  name: 'ECOOrganizaciones.Actualizar',
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    usuarioId: {
      type: String,
      optional: true
    },
    nombre: {
      type: String
    },
    tipo: {
      type: String
    },
    subtipo: {
      type: String,
    },
    telefono: {
      type: String
    },
    contacto: {
      type: String
    },
    resena: {
      type: String
    }
  }).validator({
    clean: true,
  }),
  run(doc: any) {
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOOrganizaciones.update({ _id: id }, { $set: doc });
    } else {
      doc.pendiente = true
      const usuarioId = Meteor.userId()
      const ecoOrganizacionId = ECOOrganizaciones.insert(doc);
      NoficacionesServices.nuevaECOOrganizacion(usuarioId, ecoOrganizacionId)
      const img = Images.findOne({
        userId: usuarioId,
        "meta.pendiente": true
      });
      if (img) {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoOrganizacionId": ecoOrganizacionId
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
  name: 'ECOOrganizaciones.AprobarNueva',
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
  name: 'ECOOrganizaciones.Rechazar',
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