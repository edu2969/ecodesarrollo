export { Images };
const { ECO_SOS } = require('../../../lib/constantes');

Template.eco_sos.onCreated(function() {
	this.currentUpload = new ReactiveVar();
	this.ecoSosSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true);
});

Template.eco_sos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_sos');
		Meteor.subscribe('eco_sos.imagenes');
	});
}

Template.eco_sos.helpers({
	
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	cantidad() {
		return ECOSos.find().count();
	},
	eco_soss() {
		return ECOSos.find().map(ecosos => {
			ecosos.icono = ECO_SOS.PROBLEMA[ecosos.problema].icono;
			return ecosos;
		});
	},
	ecoSos() {
		const template = Template.instance();
		let ecoSos = template.ecoSosSeleccionada.get();
		if(!ecoSos) return;
		const userId = Meteor.userId();
		if(userId==ecoSos.userId) {
			ecoSos.esPropia = true;
		}
		const img = Images.findOne({ 
			$or: [{
				"meta.ecoSosId": ecoSos._id		
			}, {
				"meta.pendiente": true
			}] 
		});
		ecoSos.avatar = img ? img.link() : '/img/no_image_available.jpg';
		ecoSos.ultimaActividad = ecoSos.ultimaActualizacion;
		ecoSos.integrantes = 0;
		ecoSos.donaciones = 0;
		return ecoSos;
	},
	
	tipos() {
		const keys = Object.keys(ECO_SOS.TIPOS);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.TIPOS[key]
			}
		});
	},
	afectados() {
		const keys = Object.keys(ECO_SOS.AFECTADO);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.AFECTADO[key]
			}
		});
	},
	problemas() {
		const keys = Object.keys(ECO_SOS.PROBLEMA);
		return keys.map((key) => {
			return {
				id: key,
				etiqueta: ECO_SOS.PROBLEMA[key].etiqueta,
				icono: ECO_SOS.PROBLEMA[key].icono
			}
		});
	},
	eco_sos() {
		return Session.get("ECOSosSeleccionado");
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	imagenes() {
		const template = Template.instance();
		const ecoSos = template.ecoSosSeleccionada.get();
		let selector = {};
		if(ecoSos._id) {
			
			selector = {
				"meta.ecoSosId": ecoSos._id,
				"meta.tipo": "ecosos"
			}
		} else {
			selector = {
				"meta.pendiente": true,
				"meta.tipo": "ecosos"
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
});

Template.eco_sos.events({
	"click .marco-sos"(e, template) {

		const id = e.currentTarget.id;
		const entidad = ECOSos.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoSosSeleccionada.set(entidad);
		//Session.set("ECOSosSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e, template) {
		template.ecoSosSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		Session.set("ECOSosSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e, template) {

		const doc = FormUtils.getFields();
		const ecoSos = template.ecoSosSeleccionada.get();

		if(ecoSos._id) {
			doc._id = ecoSos._id;
		} else {
			doc.userId = Meteor.userId();
			doc.ultimaActualizacion = new Date();
		}
		Meteor.call("ActualizarECOSos", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");
				template.ecoSosSeleccionada.set(false);
				template.editando.set(false);
				template.enListado.set(true);	
			}
		})
	},
	"click #btn-editar"(e, template) {
		const editando = template.editando.get();
		template.editando.set(!editando);
	},
	"click .navegacion-atras"(e, template) {
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");		
		template.ecoSosSeleccionada.set(false);
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
    var ecoSos = template.ecoSosSeleccionada.get();
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
			var img;
			var meta = {
				tipo: "ecosos"
			}
			if (!ecoSos._id) {
				meta.pendiente = true;
			} else {
				meta.ecoSosId = ecoSos._id;
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
    var ecoSos = template.ecoSosSeleccionada.get();
    if (e.currentTarget.files && e.currentTarget.files[0]) {
	  	var meta = {
   			tipo: "ecosos"
    	}
    	if (!ecoSos._id) {
    		meta.pendiente = true;
    	} else {
    		meta.ecoSosId = ecoSos._id;
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
