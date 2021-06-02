export { Images };

Template.eco_desarrollos.onCreated(function() {
	this.currentUpload = new ReactiveVar();
	this.ecoDesarrolloSeleccionada = new ReactiveVar(false);
	this.editando = ReactiveVar(false);
	this.enListado = ReactiveVar(true);
});

Template.eco_desarrollos.rendered = () => {
	Tracker.autorun(() => {
		Meteor.subscribe('eco_desarrollos');
		Meteor.subscribe('eco_desarrollos.imagenes');
	});
}

Template.eco_desarrollos.helpers({
	enListado() {
		return Template.instance().enListado.get();
	},
	editando() {
		const template = Template.instance();
		return template.editando.get();
	},
	eco_desarrollos(){
		return ECODesarrollos.find();
	},
	ecoDesarrollo() {
		const template = Template.instance();
		let ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if(!ecoDesarrollo) return;
		const userId = Meteor.userId();
		if(userId==ecoDesarrollo.userId) {
			ecoDesarrollo.esPropia = true;
		}
		const img = Images.findOne({ 
			$or: [{
				"meta.ecoDesarrolloId": ecoDesarrollo._id		
			}, {
				"meta.pendiente": true
			}] 
		});
		ecoDesarrollo.avatar = img ? img.link() : '/img/no_image_available.jpg';
		ecoDesarrollo.ultimaActividad = ecoDesarrollo.ultimaActualizacion;
		ecoDesarrollo.integrantes = 0;
		ecoDesarrollo.donaciones = 0;
		return ecoDesarrollo;
	},
	cantidad() {
		return ECODesarrollos.find().count();
	},
	eco_desarrollo() {
		return Session.get("ECODesarrolloSeleccionado");
	},
	currentUpload() {
		return Template.instance().currentUpload.get();
	},
	imagenes() {
		return Images.find({ "meta.tipo": "ecodesarrollo" }).map(img => {
			const imagen = Images.findOne({ _id: img._id });
			return {
				_id: img._id,
				link: imagen.name,
				imagen: imagen.link()
			}
		});
	}
})

Template.eco_desarrollos.events({
	"click .marco-desarrollo"(e, template) {
		const id = e.currentTarget.id;
		//debugger;
		const entidad = ECODesarrollos.findOne({ _id: id });
		template.enListado.set(false);
		template.ecoDesarrolloSeleccionada.set(entidad);
		//Session.set("ECODesarrolloSeleccionado", entidad);
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-nuevo"(e, template) {
		template.ecoDesarrolloSeleccionada.set({});
		template.editando.set(true);
		template.enListado.set(false);
		//Session.set("ECODesarrolloSeleccionado", {});
		UIUtils.toggle("carrousel", "grilla");
		UIUtils.toggle("carrousel", "detalle");
		UIUtils.toggle("navegacion-atras", "activo");
	},
	"click #btn-guardar"(e, template) {
		const doc = FormUtils.getFields();
		const ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
		if(ecoDesarrollo._id) {
			doc._id = ecoDesarrollo._id;
		} else {
			doc.userId = Meteor.userId();
			doc.ultimaActualizacion = new Date();
		}
		//debugger;
		Meteor.call("ActualizarECODesarrollo", doc, function(err, resp) {
			if(!err) {
				UIUtils.toggle("carrousel", "grilla");
				UIUtils.toggle("carrousel", "detalle");
				UIUtils.toggle("navegacion-atras", "activo");		
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
		template.ecoDesarrolloSeleccionada.set(false);
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
    var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
    	var meta = {
    		tipo: "ecodesarrollo"
    	}
    	if (!ecoDesarrollo._id) {
    		meta.pendiente = true;
    	} else {
    		meta.ecoDesarrolloId = ecoDesarrollo._id;
    	}
	    const upload = Images.insert({
	      file: e.originalEvent.dataTransfer.files[0],
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
        template.$(".camara .marco-drop").removeClass("activo");
      });
      upload.start();
    }
  },
  "click .camara .marco-upload"(e) {
    $("#upload-image").click();
  },
  "change #upload-image"(e, template) {
    var ecoDesarrollo = template.ecoDesarrolloSeleccionada.get();
    if (e.currentTarget.files && e.currentTarget.files[0]) {
	  	var meta = {
   			tipo: "ecodesarrollo"
    	}
    	if (!ecoDesarrollo._id) {
    		meta.pendiente = true;
    	} else {
    		meta.ecoDesarrolloId = ecoDesarrollo._id;
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
})
