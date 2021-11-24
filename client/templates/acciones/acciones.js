import { ECOAcciones, ECOOrganizaciones } from '../../../lib/collections/ECODimensionesCollections'

Template.acciones.onCreated(function () {
  this.accionSeleccionada = new ReactiveVar(false);

  Meteor.subscribe('eco_organizaciones')
  Meteor.subscribe('eco_organizaciones.imagenes');
  this.autorun(() => {
    Meteor.subscribe('eco_acciones');
    Meteor.subscribe('eco_acciones.celulas');
    Meteor.subscribe('eco_acciones.donaciones');
  });
})

Template.acciones.helpers({
  settingsCuadrillas() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          collection: ECOOrganizaciones,
          field: "nombre",
          matchAll: false,
          template: Template.cuadrilla,
          noMatchTemplate: Template.noComuna,
        }
      ]
    };
  },
  resultado() {
    const cuadrillaId = Template.instance().accionSeleccionada.get();
    const query = cuadrillaId ? { cuadrillasId: cuadrillaId } : {};
    return ECOAcciones.find(query).map((item, indice) => {
      const fr = moment(item.fechaRetiro);
      const dif = moment().diff(fr, item.periodicidad == "M" ? "month" : "week") + 1;
      const proxima = moment(fr).add(dif, item.periodicidad == "M" ? "month" : "week");
      const cuadrilla = ECOOrganizaciones.findOne({ _id: item.cuadrillasId });
      return {
        id: item._id,
        nombreCuadrilla: cuadrilla ? cuadrilla.nombre : "",
        indice: indice + 1,
        fechaRetiro: proxima.format("DD MMM'YY"),
        estado: item.estado,
      }
    }).sort((a, b) => {
      return moment(a.fechaRetiro, "DD MMM'YY").isAfter(moment(b.fechaRetiro, "DD MMM'YY")) ? 1 : 1;
    });
  },
  cuadrillaSeleccionada() {
    const cuadrillaId = Template.instance().accionSeleccionada.get();
    const cuadrilla = ECOOrganizaciones.findOne({ _id: cuadrillaId });
    return cuadrilla.nombre;
  }
});

Template.acciones.events({
  "autocompleteselect #input-cuadrilla"(event, template, doc) {
    $("#input-cuadrilla").val("");
    template.accionSeleccionada.set(doc._id);
  },
  "click ul"(e, template) {
    console.log(e.currentTarget.id);
  }
})