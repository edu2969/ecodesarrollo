import { ECOAcciones, ECOOrganizaciones } from '../../../lib/collections/ECODimensionesCollections';
import { Images } from '../../../lib/collections/FilesCollections';
import { MATERIALES } from '../../../lib/constantes';
import { UIUtils, FormUtils, IsEmpty } from '../../utils/utils';
import d3 from '/client/utils/d3';

const initChart = () => {
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

  const height = 240
  const width = 500

  const svg = d3.select("#historical-wraper").append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const lineC = d3.line()
    .defined(d => !isNaN(d.compost))
    .x(d => x(d.date))
    .y(d => y(d.compost));

  const lineP = d3.line()
    .defined(d => !isNaN(d.plastico))
    .x(d => x(d.date))
    .y(d => y(d.plastico));

  const lineO = d3.line()
    .defined(d => !isNaN(d.otros))
    .x(d => x(d.date))
    .y(d => y(d.otros));

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.compost)]).nice()
    .range([height - margin.bottom, margin.top])

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", lineC);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "yellow")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", lineP);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "limegreen")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", lineO);
}

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

Template.acciones.rendered = function () {
  initChart();
}

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
      const material = MATERIALES[elemento];
      material.id = elemento;
      return material;
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
    console.log(accion);
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
    Session.set("AccionSeleccionada", template.accionSeleccionada.get());
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


const data = [{
  "date": new Date("2019-07-01T00:00:00.000Z"),
  "compost": 13.24,
  "plastico": 25.10,
  "otros": 22.90,
}, {
  "date": new Date("2019-08-01T00:00:00.000Z"),
  "compost": 33.24,
  "plastico": 45.10,
  "otros": 12.90,
}, {
  "date": new Date("2019-09-01T00:00:00.000Z"),
  "compost": 33.24,
  "plastico": 35.10,
  "otros": 22.90,
}, {
  "date": new Date("2019-10-01T00:00:00.000Z"),
  "compost": 43.24,
  "plastico": 15.10,
  "otros": 2.90,
}, {
  "date": new Date("2019-11-01T00:00:00.000Z"),
  "compost": 32.9,
  "plastico": 15.10,
  "otros": 26.90,
}, {
  "date": new Date("2019-12-01T00:00:00.000Z"),
  "compost": 93.24,
  "plastico": 35.10,
  "otros": 22.90,
}, {
  "date": new Date("2019-13-01T00:00:00.000Z"),
  "compost": 23.24,
  "plastico": 75.10,
  "otros": 37.90,
}, {
  "date": new Date("2019-14-01T00:00:00.000Z"),
  "compost": 66.24,
  "plastico": 65.10,
  "otros": 55.90,
}, {
  "date": new Date("2019-15-01T00:00:00.000Z"),
  "compost": 13.24,
  "plastico": 25.10,
  "otros": 92.90,
}, {
  "date": new Date("2019-16-01T00:00:00.000Z"),
  "compost": 110.24,
  "plastico": 4.10,
  "otros": 17.90,
}, {
  "date": new Date("2019-17-01T00:00:00.000Z"),
  "compost": 23.24,
  "plastico": 35.10,
  "otros": 42.90,
}, {
  "date": new Date("2019-18-01T00:00:00.000Z"),
  "compost": 13.24,
  "plastico": 25.10,
  "otros": 3.90,
}]