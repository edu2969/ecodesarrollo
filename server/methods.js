const { CHILE } = require('../lib/lugares/lugares_CL')
import { Regiones, Comunas } from '../lib/collections/BaseCollections'

Meteor.methods({
	// ECOOrganizaciones

	ActualizarECOCampana(doc) {
		if (doc._id) {
			//debugger;
			const id = doc._id;
			delete doc._id;
			ECOCampanas.update({ _id: id }, { $set: doc });
		} else {
			const ecoCampanaId = ECOCampanas.insert(doc);
			Images.find({
				userId: Meteor.userId(),
				"meta.tipo": "ecocampana",
				"meta.pendiente": true
			}).fetch().forEach(function (imagen) {
				Images.update({ _id: imagen._id }, {
					$set: {
						"meta.ecoCampanaId": ecoCampanaId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			})
		}
	},
	ActualizarECOSos(doc) {
		if (doc._id) {
			//debugger;
			const id = doc._id;
			delete doc._id;
			ECOSos.update({ _id: id }, { $set: doc });
		} else {
			const ecoSosId = ECOSos.insert(doc);
			Images.find({
				userId: Meteor.userId(),
				"meta.tipo": "ecosos",
				"meta.pendiente": true
			}).fetch().forEach(function (imagen) {
				Images.update({ _id: imagen._id }, {
					$set: {
						"meta.ecoSosId": ecoSosId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			})
		}
	},
	ActualizarECODesarrollo(doc) {
		if (doc._id) {
			const id = doc._id;
			delete doc._id;
			ECODesarrollos.update({ _id: id }, { $set: doc });
		}
		else {
			const ecoDesarrolloId = ECODesarrollos.insert(doc);
			Images.find({
				userId: Meteor.userId(),
				"meta.tipo": "ecodesarrollo",
				"meta.pendiente": true
			}).fetch().forEach(function (imagen) {
				Images.update({ _id: imagen._id }, {
					$set: {
						"meta.ecoDesarrolloId": ecoDesarrolloId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			})
			Documents.find({
				userId: Meteor.userId(),
				"meta.tipo": "ecodesarrollo",
				"meta.pendiente": true
			}).fetch().forEach(function (archivo) {
				Documents.update({ _id: archivo._id }, {
					$set: {
						"meta.ecoDesarrolloId": ecoDesarrolloId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			})
		}
	},

	// TEST
	_DatosIniciales() {
		Meteor.users.find().forEach(function (usuario) {
			Meteor.users.remove({ _id: usuario._id });
		})
		const defecto = [{
			username: "SuperAdmin",
			email: "admin@yopmail.com",
			password: "test",
			profile: {
				nombre: "Admin Ecopasaporte",
				rol: 1
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	},
	_IniciarComunas() {
		CHILE.REGIONES.forEach((region) => {
			Regiones.insert(region)
		})

		CHILE.COMUNAS.forEach((comuna) => {
			Comunas.insert(comuna);
		})

		console.log("LISTO!");
	}
})