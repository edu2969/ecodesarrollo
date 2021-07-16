const { Depositos } = require("../../lib/collections/BaseCollections");
const { Images } = require("../../lib/collections/FilesCollections");

Meteor.publish('usuarios.profile', function () {
  const usuarioId = this.userId
  return Images.find({
    userId: usuarioId,
    meta: {}
  }).cursor
})

Meteor.publish('usuarios.comprobantes', function () {
  const usuarioId = this.userId;
  return Images.find({
    userId: usuarioId,
    "meta.tipo": "deposito"
  }).cursor;
});

Meteor.publish('usuarios.depositos', function () {
  const usuarioId = this.userId;
  return Depositos.find({ usuarioId: usuarioId });
});

Meteor.publishComposite('usuarios.coordinadores', function () {
  return {
    find() {
      return Meteor.users.find({}, {
        fields: {
          "profile.nombre": 1
        }
      })
    },
    children: [{
      find(usuario) {
        return Images.find({ userId: usuario._id }, { meta: {} }).cursor
      }
    }]
  }
})