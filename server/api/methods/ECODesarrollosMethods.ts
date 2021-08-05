import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
const { ECODesarrollos } = require('/lib/collections/ECODimensionesCollections')
const NoficacionesServices = require('../services/NotificacionesServices')

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
      doc.pendiente = true
      const usuarioId = Meteor.userId()
      doc.usuarioId = usuarioId
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