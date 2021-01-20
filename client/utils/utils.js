VERSION = "0.91";

ASIGNATURAS = {
	"HIST": {
		icon: "history_edu",
		label: "Historia"
	},
	"MATE": {
		icon: "calculate",
		label: "Matemáticas"
	},
	"INGL": {
		icon: "closed_caption",
		label: "Inglés"
	},
	"CIEN": {
		icon: "science",
		label: "Ciencias"
	},
	"ORIE": {
		icon: "explore",
		label: "Orientación"
	},
	"MUSI": {
		icon: "music_note",
		label: "Música"
	},
	"RELI": {
		icon: "add_location",
		label: "Religión"
	},
	"TECH": {
		icon: "memory",
		label: "Tecnología"
	},
}

EVALUACIONES = {
	"EX": {
		icono: 'military_tech',
		color: 'green',
		etiqueta: 'Excelente'
	},
	"MB": {
		icono: 'stars',
		color: 'limegreen',
		etiqueta: 'Muy Bien'
	},
	"BI": {
		icono: 'check_circle',
		color: 'yellow',
		etiqueta: 'Bien'
	},
	"ME": {
		icono: 'feedback',
		color: 'orange',
		etiqueta: 'Mejorable'
	},
	"SR": {
		icono: 'remove_circle',
		color: 'red',
		etiqueta: 'Sin realizar'
	},
	"OK": {
		icono: 'notifications_paused',
		color: 'lightgray',
		etiqueta: 'Sin revisar'
	}
}

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
  }
}