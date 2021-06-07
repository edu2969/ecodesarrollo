import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'

export const IngresarDepositoNoConfirmado = new ValidatedMethod({
  name: 'Usuarios.IngresarDepositoNoConfirmado',
  validate: new SimpleSchema({
    tipo: {
      type: String,
    },
    texto: {
      type: String,
      optional: true
    },
    imagenId: {
      type: String,
      optional: true
    }
  }).validator({
    clean: true,
  }),
  run(doc) {
    if(!doc.texto && !doc.imagenId) {
      throw new Meteor.Error('No hay comprobante alguno');
    }
    doc.usuarioId = this.userId;
    doc.fecha = new Date();
    doc.pendiente = true;
    return Depositos.insert(doc);
  }
})