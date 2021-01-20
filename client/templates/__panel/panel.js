Template.panel.onCreated(function () {

});

Template.panel.rendered = function () {
  let estado = Session.get("EstadoApp");
	
	let home = estado.esAlumno ? 'agenda' : 
	estado.esProfesor ? 'entregas' : 
	estado.esAdmin ? 'cuentas' : 'panel-gestion';	
	
	UIUtils.toggleVisible('area', home);  
}

Template.panel.helpers({
  esAlumno() {
    return Session.get("EstadoApp").esAlumno;
  },
  esProfesor() {
    return Session.get("EstadoApp").esProfesor;
  },
  esDirector() {
    return Session.get("EstadoApp").esDirector;
  },
  esAdmin() {
    return Session.get("EstadoApp").esAdmin;
  }
})

Template.panel.events({
  "click .accion"(e) {
    var item = e.currentTarget.classList[1];
    UIUtils.toggleClass('accion', item, 'activo');
    UIUtils.toggleVisible('area', item);

    if (item == "logros") {
      var width = window.innerWidth;
      var arreglo = [{
        selector: "calorias",
        color: "green",
        valor: 20
      }, {
        selector: "horas",
        color: "red",
        valor: 67
      }, {
        selector: "kilos",
        color: "purple",
        valor: 40
      }];
      arreglo.forEach(function (item) {
        new DashTimer('.graficos .' + item.selector).init({
          height: width / 3 - 16,
          width: width / 3 - 16,
          start: {
            fill: "white"
          },
          finish: {
            fill: item.color
          },
          values: {
            classes: 'texto-central'
          }
        }).setData([{
          immediate: {
            angle: true
          },
          start: {
            angle: 1,
            fill: item.color
          },
          finish: {
            angle: item.valor,
            fill: item.color
          }
        }, {
          values: {
            show: true
          }
        }]).start(1000, 0, item.valor / 100);
      });


      renderMultiTimer();
    }
  },
  "click .menu, click .contenedor-menu .cruz"() {
    document.querySelector(".contenedor-menu").classList.toggle("activo");
  },
  "click .modal .cruz"(e) {
    e.currentTarget.parentElement.parentElement.classList.remove("activo");
  }
});

function renderMultiTimer() {
  var clockOptions = {
    start: {
      fill: "white"
    },
    finish: {
      fill: 'green'
    },
    values: {
      classes: "texto-central",
      styles: "text-anchor:middle;",
      color: 'white',
      show: true
    }
  };

  var timer = new DashTimer('.grafico-solo .resumen')
    .init(clockOptions)
    .setData(getClockData(), {
      values: {
        show: true
      }
    })
    .start(1000, 0.5);
}

function getClockData() {
  return [{
      dataName: "constancia",
      start: {
        angle: 0,
        outerRatio: .7,
        innerRatio: .55,
        fill: '#B3E5FC'
      },
      finish: {
        angle: 0.8,
        outerRatio: .7,
        innerRatio: .55,
        fill: '#B3E5FC'
      }
    }, {
      dataName: "progreso",
      start: {
        angle: 0,
        outerRatio: .85,
        innerRatio: .7,
        fill: '#F0F4C3'
      },
      finish: {
        angle: 0.55,
        outerRatio: .85,
        innerRatio: .7,
        fill: '#F0F4C3'
      }
    }
  ];
}