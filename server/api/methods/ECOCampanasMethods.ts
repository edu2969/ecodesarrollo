import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
const { ECOCampanas } = require('/lib/collections/ECODimensionesCollections')
const NotificacionesServices = require('../services/NotificacionesServices')
import { EstadoType } from '../../../lib/types/EstadoType'
import { Notificaciones } from '../../../lib/collections/BaseCollections'
import { Participaciones } from '../../../lib/collections/ECODimensionesCollections'

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
    organizadorId: {
      type: String
      optional: true
    },
    coordinadorId: {
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
    doc.ultimaActualizacion = new Date()
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOCampanas.update({ _id: id }, { $set: doc });
    } else {
      const usuarioId = this.userId
      doc.usuarioId = usuarioId
      doc.estado = EstadoType.Pendiente
      doc.createdAt = new Date()
      doc.historial = [{
        estado: EstadoType.Pendiente,
        fecha: doc.createdAt,
      }]
      const ecoCampanaId = ECOCampanas.insert(doc);
      NotificacionesServices.nuevaECOCampana(usuarioId, ecoCampanaId)
      const imagenes = Images.find({
        userId: usuarioId,
        "meta.pendiente": true
      });
      imagenes.forEach((img) => {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoCampanaId": ecoCampanaId
          },
          $unset: {
            "meta.pendiente": true
          }
        });
      })
    }
  }
});

export const AprobarNueva = new ValidatedMethod({
  name: 'ECOCampanas.AprobarNueva',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
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
    const ecoCampana = ECOCampanas.findOne({ _id: notificacion.ecoCampanaId })
    ecoCampana.historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date(),
    })
    ECOCampanas.update({ _id: ecoCampana._id }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: ecoCampana.historial,
      }
    })
    return true
  }
})

export const RechazarNueva = new ValidatedMethod({
  name: 'ECOCampanas.RechazarNueva',
  validate: new SimpleSchema({
    notificacionId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
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
    const ecoCampana = ECOCampanas.findOne({ _id: notificacion.ecoCampanaId })
    ecoCampana.historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date(),
    })
    ECOCampanas.update({ _id: ecoCampana._id }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: ecoCampana.historial,
      }
    })
    return true
  }
})

export const Participar = new ValidatedMethod({
  name: 'ECOCampanas.Participar',
  validate: new SimpleSchema({
    ecoCampanaId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const ecoCampana = ECOCampanas.findOne({ _id: doc.ecoCampanaId });
    const usuarioId = this.userId;
    const participantes = ecoCampana.participantes || [];
    if(participantes.indexOf(usuarioId)==-1) {
      participantes.push(usuarioId);
    }
    ECOCampanas.update({ _id: doc.ecoCampanaId }, {
      $set: {
        participantes: participantes
      }
    })
    return true;
  }
});

export const Cerrar = new ValidatedMethod({
  name: 'ECOCampanas.Cerrar',
  validate: new SimpleSchema({
    ecoCampanaId: {
      type: String
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    const ecoCampana = ECOCampanas.findOne({ _id: doc.ecoCampanaId });
    let historial = ecoCampana.historial;
    historial.push({
      estado: EstadoType.Cerrado,
      fecha: new Date()
    });
    ECOCampanas.update({ _id: doc.ecoCampanaId }, {
      $set: {
        estado: EstadoType.Cerrado,
        historial: historial,
      }
    })
    return true;
  }
});

export const IndicarParticipacion = new ValidatedMethod({
  name: 'ECOCampanas.IndicarParticipacion',
  validate: new SimpleSchema({
    ecoCampanaId: {
      type: String
    },
    participanteId: {
      type: String,
    },
    participa: {
      type: Boolean,
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    doc.fecha = new Date();
    Participaciones.insert(doc);
    return true;
  }
});