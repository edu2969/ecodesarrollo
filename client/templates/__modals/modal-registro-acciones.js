import { Acciones } from "../../../lib/collections/BaseCollections";
import { ECOAcciones } from "../../../lib/collections/ECODimensionesCollections";
import { MATERIALES } from "../../../lib/constantes";
import { FormUtils, IsEmpty } from "../../utils/utils";

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
    const accion = Session.get("AccionSeleccionada");
    if (!accion || !accion.materiales) return false;
    return accion.materiales.split(',').map((material) => {
      return {
        siglas: material,
        unidad: MATERIALES[material].unidad,
      }
    });
  }
});

Template.modalregistroacciones.events({
  "click #btn-guardar"(e, template) {
    const customValidation = (invalido) => {
      const f = $("#input-fecha").val()
      if (IsEmpty(f)) {
        return invalido;
      }
      return invalido
    }

    let invalido = FormUtils.invalid("#modalregistroacciones")
    const doc = FormUtils.getFields("#modalregistroacciones");

    const accion = Session.get("AccionSeleccionada");

    if (accion._id) {
      doc._id = accion._id
    }

    invalido = customValidation(invalido)

    if (invalido) {
      template.errores.set(invalido)
      return false
    }

    let registro = {
      accionId: doc._id,
      fecha: doc.fecha,
      puntos: doc.puntos,
      valores: [],
    };

    delete doc._id;
    delete doc.fecha;
    delete doc.puntos;

    Object.keys(doc).forEach((key) => {
      registro.valores.push({
        material: key,
        valor: doc[key],
      });
    });

    console.log("CLIENTE DATA", registro);

    Meteor.call("ECOAcciones.RegistrarAccion", registro, function (err, resp) {
      if (!err) {
        Meteor.subscribe('eco_acciones.acciones', registro.ecoAccionId);
        Session.set("AccionSeleccionada", false);
        $("#modalregistroacciones").modal("hide");
      } else {
        console.error(err)
      }
    })
  }
})