import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
const { ECOCampanas } = require('/lib/collections/ECODimensionesCollections')
const NoficacionesServices = require('../services/NotificacionesServices')

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
    organizador: {
      type: String
      optional: true
    },
    coordinador: {
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
      
      const ecoCampanaId = ECOCampanas.insert(doc);
      NoficacionesServices.nuevaECOCampana(usuarioId, ecoCampanaId)
      const img = Images.findOne({
        userId: usuarioId,
        "meta.pendiente": true
      });
      if (img) {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoCampanaId": ecoCampanaId
          },
          $unset: {
            "meta.pendiente": true
          }
        });
      }
    }
  }
});