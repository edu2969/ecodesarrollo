export {
  Images, Capsulas
};

var currentUpload;

Template.desafio.onCreated(function () {
  currentUpload = new ReactiveVar(false);
	
	Tracker.autorun(() => {
		const desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		Meteor.subscribe("misentregas", Meteor.userId(), desafio._id);
		Meteor.subscribe("capsula", desafio._id);
	});
});

Template.desafio.helpers({
	desafio() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		desafio.asignaturaObj = ASIGNATURAS[desafio.asignatura];
		return desafio;
	},
	capsula() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		let capsula = Capsulas.findOne();
		return capsula && capsula.link();
	},
	fotos() {
		const desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return;
		return Images.find({ "meta.tareaId": desafio._id }).map(function(foto, index) {
			let img = Images.findOne({ _id: foto._id });
			let imagen = img && img.link();
			return {
				_id: foto._id,
				imagen: imagen,
				indice: index + 1
			}
		});
	},
	tieneFotos() {
		let desafio = Session.get("DesafioSeleccionado");
		if(!desafio) return false;
		return Images.find({ "meta.tareaId": desafio._id }).count();
	},
	entrega() {
		var entrega = Entregas.findOne();
		if(!entrega) return false;
		entrega.calificacion = EVALUACIONES[entrega.evaluacion];
		let desafio = Session.get("DesafioSeleccionado");
		const fechaLimite = moment(desafio.hasta);
		if( moment().isBefore(fechaLimite) && !entrega.evaluacion ) {
			entrega.abierta = true;
		}
		return entrega;
	}
})

Template.desafio.events({
	"click .contenedor-desafio .cruz"() {
    document.querySelector(".contenedor-desafio")
			.classList.toggle("activo");
	},
	"click .btn-enviar-desafio"() {
		let desafio = Session.get("DesafioSeleccionado");		
		Meteor.call("EnviarDesafio", desafio._id, function(err, resp) {
			if(!err) {
		    document.querySelector(".contenedor-desafio")
					.classList.toggle("activo");
			}
		})
	},
	"click .marco-desafio .nombre"(e) {
		let img = Images.findOne({ _id: e.currentTarget.id });
		Session.set("ImagenSeleccionada", img && img.link());
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	},	
  "dragover .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-texto").addClass("activo");
  },
  "dragleave .camara": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".drop-texto").removeClass("activo");
  },
  'dragenter .camara': function (e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  'drop .camara': function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    var desafio = Session.get("DesafioSeleccionado");
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
      const upload = Images.insert({
        file: e.originalEvent.dataTransfer.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          tareaId: desafio._id
        }
      }, false);

      upload.on('start', function () {
        currentUpload.set(this);
      });
			
      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          //console.log("FileImage", fileObj);
        }
        currentUpload.set(false);
        t.$(".drop-texto").removeClass("activo");
      });
      upload.start();
    }
  },
  'click .camara'(e) {
    $("#upload-image").click();
  },
  'change #upload-image'(e) {
    var desafio = Session.get("DesafioSeleccionado");
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta: {
          tareaId: desafio._id
        }
      }, false);

      upload.on('start', function () {
        currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        currentUpload.set(false);
        $("#upload-image").removeClass("activo");       
      });
			
      upload.start();
    }
  },
	"click .eliminar"(e, template) {
		Images.remove({ _id: e.currentTarget.id });
	}
});