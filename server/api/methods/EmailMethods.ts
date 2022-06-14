import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Email } from 'meteor/email'

export const Test = new ValidatedMethod({
  name: 'Email.Test',
  validate: new SimpleSchema({
    to: {
      type: String
    }
  }).validator({
    clean: true,
  }),
  run(doc: any) {
    Email.send({
      to: 'edtronco@yopmail.com',
			from: 'no-reply@ecopasaporte.cl',
			subject: 'Mail de prueba',
			html: '<h1>Esto es una prueba<h1/>',
    })
  }
});