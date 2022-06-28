
import SimpleSchema from 'simpl-schema';

export const RegistroMaterialSchema = new SimpleSchema({
  material: {
    type: String,
  },
  valor: {
    type: Number,
  },
});

module.exports = RegistroMaterialSchema;

