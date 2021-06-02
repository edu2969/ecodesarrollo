Meteor.methods({
	// Core
	RegistrarCuenta(doc) {
		console.log(doc);
		const cuenta = {
			email: doc.email.valor,
			profile: {
				nombre: doc.nombre.valor,
				direccion: doc.direccion.valor,
				rol: 1
			},
			password: doc.password.valor
		};
		if(doc.pesudonimo) {
			cuenta.username = doc.pesudonimo.valor;
		}
		console.log(cuenta);
		Accounts.createUser(cuenta);
		// @TODO Enviar por email el codigo secreto
	},
	ActualizarCuenta(doc) {
		if(doc._id) {
			let docSet = {};
			if(doc.username) {
				docSet.username = doc.username;
				delete doc.username;
			}
			let id = doc._id;
			delete doc._id;
			delete doc.perfil;
			let password;
			if(doc.password) {
				password = doc.password;
				delete doc.password;
			}
			Object.keys(doc).forEach((key) => {
				let valor = doc[key];
				docSet["profile." + key] = valor;
			});
			Meteor.users.update({
				_id: id
			}, { $set: docSet });
			if(password) {
				Accounts.setPassword(id, password);
			}
		} else {
			let docNew = {
				username: doc.username,
				password: doc.password,
				profile: {
					nombres: doc.nombres,
					apellidos: doc.apellidos,
					rol: doc.perfil
				}
			};
			Accounts.createUser(docNew);
		}
  },

	// ECOOrganizaciones
	ActualizarECOOrganizacion(doc) {
		if(doc._id) {
			const id = doc._id;
			delete doc._id;
			ECOOrganizaciones.update({ _id: id }, { $set: doc });
		} else {
			const ecoOrganizacionId = ECOOrganizaciones.insert(doc);
			const img = Images.findOne({
				userId: Meteor.userId(),
				"meta.pendiente": true
			});
			if(img) {
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
	},
	ActualizarECOCampana(doc) {
		if(doc._id) {
			//debugger;
				const id = doc._id;
				delete doc._id;
				ECOCampanas.update({ _id: id }, { $set: doc });
		} else {
					const ecoCampanaId = ECOCampanas.insert(doc);
					const img = Images.findOne({
						userId: Meteor.userId(),
						"meta.pendiente": true	
					});
			if(img) {
					Images.update({ _id: img._id }, {
					$set: {
						"meta.ecoCampanaId": ecoCampanaId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			}	
		}
	},
	ActualizarECOSos(doc) {
		if(doc._id) {
			//debugger;
				const id = doc._id;
				delete doc._id;
				ECOSos.update({ _id: id }, { $set: doc });
		} else {
					const ecoSosId = ECOSos.insert(doc);
					const img = Images.findOne({
						userId: Meteor.userId(),
						"meta.pendiente": true	
					});
			if(img) {
					Images.update({ _id: img._id }, {
					$set: {
						"meta.ecoSosId": ecoSosId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			}	
		}
	},
	ActualizarECODesarrollo(doc) {
		if(doc._id) {
			const id = doc._id;
			delete doc._id;
			ECODesarrollos.update({ _id: id }, { $set: doc });
		} else {
			const ecoDesarrolloId = ECODesarrollos.insert(doc);
			const img = Images.findOne({
				userId: Meteor.userId(),
				"meta.pendiente": true
			});
			if(img) {
				Images.update({ _id: img._id }, {
					$set: {
						"meta.ecoDesarrolloId": ecoDesarrolloId
					},
					$unset: {
						"meta.pendiente": true
					}
				});
			}
		}		
	},
	
	// TEST
	_DatosIniciales() {
		Meteor.users.find().forEach(function(usuario) {
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
	}
})