Template.modalgeneral.helpers({
  params() {
    return Session.get("ModalParams");
  }
});

const callMethod = function(method, params) {
  Meteor.call(method, params, function(err, resp) {
    if(!err) {
      $("#modalgeneral").modal("hide");
    }
  })
}

Template.modalgeneral.events({
  "click #btn-aceptar"() {
    const params = Session.get("ModalParams");
    console.log("METHOD", params.method, params.params)
    callMethod(params.method, params.params)
  },
  "click #btn-rechazar"() {
    const params = Session.get("ModalParams");
    console.log("METHOD", params.method, params.params)
    callMethod(params.method, params.params)
  },
})