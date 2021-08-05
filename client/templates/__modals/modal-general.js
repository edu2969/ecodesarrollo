Template.modalgeneral.helpers({
  params() {
    return Session.get("ModalParams");
  }
});

const callMethod = function (method, params) {
  Meteor.call(method, params, function (err, resp) {
    if (!err) {
      $("#modalgeneral").modal("hide");
    }
  })
}

Template.modalgeneral.events({
  "click #btn-aceptar"() {
    const params = Session.get("ModalParams");
    callMethod(params.methodAccept, params.params)
  },
  "click #btn-rechazar"() {
    const params = Session.get("ModalParams");
    callMethod(params.methodReject, params.params)
  },
  "click #btn-si"() {
    const params = Session.get("ModalParams")
    callMethod(params.method, params.params)
  }
})