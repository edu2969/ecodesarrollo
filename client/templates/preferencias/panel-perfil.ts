import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
const { Images } = require('/lib/collections/FilesCollections')

Template.panelPerfil.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
})

Template.panelPerfil.rendered = function () {
  Meteor.subscribe('usuarios.profile')
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
    return perfil;
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
})