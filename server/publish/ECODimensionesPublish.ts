import { Meteor } from 'meteor/meteor'
import { EstadoType } from '../../lib/types/EstadoType'
import { Acciones, Comunas } from '../../lib/collections/BaseCollections'
import { Participaciones } from '../../lib/collections/ECODimensionesCollections'
const { Images, Documents } = require('../../lib/collections/FilesCollections')
const {
	ECOOrganizaciones,
	ECOCampanas,
	ECODesarrollos,
	ECOSos,
	ECOAcciones,
} = require('../../lib/collections/ECODimensionesCollections')

Meteor.publish('eco_organizaciones', function () {
	return ECOOrganizaciones.find({
		$or: [{
			estado: EstadoType.Aprobado
		}, {
			usuarioId: this.userId,
			estado: { $ne: EstadoType.Aprobado }
		}]
	});
});

Meteor.publish('eco_organizaciones.imagenes', function () {
	return Images.find({
		"meta.tipo": "ecoorganizacion"
	}).cursor;
});

Meteor.publishComposite('eco_organizaciones.participantes', function () {
	let participantes = []
	ECOOrganizaciones.find().forEach((ecoorganizacion: any) => {
		if (participantes.indexOf(ecoorganizacion.usuarioId) == -1) {
			participantes.push(ecoorganizacion.usuarioId)
			ecoorganizacion.integrantes && ecoorganizacion.integrantes.forEach((integrante) => {
				if (participantes.indexOf(integrante.usuarioId) == -1) {
					participantes.push(integrante.usuarioId)
				}
			})
		}
	})
	return {
		find() {
			return Meteor.users.find({ _id: { $in: participantes } })
		},
		children: [{
			find(usuario: any) {
				return Images.find({ userId: usuario._id, meta: {} }).cursor
			}
		}]
	}
});

Meteor.publish('eco_campanas', function () {
	return ECOCampanas.find({
		$or: [{
			estado: EstadoType.Aprobado
		}, {
			usuarioId: this.userId,
			estado: { $ne: EstadoType.Aprobado }
		}]
	});
});

Meteor.publish('eco_campanas.imagenes', function () {
	return Images.find({
		"meta.tipo": "ecocampana"
	}).cursor;
});

Meteor.publishComposite('eco_campanas.participantes', function () {
	let participantes = []
	ECOCampanas.find().forEach((ecocampana: any) => {
		const participantes = ecocampana.participantes || [];
		participantes.forEach((participanteId) => {
			if (participantes.indexOf(participanteId) == -1) {
				participantes.push(participanteId);
			}
		})
	})
	return {
		find() {
			return Meteor.users.find({ _id: { $in: participantes } })
		},
		children: [{
			find(usuario: any) {
				return Images.find({ userId: usuario._id, meta: {} }).cursor
			}
		}]
	}
});

Meteor.publish('eco_campanas.participaciones', function () {
	return Participaciones.find();
})

Meteor.publish('eco_sos', function () {
	return ECOSos.find({
		$or: [{
			estado: EstadoType.Aprobado
		}, {
			usuarioId: this.userId,
			estado: { $ne: EstadoType.Aprobado }
		}]
	});
});

Meteor.publish('eco_sos.imagenes', function () {
	return Images.find({
		"meta.tipo": "ecosos"
	}).cursor;
});

Meteor.publish('eco_desarrollos', function () {
	return ECODesarrollos.find({
		$or: [{
			estado: EstadoType.Aprobado
		}, {
			usuarioId: this.userId,
			estado: { $ne: EstadoType.Aprobado }
		}]
	});
});

Meteor.publish('eco_desarrollos.imagenes', function () {
	return Images.find({
		"meta.tipo": "ecodesarrollo"
	}).cursor;
})

Meteor.publishComposite('eco_desarrollos.participantes', function () {
	let participantes = []
	ECODesarrollos.find().forEach((ecodesarrollo: any) => {
		if (participantes.indexOf(ecodesarrollo.usuarioId) == -1) {
			participantes.push(ecodesarrollo.usuarioId)
			ecodesarrollo.integrantes && ecodesarrollo.integrantes.forEach((integrante) => {
				if (participantes.indexOf(integrante.usuarioId) == -1) {
					participantes.push(integrante.usuarioIds)
				}
			})
		}
	})
	return {
		find() {
			return Meteor.users.find({ _id: { $in: participantes } })
		},
		children: [{
			find(usuario: any) {
				return Images.find({ userId: usuario._id, meta: {} }).cursor
			}
		}]
	}
})

Meteor.publish('eco_desarrollos.documentos', function () {
	return Documents.find({
		"meta.tipo": "ecodesarrollo"
	}).cursor;
});

Meteor.publish('eco_acciones', function () {
	const user = Meteor.user();
	var query = {};
	if (user.profile.rol != 255) {
		query = {
			usuarioId: user._id
		}
	}
	return ECOAcciones.find(query);
});

Meteor.publish('eco_acciones.acciones', (ecoAccionId) => {
	return Acciones.find({ ecoAccionId });
});

Meteor.publish('eco_acciones.donaciones', function () {
	const usuarioId = this.userId;
	return Images.find({
		userId: usuarioId,
		"meta.tipo": "donaciones"
	}).cursor;
});

Meteor.publishComposite('eco_acciones.celulas', function () {
	let integrantes = []
	ECOAcciones.find().forEach((ecoservicio: any) => {
		ecoservicio.celula && ecoservicio.celula.forEach((integranteId) => {
			if (integrantes.indexOf(integranteId) == -1) {
				integrantes.push(integranteId)
			}
		})
	})
	return {
		find() {
			return Meteor.users.find({ _id: { $in: integrantes } })
		},
		children: [{
			find(usuario: any) {
				return Images.find({ userId: usuario._id, meta: {} }).cursor
			}
		}]
	}
});

Meteor.publish('lugares.comunas', function () {
	return Comunas.find();
})