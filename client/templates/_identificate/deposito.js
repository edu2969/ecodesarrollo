import { Nivel } from "../../utils/nivel";

export { Images };

Template.deposito.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
})

Template.deposito.rendered = () => {
  Tracker.autorun(() => {
    Meteor.subscribe('usuarios.comprobantes');
    Nivel.setNivelUsuario();
  })
}

Template.deposito.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  },
  comprobante() {
    const img = Images.findOne({
      "meta.tipo": "deposito"
    }, { sort: { fecha: -1 }});
    return img ? img.link() : false;
  }
})

Template.deposito.events({
  "click input[name='tipo']"(e) {
    const value = e.currentTarget.value;
    $(".sector-tipo-comprobate .entrada").hide();
    $("#tipo-" + value).show();
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
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
	    const upload = Images.insert({
	      file: e.originalEvent.dataTransfer.files[0],
	      meta: {
          tipo: "deposito"
        }
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
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        meta: {
          tipo: "deposito"
        }
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

  "click #btn-guardar"(e, template) {
    const depositoConfirmado = () => {
      Session.set("ModalParams", {
        esInfo: true,
        titulo: "Confirmación de deposito",
        texto: "Tu información de deposito ha sido ingresada con éxito. " 
        + "Ésta será revisada para ser autorizada tu entrega de código secreto" 
      });
      $(".tipo-identificacion").toggleClass("oculto");
      $(".seccion-identificate").toggleClass("oculto");
      $("#modalgeneral").modal("show");
    }

    const tipo = $("input[type='radio']:checked").val();
    if(tipo == "texto") {
      const text = $("#input-detalle-deposito").val();
      Meteor.call("Usuarios.IngresarDepositoNoConfirmado", {
        tipo: "texto",
        texto: texto
      }, function(err, resp) {
        if(!err) {
          depositoConfirmado();
        }
      })
    } else {
      const img = Images.findOne({ "meta.tipo": "deposito" });
      Meteor.call("Usuarios.IngresarDepositoNoConfirmado", {
        tipo: "comprobante",
        imagenId: img._id
      }, function(err, resp) {
        if(!err) {
          depositoConfirmado();
        }
      });
    }
  }
})