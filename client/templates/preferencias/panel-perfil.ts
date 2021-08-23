import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { INTERESES } from '../../../lib/constantes'
const { Images } = require('/lib/collections/FilesCollections')
import { FormUtils, MaskPrice } from '../../utils/utils'

Template.panelPerfil.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
})

Template.panelPerfil.rendered = function () {
  Meteor.subscribe('usuarios.profile')
  $("#input-fechaNacimiento").datetimepicker({
    locale: moment.locale("es"),
    format: "DD/MM/YYYY",
    defaultDate: moment().startOf("day").hour(8).subtract(18, "years"),
  });
}

Template.panelPerfil.helpers({
  perfil() {
    const usuario = Meteor.user();
    const perfil = usuario.profile;
    perfil.pseudonimo = usuario.username;
    const nombre = perfil.nombre.split(" ");
    perfil.iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
    const avatar = Images.findOne({
      userId: usuario._id,
      meta: {}
    });
    if (avatar) {
      perfil.avatar = avatar.link();
    }
    if (perfil.rol == 1) perfil.esAdmin = true
    const intereses = perfil.intereses
    perfil.intereses = INTERESES.map((interes) => {
      return {
        etiqueta: interes,
        seleccionado: intereses.indexOf(interes) != -1,
      }
    })
    return perfil
  }
})

Template.panelPerfil.events({
  "click .marco-editar"() {
    $(".marco-informacion").hide()
    $(".formulario-edicion").show()
  },
  "click #btn-cancelar"() {
    $(".marco-informacion").show()
    $(".formulario-edicion").hide()
  },
  "click #btn-guardar"() {
    const direccion = $("#input-direccion").val();
    const doc = FormUtils.getFields();
    Meteor.call("Usuarios.ModificarCuenta", doc, function (err, resp) {
      if (!err) {
        $(".marco-informacion").show()
        $(".formulario-edicion").hide()
      } else console.error(err)
    })
  },

  "dragover .marco-avatar": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".marco-drop").addClass("drop");
  },
  "dragleave .marco-avatar": function (e, t) {
    e.stopPropagation();
    e.preventDefault();
    t.$(".marco-drop").removeClass("drop")
  },
  "dragenter .marco-avatar": function (e, t) {
    e.preventDefault();
    e.stopPropagation();
  },
  "drop .marco-avatar": function (e, template) {
    e.stopPropagation();
    e.preventDefault();
    if (e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0]) {
      const usuarioId = Meteor.userId();
      Images.remove({
        userId: usuarioId,
        meta: {}
      });
      const upload = Images.insert({
        file: e.originalEvent.dataTransfer.files[0],
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
        template.$(".marco-drop").removeClass("drop");
      });
      upload.start();
    }
  },
  "click .marco-upload"(e) {
    $("#upload-image").click();
  },
  "change #upload-image"(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      Images.remove({
        userId: Meteor.userId(),
        meta: {}
      });
      const upload = Images.insert({
        file: e.currentTarget.files[0]
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        template.currentUpload.set(false);
        template.$(".marco-drop").removeClass("drop");
      });

      upload.start();
    }
  },
  "click .caluga"(e, template) {
    e.currentTarget.classList.toggle("seleccionado")
  },
  "focusout #input-rut"(e) {
    let rut = e.currentTarget.value
    rut = rut.replace(/\./g, "").replace(/\-/, "")
    const dv = rut.substring(rut.length - 1)
    const nuevoRut = MaskPrice(rut.substring(0, rut.length - 1)) + "-" + dv
    $("#input-rut").val(nuevoRut)
  },
  "click .marco-agente-seleccionable"(e) {
    let sexo = e.currentTarget.attributes["sexo"].value
    $("#input-sexo").val(sexo)
    $(".marco-agente-seleccionable").removeClass("seleccionado")
    e.currentTarget.classList.toggle("seleccionado")
  }
})