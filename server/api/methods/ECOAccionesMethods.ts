import SimpleSchema from 'simpl-schema'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Images } from '/lib/collections/FilesCollections'
import { EstadoType } from '../../../lib/types/EstadoType'
import { Acciones, Notificaciones } from '../../../lib/collections/BaseCollections';

const { ECOAcciones } = require('/lib/collections/ECODimensionesCollections');
const { RegistroMaterialSchema } = require('../schemas/ECODimensionesSchemas');
const NoficacionesServices = require('../services/NotificacionesServices');

export const Actualizar = new ValidatedMethod({
  name: 'ECOAcciones.Actualizar',
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    tipo: {
      type: String
    },
    materiales: {
      type: String,
      optional: true,
    },
    'materiales.$': {
      type: String
    },
    direccion: {
      type: String,
      optional: true,
    },
    comuna: {
      type: String,
      optional: true,
    },
    carta: {
      type: String,
      optional: true,
    },
    fechaRetiro: {
      type: Date,
      optional: true,
    },
    periodicidad: {
      type: String,
      optional: true,
    },
    cuadrillasId: {
      type: String,
      optional: true,
    },
    'cuadrillasId.$': {
      type: String
    },
    celula: {
      type: Array,
      optional: true,
    },
    'celula.$': {
      type: String
    },
    detalleDonacion: {
      type: String,
      optional: true,
    }
  }).validator({
    clean: true,
  }),
  run(doc: any) {
    doc.ultimaActualizacion = new Date()
    if (doc._id) {
      const id = doc._id;
      delete doc._id;
      ECOAcciones.update({ _id: id }, { $set: doc });
    } else {
      doc.estado = EstadoType.Pendiente
      const usuarioId = this.userId
      doc.usuarioId = usuarioId
      doc.createdAt = new Date()
      doc.historial = [{
        estado: EstadoType.Pendiente,
        fecha: doc.createdAt,
      }]
      const ecoAccionId = ECOAcciones.insert(doc);
      NoficacionesServices.nuevaECOAccion(usuarioId, ecoAccionId)
      const img = Images.findOne({
        userId: usuarioId,
        "meta.pendiente": true
      });
      if (img) {
        Images.update({ _id: img._id }, {
          $set: {
            "meta.ecoAccionId": ecoAccionId
          },
          $unset: {
            "meta.pendiente": true
          }
        });
      }
    }
  }
});

export const AprobarNuevaAccion = new ValidatedMethod({
  name: 'ECOAcciones.AprobarNueva',
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
    const ecoAccion = ECOAcciones.findOne({ _id: notificacion.ecoAccionId })
    ecoAccion.historial.push({
      estado: EstadoType.Aprobado,
      fecha: new Date(),
    })
    ECOAcciones.update({ _id: ecoAccion._id }, {
      $set: {
        estado: EstadoType.Aprobado,
        historial: ecoAccion.historial,
      }
    })
    return true
  }
})

export const RechazarNuevaAccion = new ValidatedMethod({
  name: 'ECOAcciones.RechazarNuevaAccion',
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
    const ecoAccion = ECOAcciones.findOne({ _id: notificacion.ecoAccionId })
    ecoAccion.historial.push({
      estado: EstadoType.Rechazado,
      fecha: new Date(),
    })
    ECOAcciones.update({ _id: ecoAccion._id }, {
      $set: {
        estado: EstadoType.Rechazado,
        historial: ecoAccion.historial,
      }
    })
    return true
  }
})

export const RegistrarAccion = new ValidatedMethod({
  name: 'ECOAcciones.RegistrarAccion',
  validate: new SimpleSchema({
    accionId: {
      type: String,
    },
    fecha: {
      type: Date
    },
    valores: {
      type: Array,
      optional: true,
    },
    'valores.$': {
      type: RegistroMaterialSchema,
      optional: true,
    },
    puntos: {
      type: Number,
    }
  }).validator({
    clean: true
  }),
  run(doc) {
    console.log("VIENE LA DATA", doc);
    const accion = ECOAcciones.findOne(doc.accionId);
    const materiales = accion.materiales.split(",");
    let registro = {
      ecoAccionId: doc.accionId,
      fecha: doc.fecha,
      puntos: doc.puntos,
      created_at: new Date(),
      valores: {},
    }
    doc.valores.forEach((valor, index) => {
      registro.valores[materiales[index]] = valor.valor;
    });

    Acciones.insert(registro);
  }
})