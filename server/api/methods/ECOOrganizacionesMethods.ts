import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { NotificacionType } from '/lib/types/NotificacionType'
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
    direccion: {
      type: String
    },
    comuna: {
      type: String
    },
    encargadoId: {
      type: String
      optional: true
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
    doc.ultimaActualizacion = new Date()
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOOrganizaciones.update({ _id: id }, { $set: doc });
    } else {
      doc.estado = EstadoType.Pendiente
      const usuarioId = this.userId
      doc.usuarioId = usuarioId
      doc.createdAt = new Date()
      doc.historial = [{
        estado: EstadoType.Pendiente,
        fecha: doc.createdAt,
      }]
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
  run(doc: any) {
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
    const ecoOrganizacion = ECOOrganizaciones.findOne({ _id: notificacion.ecoOrganizacionId })
    ecoOrganizacion.historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date(),
    })
    ECOOrganizaciones.update({ _id: notificacion.ecoOrganizacionId }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: ecoOrganizacion.historial
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
  run(doc: any) {
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
    const ecoOrganizacion = ECOOrganizaciones.findOne({ _id: notificacion.ecoOrganizacionId })
    ecoOrganizacion.historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date(),
    })
    ECOOrganizaciones.update({ _id: notificacion.ecoOrganizacionId }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: ecoOrganizacion.historial
      }
    })
    return true
  }
})

export const SolicitarEntrar = new ValidatedMethod({
  name: 'ECOOrganizaciones.SolicitarEntrar',
  validate: new SimpleSchema({
    ecoOrganizacionId: {
      type: String
    },
    usuarioId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc: any) {
    const usuarioId = Meteor.userId()
    if (usuarioId !== doc.usuarioId) {
      throw new Meteor.Error("Algo anda mal. Suplantación de identidad")
    }
    const ecoOrganizacion = ECOOrganizaciones.findOne({ _id: doc.ecoOrganizacionId })
    Notificaciones.insert({
      usuarioId: ecoOrganizacion.usuarioId,
      solicitanteId: doc.usuarioId,
      ecoOrganizacionId: doc.ecoOrganizacionId,
      tipo: NotificacionType.EntrarECOOrganizacion,
      estado: EstadoType.Pendiente,
      fecha: new Date(),
      historial: [{
        estado: EstadoType.Pendiente,
        fecha: new Date(),
      }]
    })
    return true
  }
})

export const AprobarIncorporacion = new ValidatedMethod({
  name: 'ECOOrganizaciones.AprobarIncorporacion',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc: any) {
    const notificacion = Notificaciones.findOne({ _id: doc.notificacionId })
    const ecoOrganizacion = ECOOrganizaciones.findOne({ _id: notificacion.ecoOrganizacionId })
    if (!ecoOrganizacion.integrantes) {
      ecoOrganizacion.integrantes = []
    }
    ecoOrganizacion.integrantes.push({
      usuarioId: notificacion.solicitanteId,
      fecha: new Date()
    })
    ECOOrganizaciones.update({ _id: ecoOrganizacion._id }, {
      $set: {
        integrantes: ecoOrganizacion.integrantes,
        ultimaActualizacion: new Date(),
      }
    })
    const historial = notificacion.historial
    historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date()
    })
    Notificaciones.update({ _id: doc.notificacionId }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: historial
      }
    })
    return true
  }
})

export const RechazarIncorporacion = new ValidatedMethod({
  name: 'ECOOrganizaciones.RechazarIncorporacion',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc: any) {
    const notificacion = Notificaciones.findOne({ _id: doc.notificacionId })
    const historial = notificacion.historial
    historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date()
    })
    Notificaciones.update({ _id: doc.notificacionId }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: historial
      }
    })
    return true
  }
})