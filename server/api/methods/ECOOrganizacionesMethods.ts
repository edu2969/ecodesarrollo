import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
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