import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
const { ECOOrganizaciones } = require('/lib/collections/ECODimensionesCollections')

export const Actualizar = new ValidatedMethod({
  name: 'ECOOrganizaciones.Actualizar',
  validate: new SimpleSchema({
    id: {
      type: String
    },
    doc: {
      type: Object
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
      const ecoOrganizacionId = ECOOrganizaciones.insert(doc);
      const img = Images.findOne({
        userId: Meteor.userId(),
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