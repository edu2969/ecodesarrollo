export { Images };
const { ECO_CAMPANAS } = require('../../../lib/constantes');

Template.eco_campanas.onCreated(function() {
	this.currentUpload = new ReactiveVar();
	this.ecoCampanaSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true);
});

Template.eco_campanas.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_campanas');
		Meteor.subscribe('eco_campanas.imagenes');
	});
}

Template.eco_campanas.helpers({
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	eco_campanas(){
		return ECOCampanas.find().map(ecoCampana => {
			ecoCampana.ultimaActividad = ecoCampana.ultimaActualizacion;
			const img = Images.findOne({ 
				$or: [{
					"meta.ecoCampanaId": ecoCampana._id,
					"meta.tipo": "ecocampana",
					
				}, {
					"meta.pendiente": true,
					"meta.tipo": "ecocampana"
				}] 
			});
			ecoCampana.avatar = img ? img.link() : '/img/no_image_available.jpg';
			ecoCampana.integrantes = 0;
			ecoCampana.donaciones = 0;
			return ecoCampana;
		
	});
	},
	ecoCampana() {
		//debugger;
		const template = Template.instance();
		let ecoCampana = template.ecoCampanaSeleccionada.get();
		if(!ecoCampana) return;
		const userId = Meteor.userId();
		if(userId==ecoCampana.userId) {
			ecoCampana.esPropia = true;
		}
		const img = Images.findOne({ 
			$or: [{
				"meta.ecoCamapnaId": ecoCampana._id		
			}, {
				"meta.pendiente": true
			}] 
		});
		ecoCampana.avatar = img ? img.link() : '/img/no_image_available.jpg';
		ecoCampana.ultimaActividad = ecoCampana.ultimaActualizacion;
		ecoCampana.integrantes = 0;
		ecoCampana.donaciones = 0;
		return ecoCampana;
	},
	cantidad() {
		return ECOCampanas.find().count();
	},
	tipos() {
		const keys = Object.keys(ECO_CAMPANAS.TIPOS);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_CAMPANAS.TIPOS[key]
			}
		});
	},
	eco_campana(){
		return ECOCampanas.find();
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	imagenes() {
		const template = Template.instance();
		const ecoCampana = template.ecoCampanaSeleccionada.get();
		let selector = {};
		if(ecoCampana._id) {
			selector = {
				"meta.ecoCampanaId": ecoCampana._id,
				"meta.tipo": "ecocampana"
			}
		} else {
			selector = {
				"meta.pendiente": true,
				"meta.tipo": "ecocampana"
			}
		}
		return Images.find(selector).map(img => {
			const imagen = Images.findOne({ _id: img._id });
			return {
				_id: img._id,
				link: imagen.name,
				imagen: imagen.link()
			}
		});
	}
})

Template.eco_campanas.events({
	"click .marco-entidad"(e, template) {
		const id = e.currentTarget.id;
		const entidad = ECOCampanas.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoCampanaSeleccionada.set(entidad);
		//Session.set("ECOCampanaSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e, template) {
		template.ecoCampanaSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		Session.set("ECOCampanaSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e, template) {
		//debugger;
		const doc = FormUtils.getFields();
		const ecoCampana = template.ecoCampanaSeleccionada.get();

		if(ecoCampana._id) {
			doc._id = ecoCampana._id;
		} else {
			doc.userId = Meteor.userId();
			doc.ultimaActualizacion = new Date();
		}
		Meteor.call("ActualizarECOCampana", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoCampanaSeleccionada.set(false);
				template.editando.set(false);
				template.enListado.set(true);	
			}
		})
	},
	"click #btn-editar, click #btn-cancelar"(e, template) {
		const editando = template.editando.get();
		template.editando.set(!editando);
	

		setTimeout(function() {
			$("#input-fechaInicio").datetimepicker({
				locale: moment.locale("es"),
				format: "DD/MM/YYYY HH:mm",
				defaultDate: moment().startOf("day").hour(8),
			});
	
			$("#input-fechaFin").datetimepicker({
				locale: moment.locale("es"),
				format: "DD/MM/YYYY HH:mm",
				defaultDate: moment().startOf("day").hour(8),
			});
		}, 250);
	},
	"click .navegacion-atras"(e, template) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");		
		template.ecoCampanaSeleccionada.set(false);
		template.editando.set(false);
		template.enListado.set(true);
		$(".detalle").scrollTop(0);
	},
	

"dragover .camara .marco-upload": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".camara .marco-drop").addClass("activo");
  },
"dragleave .camara .marco-upload": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".camara .marco-drop").removeClass("activo");
  },
"dragenter .camara .marco-upload": function (e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
"drop .camara .marco-upload": function (e, template) {
    e.stopPropagation();
    e.preventDefault();
    var ecoCampana = template.ecoCampanaSeleccionada.get();
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			var img;
			var meta = {
				tipo: "ecocampana"
			}
			if (!ecoCampana._id) {
				meta.pendiente = true;
			} else {
				meta.ecoCampanaId = ecoCampana._id;
			}		
      const upload = Images.insert({
        file: e.originalEvent.dataTransfer.files[0],
        //streams: 'dynamic',
        //chunkSize: 'dynamic',
        meta: meta
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });
			
      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          //console.log("FileImage", fileObj);
        }
        template.currentUpload.set(false);
        template.$(".marco-drop").removeClass("activo");
      });
      upload.start();
    }
  },
  "click .camara .marco-upload"(e) {
    $("#upload-image").click();
  },
  "change #upload-image"(e, template) {
    var ecoCampana = template.ecoCampanaSeleccionada.get();
    if (e.currentTarget.files && e.currentTarget.files[0]) {
	  	var meta = {
   			tipo: "ecocampana"
    	}
    	if (!ecoCampana._id) {
    		meta.pendiente = true;
    	} else {
    		meta.ecoCampanaId = ecoCampana._id;
    	}
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        meta: meta
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        template.currentUpload.set(false);
        template.$(".camara .marco-drop").removeClass("activo");
      });
			
      upload.start();
    }
  },

	"click .eliminar"(e) {
		const id = e.currentTarget.id;
		Images.remove({ _id: id });
	}
})
