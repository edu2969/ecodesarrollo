Template.revision.rendered = function() {	
	Tracker.autorun(() => {
		let seleccion = Session.get("Seleccion");
		if(!seleccion) return;	
		Meteor.subscribe('misentregas', seleccion.entrega.alumnoId, seleccion.tarea._id);
	});
}

Template.revision.helpers({
	revision() {
		return Session.get("Seleccion");		
	},
	evaluaciones() {
		const revision = Session.get("Seleccion");
		const keys = Object.keys(EVALUACIONES);
		keys.pop();
		return keys.map(function(key) {
			let evaluacion = EVALUACIONES[key];
			evaluacion.llave = key;
			delete evaluacion.seleccionado;
			if(revision) {
				if(revision.entrega.evaluacion==key) {
					evaluacion.seleccionado = true;
				}
			}
			return evaluacion;
		});
	},
	fotos() {
		const revision = Session.get("Seleccion");
		if(!revision) return false;
		return Images.find({
			"meta.tareaId": revision.tarea._id
		}).map(function(image, index) {
			var img = Images.findOne({ _id: image._id });
			return {
				_id: image._id,
				imagen: img && img.link(),
				indice: index + 1
			}
		})
	}
})

Template.revision.events({
	"click .contenedor-revision .cruz"() {
    document.querySelector(".contenedor-revision")
			.classList.toggle("activo");
	},
	"click .btn-guardar-revision"() {
		let seleccion = Session.get("Seleccion");
		let entregaId = seleccion.entrega._id;
		let comentario = document.querySelector("#input-comentarios").value;
		let evaluacion = document.querySelector(".seleccionado").id;
		Meteor.call("GuardarEvaluacion", {
			entregaId: entregaId,
			comentario: comentario,
			evaluacion: evaluacion
		}, function(err, resp) {
			document.querySelector(".contenedor-revision")
				.classList.toggle("activo");			
		})
	},
	"click .evaluacion"(e) {
		document.querySelectorAll(".evaluacion").forEach(function(selector) {
			selector.classList.remove("seleccionado");
		});
		e.currentTarget.classList.add("seleccionado");
		document.querySelector(".btn-guardar-revision").classList.add("habilitado");
	},
	"click .foto"(e) {
		let img = Images.findOne({ _id: e.currentTarget.id });
		Session.set("ImagenSeleccionada", img && img.link());
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	}
});