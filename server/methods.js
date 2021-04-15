Meteor.methods({
	// Core
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
			ECOOrganizaciones.insert(doc);	
		}		
	},
	ActualizarECOCampana(doc) {
		if(doc._id) {
			//debugger;
			const id = doc._id;
			delete doc._id;
			ECOCampanas.update({ _id: id }, { $set: doc });
		} else {
			ECOCampanas.insert(doc);	
		}		
	},
	ActualizarECOSos(doc) {
		if(doc._id) {
			const id = doc._id;
			delete doc._id;
			ECOSos.update({ _id: id }, { $set: doc });
		} else {
			ECOSos.insert(doc);	
		}		
	},
	ActualizarECODesarrollo(doc) {
		if(doc._id) {
			const id = doc._id;
			delete doc._id;
			ECODesarrollos.update({ _id: id }, { $set: doc });
		} else {
			ECODesarrollos.insert(doc);	
		}		
	},
	
	// TEST
	_DatosIniciales() {
		Meteor.users.find().forEach(function(usuario) {
			Meteor.users.remove({ _id: usuario._id });
		})
		const defecto = [{
			username: "admin@yopmail.com",
			password: "test",
			profile: {
				nombres: "Admin",
				apellidos: "Ecopasaporte",
				rol: 1
			}
		}, {
			username: "corazon1@yopmail.com",
			password: "test",
			profile: {
				nombres: "Corazon Uno",
				apellidos: "Ecopasaporte",
				rol: 2
			}
		}];
		defecto.forEach((u) => {
			Accounts.createUser(u);
		});
	}
})