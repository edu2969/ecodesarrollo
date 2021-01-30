Template.ecopasaporte.onCreated(function() {
	this.ecoactividades = new ReactiveVar();	
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
		nombre: "identificate",
		icono: "fingerprint",
		activo: true,
		accion: "Soy <b>&hearts;</b> verde"
	}, {
		nombre: "sabermas",
		icono: "contact_support",
		accion: "Quiero saber"
	} /*, {
				nombre: "eco_organizaciones",
				icono: "share",
				activo: true,
				accion: "ECO Organizaciones"
			}, {
				nombre: "eco_voluntariado",
				icono: "pan_tool",
				accion: "ECO Voluntariado"
			}*/]);
}

Template.ecopasaporte.helpers({
	ecoactividades() {
		return Template.instance().ecoactividades.get();
	}
})

Template.ecopasaporte.events({
	"click .actividad"(e, template) {
		UIUtils.toggle("ecopasaporte", "desaparece");
		UIUtils.toggle("eco-panel", "activo");
	},
	"click .cruz"() {
		UIUtils.toggle("ecopasaporte", "desaparece");
		UIUtils.toggle("ecopasaporte", "reaparece");
		setTimeout(function() {
			UIUtils.toggle("ecopasaporte", "reaparece");		
		}, 500);
		UIUtils.toggle("eco-panel", "activo");
	},
	"click .marco-tipo"() {
		UIUtils.toggle("tipo-identificacion", "oculto");
		UIUtils.toggle("contenedor-login", "oculto");
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