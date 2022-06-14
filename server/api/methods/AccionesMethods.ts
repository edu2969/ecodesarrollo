import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { EstadoType } from '../../../lib/types/EstadoType'
import { NotificacionType } from '/lib/types/NotificacionType'
const { ECOAcciones } = require('/lib/collections/ECODimensionesCollections');
const NoficacionesServices = require('../services/NotificacionesServices');
import { Notificaciones } from '../../../lib/collections/BaseCollections';


export const RegistrarAccion = new ValidatedMethod({
  name: 'Acciones.RegistrarAccion',
  validate: new SimpleSchema({
    // @TODO TODOS LOS VALORES DE ENTRADA SEGUN acciones.js
  }).validator({
    clean: true
  }),
  run(doc) {
    // @TODO hacer el insert
  }
})