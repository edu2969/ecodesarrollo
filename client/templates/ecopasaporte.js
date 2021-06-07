const { Nivel } = require("../utils/nivel");

Template.ecopasaporte.onCreated(function() {
	this.ecoactividades = new ReactiveVar();
	this.panel = new ReactiveVar(false);
	Nivel.setNivelUsuario();
});

Template.ecopasaporte.rendered = function() {		
	setInterval(function() {
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 500);
		
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 650);
		
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 800);
		
		setTimeout(function() {
			UIUtils.toggle("cuerpo", "latido");
		}, 950);
		
	}, 1500);
	
	Tracker.autorun(() => {
	});
	
	const instance = Template.instance();
	instance.ecoactividades.set([{
		espacio: true
	}, {
		espacio: true
	}, {
		nombre: "identificate",
		icono: "fingerprint",
		activo: true,
		accion: "Soy <b>&hearts;</b> verde"
	}, {
		nombre: "sabermas",
		icono: "contact_support",
		accion: "Quiero saber"
	}]);
}

Template.ecopasaporte.helpers({
	ecoactividades() {
		return Template.instance().ecoactividades.get();
	},
	panel() {
		return Template.instance().panel.get();
	}
})

Template.ecopasaporte.events({
	"click .actividad"(e, template) {
		let actividad = e.currentTarget.classList.value;
		
		if(actividad.indexOf("sabermas")!=-1) {
			UIUtils.toggle("tombola", "desaparece");
			UIUtils.toggle("tombola", "flotalatombola2x");
			setTimeout(function() {
				UIUtils.toggle("tombola", "flotalatombola5x");
				template.ecoactividades.set([{
					nombre: "eco_organizaciones",
					icono: "share",
					activo: true,
					accion: "ECO Organizaciones"
				}, {
					nombre: "eco_campanas",
					icono: "campaign",
					accion: "ECO Campañas"
				}, {
					nombre: "eco_desarrollos",
					icono: "architecture",
					accion: "ECO Desarrollos"
				}, {
					nombre: "eco_sos",
					icono: "support",
					accion: "ECO S.O.S."
				}]);
				UIUtils.toggle("tombola", "reaparece");
				UIUtils.toggle("tombola", "desaparece");
				UIUtils.toggle("cruz-principal", "oculto");
				setTimeout(function() {
					UIUtils.toggle("tombola", "reaparece");
				}, 500);
			}, 500);
		} else if(actividad.indexOf("identificate")!=-1) {
			template.panel.set({
				clase: "identificate",
				color: "verde",
				esIdentificate: true
			});
			UIUtils.toggle("eco-panel", "activo");
			setTimeout(function() {
				if(Meteor.userId()) {
					$(".tipo-identificacion").removeClass("oculto");
					$(".contendor-identificate").addClass("oculto");
				} else {
					$(".contendor-identificate").removeClass("oculto");
					$(".tipo-identificacion").addClass("oculto");
				}
			}, 250);
		} else if(actividad.indexOf("eco_organizaciones")!=-1) {
			template.panel.set({
				clase: "eco_organizaciones",
				esECOOrganizaciones: true,
				color: "purpura"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if(actividad.indexOf("eco_campanas")!=-1) {
			template.panel.set({
				clase: "eco_campanas",
				esECOCampanas: true,
				color: "azul"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if(actividad.indexOf("eco_desarrollos")!=-1) {
			template.panel.set({
				clase: "eco_desarrollos",
				esECODesarrollos: true,
				color: "verde"
			});
			UIUtils.toggle("eco-panel", "activo");
		} else if(actividad.indexOf("eco_sos")!=-1) {
			template.panel.set({
				clase: "eco_sos",
				esECOSOS: true,
				color: "amarillo"
			});
			UIUtils.toggle("eco-panel", "activo");
		}
	},
	"click .cruz-panel"(e, template) {
		UIUtils.toggle("eco-panel", "activo");
		setTimeout(function() {
			$(".contendor-identificate").removeClass("oculto");
			$(".tipo-identificacion").removeClass("oculto");
			template.panel.set(false);	
		}, 1000);
	},
	"click .cruz-principal"(e, template) {
		UIUtils.toggle("cruz-principal", "oculto");
		UIUtils.toggle("tombola", "flotalatombola5x");
		UIUtils.toggle("tombola", "flotalatombola2x");
		UIUtils.toggle("tombola", "desaparece");
		setTimeout(function() {
			template.ecoactividades.set([{
				espacio: true 
			}, {
				espacio: true
			}, {
				nombre: "identificate",
				icono: "fingerprint",
				activo: true,
				accion: "Soy <b>&hearts;</b> verde"
			}, {
				nombre: "sabermas",
				icono: "contact_support",
				accion: "Quiero saber"
			}]);
			UIUtils.toggle("tombola", "reaparece");
			UIUtils.toggle("tombola", "desaparece");
			setTimeout(function() {
				UIUtils.toggle("tombola", "reaparece");
			}, 500);
		}, 500);
	}
});

/*

Template.entregas.onCreated(function() {
	this.nivel = new ReactiveVar("7Ab");
});

Template.entregas.rendered = function() {	
	const instance = Template.instance();
	Tracker.autorun(() => {
		Meteor.subscribe('curso', instance.nivel.get());
		Meteor.subscribe('desafios');
		Meteor.subscribe('entregasPorNivel', instance.nivel.get());
	});
}

Template.entregas.helpers({
	alumnos() {
		const nivel = Template.instance().nivel.get();
		return Meteor.users.find({ "profile.curso": nivel }).map(function(alumno) {
			let entregas = Tareas.find().map(function(tarea) {
				const entrega = Entregas.findOne({ tareaId: tarea._id, alumnoId: alumno._id });
				let docEntrega = {
					celda: EVALUACIONES[( entrega && entrega.evaluacion ) || ( entrega && "OK" ) || "SR"]			
				};
				if( entrega && entrega._id ) {
					docEntrega._id = entrega._id;
				}
				return docEntrega;
			});
			return {
				_id: alumno._id,
				nombres: alumno.profile.nombres,
				apellidos: alumno.profile.apellidos,
				entregas: entregas
			}
		});
	},
	tareas() {
		const nivel = Template.instance().nivel.get();
		return Tareas.find().map(function(tarea) {
			let entregas = Meteor.users.find({ "profile.curso": nivel })
			return {
				_id: tarea._id,
				fecha: tarea.desde
			}
		})
	}
})

Template.entregas.events({
	"click th.rotated"(e) {
		const renderTarea = (tarea) => {
			$('#input-desde').datetimepicker({
				format: 'DD/MM/YYYY HH:mm',
				defaultDate: moment(tarea.desde, "DD/MM/YYYY HH:mm")
			});

			$('#input-hasta').datetimepicker({
				format: 'DD/MM/YYYY HH:mm',
				defaultDate: moment(tarea.hasta, "DD/MM/YYYY HH:mm")
			});

			let tipo = "video";
			if( tarea.url ) 
				tipo = "url"; 
			else if( tarea.youtube ) 
				tipo = "youtube";
			Session.set("TareaSeleccionada", tarea);
			$("#summernote").summernote("code", tarea.descripcion ? tarea.descripcion : "");
			document.querySelector(".cuadro-capsula").style.display = 'none';
			document.querySelector("#tipo-" + tipo).style.display = 'block';
			document.querySelector("#radio-" + tipo).checked = true;
			document.querySelector(".contenedor-tarea").classList.toggle("activo");
		}
		
		const id = e.currentTarget.id;
		["video", "youtube", "url"].forEach(function(tipo) {
			document.querySelector("#tipo-" + tipo).style.display = 'none';
		});
		let tarea = {};
		if( id ) {
			tarea = Tareas.findOne({ _id: id });
			renderTarea(tarea);
		} else {
			tarea.desde = moment().startOf("day").hour(8).toDate();
			tarea.hasta = moment().startOf("day").add(44, "hour").toDate();
			Session.set("TareaSeleccionada", tarea);
			Meteor.call("GuardarTarea", false, tarea, function(err, resp) {
				if(!err) {
					tarea._id = resp;
					renderTarea(tarea);
				} else {
					console.ward("Ha habido un error al crear la tarea");
				}
			});			
		}
	},
	"click td"(e) {
		const id = e.currentTarget.id;
		if(!id) return;
		const entrega = Entregas.findOne({ _id: id });
		Session.set("Seleccion", {
			tarea: Tareas.findOne({ _id: entrega.tareaId }),
			entrega: entrega
		});
    document.querySelector(".contenedor-revision").classList.toggle("activo");
	},
	"change #curso"(e, template) {
		const nivel = e.currentTarget.value;
		template.nivel.set(nivel);
	}
});

*/