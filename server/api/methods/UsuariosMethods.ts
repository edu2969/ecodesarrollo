import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Depositos } from '/lib/collections/BaseCollections'
import NotificacionesServices from '../services/NotificacionesServices'
import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { EstadoType } from '../services/EstadoType'

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
  run(doc: any) {
    if (!doc.texto && !doc.imagenId) {
      throw new Meteor.Error('No hay comprobante alguno');
    }
    doc.usuarioId = this.userId;
    doc.fecha = new Date();
    doc.pendiente = true;
    NotificacionesServices.nuevoUsuario(this.userId)
    return Depositos.insert(doc);
  }
});

export const CodigoSecreto = new ValidatedMethod({
  name: 'Usuarios.CodigoSecreto',
  validate: new SimpleSchema({
    codigo: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        "profile.codigoSecretoOK": true,
        "profile.corazonVerde": {
          nivel: 1,
          puntos: 0
        }
      }
    });
  }
})

export const RegistrarCuenta = new ValidatedMethod({
  name: 'Usuarios.RegistrarCuenta',
  validate: new SimpleSchema({
    email: {
      type: String
    },
    nombre: {
      type: String
    },
    direccion: {
      type: String
    },
    password: {
      type: String
    },
    pseudonimo: {
      type: String,
      optional: true
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const cuenta = {
      email: doc.email,
      profile: {
        nombre: doc.nombre,
        direccion: doc.direccion,
        rol: 2,
        corazonVerde: {
          nivel: 1,
          puntos: 0
        }
      },
      password: doc.password,
      createdAt: new Date()
    };
    if (doc.pesudonimo) {
      cuenta.username = doc.pesudonimo;
    }
    Accounts.createUser(cuenta);
  }
})

export const ModificarCuenta = new ValidatedMethod({
  name: 'Usuarios.ModificarCuenta',
  validate: new SimpleSchema({
    direccion: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const usuarioId = Meteor.userId()
    const usuario = {
      "profile.direccion": doc.direccion
    }
    Meteor.users.update({ _id: usuarioId }, { $set: usuario })
  }
})

export const AprobarDeposito = new ValidatedMethod({
  name: 'Usuarios.AprobarDeposito',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const usuarioId = Meteor.userId()
    Depositos.update({ usuarioId: usuarioId, pendiente: true }, { $unset: { pendiente: 1 } })
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
    // @TODO enviar mail con el codigo secreto
    return true
  }
})

export const RechazarDeposito = new ValidatedMethod({
  name: 'Usuarios.RechazarDeposito',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const usuarioId = Meteor.userId()
    Depositos.update({ usuarioId: usuarioId, pendiente: true }, { $unset: { rechazado: 1 } })
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