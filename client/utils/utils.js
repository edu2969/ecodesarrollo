VERSION = "0.91";

IsEmpty = (valor) => {
	return Object.keys(valor).length === 0 && valor.constructor === Object
}

UIUtils = {
  toggleVisible: (global, selector) => {  
    var elementos = document.querySelectorAll("." + global);
    for(var i=0; i < elementos.length; i++) {
      elementos[i].style.display = 'none';
    }  
    document.querySelector("." + global + "." + selector)
      .style.display = 'block';
  },
  toggleClass: (global, selector, clase) => {
    var elementos = document.querySelectorAll("." + global);
    for(var i=0; i < elementos.length; i++) {
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
    for(var i=0; i < elementos.length; i++) {
      elementos[i]
        .classList
        .toggle(clase);
    }
	}
}
// este ulilitario recibe y recorre el formulario ,luego  lo deja en un arreglo Json doc.
FormUtils = {
	getFields: () => {
		let doc = {};
		$(".formulario .campo").each((indice, campo)=> {
			const id = campo.id;
			const nombreCampo = id.split("-")[1];
			doc[nombreCampo] = campo.value;
		});
		return doc;
	}
}
