export const VERSION = "2.0"

import { Images } from '../../lib/collections/FilesCollections'

export const IsEmpty = (valor) => {
  return (Object.keys(valor).length === 0 && valor.constructor === Object) || (valor == "")
}

export const UIUtils = {
  toggleVisible: (global, selector) => {
    var elementos = document.querySelectorAll("." + global);
    for (var i = 0; i < elementos.length; i++) {
      elementos[i].style.display = 'none';
    }
    document.querySelector("." + global + "." + selector)
      .style.display = 'block';
  },
  toggleClass: (global, selector, clase) => {
    var elementos = document.querySelectorAll("." + global);
    for (var i = 0; i < elementos.length; i++) {
      elementos[i]
        .classList
        .remove(clase);
    }
    document
      .querySelector("." + global + "." + selector)
      .classList
      .add(clase);
  },
  toggle: (selector, clase) => {
    var elementos = document.querySelectorAll("." + selector);
    for (var i = 0; i < elementos.length; i++) {
      elementos[i]
        .classList
        .toggle(clase);
    }
  }
}
// este ulilitario recibe y recorre el formulario ,luego  lo deja en un arreglo Json doc.
export const FormUtils = {
  getFields: () => {
    let doc = {};
    $(".formulario .campo").each((indice, campo) => {
      const id = campo.id
      const nombreCampo = id.split("-")[1]
      const clases = campo.classList.value
      if (clases && clases.indexOf('datetime-componente') != -1) {
        doc[nombreCampo] = moment(campo.value, 'DD/MM/YYYY').toDate()
      } else doc[nombreCampo] = campo.value
    })
    return doc;
  },
  invalid() {
    let doc = {}
    $(".formulario .campo").each((indice, campo) => {
      const id = campo.id
      const required = campo.attributes["required"]
      if (required) {
        const etiqueta = campo.attributes["aria-label"].value
        if (IsEmpty(campo.value)) {
          const nombreCampo = id.split("-")[1]
          doc[nombreCampo] = etiqueta + " es requerido"
        }
      }
    })
    if (doc == {}) {
      return false
    }
    return doc
  }
}
