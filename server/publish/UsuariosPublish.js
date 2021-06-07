export { Images }

Meteor.publish('usuarios.comprobantes', function() {
  const usuarioId = this.userId;
	return Images.find({
    userId: usuarioId,
    "meta.tipo": "deposito"
  }).cursor;
});

Meteor.publish('usuarios.depositos', function() {
  const usuarioId = this.userId;
	return Depositos.find({ usuarioId: usuarioId });
});