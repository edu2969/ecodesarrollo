Template.codigoSecreto.events({
  "click #btn-guardar"() {
    Meteor.call("Usuarios.CodigoSecreto", {
      codigo: $("#input-codigo").val()
    }, function(err, resp) {
      if(!err) {
        Session.set("ModalParams", {
          esInfo: true,
          titulo: "Código correcto!",
          texto: "Ya eres un corazón verde Nivel2!. " 
          + "Desde ahora participa en las diversas " 
          + "ECO-Dimensiones y acumula puntos. Felicidades!" 
        });
        $(".tipo-identificacion").toggleClass("oculto");
        $(".seccion-identificate").toggleClass("oculto");
        $("#modalgeneral").modal("show");
      }
    })
  }
})