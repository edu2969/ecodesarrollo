const iniciarTimePickers = () => {
  setTimeout(function () {
    $("#input-fecha").datetimepicker({
      locale: moment.locale("es"),
      format: "DD/MM/YYYY",
      defaultDate: moment().startOf("day").hour(8),
    });
  }, 250)
}

Template.modalregistroacciones.rendered = function () {
  iniciarTimePickers();
}

Template.modalregistroacciones.helpers({
  materiales() {
    return [{
      siglas: 'LAT',
      unidad: 'Tons',
    }, {
      siglas: 'LAT',
      unidad: 'Tons',
    }, {
      siglas: 'LAT',
      unidad: 'Tons',
    },]
  }
});

Template.modalregistroacciones.events({
  "click #btn-guardar"(e, template) {

  }
})