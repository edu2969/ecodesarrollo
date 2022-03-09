import { ECOAcciones, ECOOrganizaciones } from '../../../lib/collections/ECODimensionesCollections';
import { Images } from '../../../lib/collections/FilesCollections';
import { LISTADO_MATERIALES } from '../../../lib/constantes';
import { UIUtils, FormUtils, IsEmpty } from '../../utils/utils';

Template.acciones.onCreated(function () {
  this.accionSeleccionada = new ReactiveVar(false);
  this.enListado = new ReactiveVar(true);
  this.editando = new ReactiveVar(false);

  Meteor.subscribe('eco_organizaciones');
  Meteor.subscribe('eco_organizaciones.participantes');
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
    query.tipo = "RM";
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
  },
  accion() {
    const data = Template.instance().accionSeleccionada.get();
    if (!data) return false;
    const accion = JSON.parse(JSON.stringify(data));
    const elementos = accion.materiales?.split(",");
    accion.materiales = elementos?.map((elemento) => {
      return LISTADO_MATERIALES.find((elem) => {
        return elem.id == elemento;
      });
    });
    const fr = moment(accion.fechaRetiro);
    const dif = moment().diff(fr, accion.periodicidad == "M" ? "month" : "week") + 1;
    accion.proximoRetiro = moment(fr).add(dif, accion.periodicidad == "M" ? "month" : "week").format("DD MMM'YY");
    const cuadrilla = ECOOrganizaciones.findOne({
      _id: accion.cuadrillasId
    });
    const imgC = Images.findOne({
      userId: cuadrilla.usuarioId,
      "meta.tipo": "ecoorganizacion",
    });
    cuadrilla.avatar = imgC?.link();
    const owner = Meteor.users.findOne({ _id: cuadrilla.usuarioId });
    cuadrilla.direccion = owner.profile.direccion;
    accion.cuadrilla = cuadrilla;

    accion.integrantes = cuadrilla.integrantes?.map((integrante) => {
      const img = Images.findOne({
        userId: integrante.usuarioId,
        meta: {},
      });
      const user = Meteor.users.findOne({ _id: integrante.usuarioId });
      const nombre = user.profile.nombre;
      const iniciales = nombre[0].charAt(0) + (nombre.length > 1 ? nombre[1].charAt(0) : "")
      return {
        nombre: nombre,
        direccion: user.profile.direccion,
        avatar: img ? img.link() : false,
        iniciales: iniciales
      }
    })
    return accion;
  }
});

Template.acciones.events({
  "autocompleteselect #input-cuadrilla"(event, template, doc) {
    $("#input-cuadrilla").val("");
    template.accionSeleccionada.set(doc._id);
  },
  "click ul"(e, template) {
    const id = e.currentTarget.id;
    if (!id) return;
    const entidad = ECOAcciones.findOne({ _id: id });
    template.enListado.set(false);
    template.accionSeleccionada.set(entidad)
    UIUtils.toggle("carrousel", "grilla");
    UIUtils.toggle("carrousel", "detalle");
    UIUtils.toggle("navegacion-atras", "activo");
  },
  "click .navegacion-atras"(e, template) {
    UIUtils.toggle("carrousel", "grilla");
    UIUtils.toggle("carrousel", "detalle");
    UIUtils.toggle("navegacion-atras", "activo");
    template.accionSeleccionada.set(false);
    template.editando.set(false);
    template.enListado.set(true);
    $(".detalle").scrollTop(0);
  },
  "click #btn-registrar-accion"(e, template) {
    $("#modalregistroacciones").modal("show");
  }

  /*
  @TODO

  Al registra la accion, registra
  fecha: fecha que selecciono
  arreglo de par material-cantidad revalorizada, ej: { material: "LAT", cantidad: 2 }
  puntos: cantidad de puntos que arbitrariamente asigna el corazon semilla o encargado ( no se)
  obs: Al llamar al metodo que guarda la accion, tiene que registrar tambien la fecha created_at, que es la fecha de creacion

  Meteor.call("Acciones.RegistrarAccion", parametros, callback (oculta el modal))
  */
})