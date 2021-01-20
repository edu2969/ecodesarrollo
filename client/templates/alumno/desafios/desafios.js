Template.desafios.rendered = function() {		
	Tracker.autorun(() => {
		Meteor.subscribe('desafios');
		Meteor.subscribe('entregas');
	});
	Session.set("DesafioSeleccionado", false);
}

Template.desafios.helpers({
	desafios() {
		var desafios = Tareas.find();
		return desafios.map(function(desafio) {
			let entrega = Entregas.findOne({ tareaId: desafio._id });
			if(entrega) {
				desafio.color = entrega && entrega.comentado ? "amarillo" : "verde";
				desafio.icono = ( entrega && entrega.evaluacion ) ? EVALUACIONES[entrega.evaluacion].icono : "hourglass_top";				
				if(entrega.comentario) {
					desafio.comentario = entrega.comentario;
				}
			} else {
				desafio.color = "rojo";
				desafio.icono = "remove_circle";
			}
			return desafio;
		});
	},
	stats() {
		return {
			entregas: Entregas.find().count(),
			total: Tareas.find().count()
		}
	}
})

Template.desafios.events({
  "click .btn-contactar-profesor"() {
    document.querySelector("#modalconsultarprofesor")
      .classList.add("activo");
  },
	"click .barra"(e) {
		const id = e.currentTarget.id;
		const desafio = Tareas.findOne({ _id: id });
		Session.set("DesafioSeleccionado", desafio);
    document.querySelector(".contenedor-desafio").classList.toggle("activo");
	}
});