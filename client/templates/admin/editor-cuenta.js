Template.editorCuenta.onCreated(function() {
	this.error = new ReactiveVar(false);
});

Template.editorCuenta.helpers({
	cuenta() {
		let cuenta = Session.get("CuentaSeleccionada");
		if(cuenta && cuenta.profile && cuenta.profile.rol == 3) {
			cuenta.esProfesor = true;
		}
		return cuenta;
	},
	asignaturas() {
		let keys = Object.keys(ASIGNATURAS);
		let cuenta = Session.get("CuentaSeleccionada");
		if(!cuenta) return false;
		return keys.map(function(key) {
			let checked;
			if( cuenta.profile.asignaturas && cuenta.profile.asignaturas.indexOf(key) != -1 ) {
				checked = true;
			}
			return {
				llave: key,
				etiqueta: ASIGNATURAS[key].label,
				checked: checked
			}
		});
	},
	error() {
		return Template.instance().error.get();
	}
});

let ocultarEditor = () => {
	document.querySelector(".contenedor-editor-cuenta")
			.classList.toggle("activo");
	delete Session.keys.CuentaSeleccionada;
}

Template.editorCuenta.events({
	"click .contenedor-editor-cuenta .cruz"() {
    ocultarEditor();
	},
	"click #btn-guardar"(e, template) {
		let cuenta = Session.get("CuentaSeleccionada");
		let doc = { }
		document.querySelectorAll("input[type='text']").forEach(function(item) {
			let atributo = item.id.split("-")[1];			
			if( atributo == "password" ) {
				if(!IsEmpty(item.value)) doc.password = item.value;
			} else if( atributo == "username" ) {
				if(cuenta.username !== item.value) doc.username = item.value;
			} else if( cuenta.profile[atributo] !== item.value ) {
				doc[atributo] = item.value;
			}
		});
		let perfil = Number(document.querySelector("select").value);
		if(cuenta.profile.rol != perfil) doc.perfil = perfil;
		if(perfil == 3) {
			let asignaturas = [];
			document.querySelectorAll("input[type='checkbox']").forEach(function(item) {
				if(item.checked) {
					asignaturas.push(item.value);
				}
			});
			if( cuenta.profile.asignaturas.toString() !== asignaturas.toString() ) {
				doc.asignaturas = asignaturas;
			}
		}
		if(!IsEmpty(doc)) {
			let valido = true;
			if(cuenta._id) {
				doc._id = cuenta._id;
			} else {
				valido = Object.keys(doc).length == 5;
			}
			if(valido) {			
				console.log(doc);
				/*Meteor.call("ActualizarCuenta", doc, function(err, resp) {
					if(!err) {
						ocultarEditor();
					}
				});*/
			} else {
				document.querySelectorAll("input").forEach(function(item) {
					item.classList.remove("is-invalid");
					if(item.value == "") {
						console.log(item.id, "vacio");
						item.classList.add("is-invalid");
					}
				});
				template.error.set("<i class='material-icons'>warning</i><span> Los campos son obligatorios</span>");
			}

		} else ocultarEditor();		
	}
})