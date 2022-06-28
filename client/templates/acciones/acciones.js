import { Acciones } from '../../../lib/collections/BaseCollections';
import { ECOAcciones, ECOOrganizaciones } from '../../../lib/collections/ECODimensionesCollections';
import { Images } from '../../../lib/collections/FilesCollections';
import { MATERIALES } from '../../../lib/constantes';
import { UIUtils, FormUtils, IsEmpty } from '../../utils/utils';
import d3 from '/client/utils/d3';

const initChart = (ecoAccionId) => {
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

  const height = 240
  const width = 500

  d3.select("#historical-wraper *").remove();

  const svg = d3.select("#historical-wraper").append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const acciones = Acciones.find({ ecoAccionId: ecoAccionId });
  let maximo = -9999999;
  const data = [];

  acciones.forEach((accion) => {
    let valores = accion.valores;
    Object.keys(valores).forEach(key => {
      if (valores[key] > maximo) {
        maximo = valores[key];
      }
    })
    data.push({
      ...valores,
      date: accion.fecha,
    });
  });

  const paleta = ["yellow", "steelblue", "red", "white", "green", "purple", "skyblue", "black"];

  const lines = [];

  const unaAccion = Acciones.findOne({ ecoAccionId });
  Object.keys(unaAccion.valores).forEach((key) => {
    lines.push(d3.line()
      .defined(d => !isNaN(d[key]))
      .x(d => x(d.date))
      .y(d => y(d[key])));
  })
  console.log("LINES", lines);
  console.log("DATA", data);
  console.log("MAX", maximo);


  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain([0, maximo]).nice()
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

  for (let indice = 0; indice < lines.length; indice++) {
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", paleta[indice])
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", lines[indice]);
  }
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
    });
    return accion;
  },
  reloj() {
    const accion = Session.get("AccionSeleccionada");
    if (!accion) return false;
    console.log(Acciones.find({
      ecoAccionId: accion._id,
    }).map((accion) => {
      accion.detalle = Object.keys(accion.valores).map((key) => {
        return {
          material: key,
          valor: accion.valores[key],
        }
      });
      return accion;
    }));
    return Acciones.find({
      ecoAccionId: accion._id,
    }).map((accion) => {
      accion.detalle = Object.keys(accion.valores).map((key) => {
        return {
          material: key,
          valor: accion.valores[key],
        }
      })
      return accion;
    });
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
    Meteor.subscribe('eco_acciones.acciones', id);
    template.accionSeleccionada.set(entidad);
    Session.set("AccionSeleccionada", entidad);
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
  },
  "click #tab-grafico"() {
    const ecoAccionId = Session.get("AccionSeleccionada")._id;
    initChart(ecoAccionId);
  }
})