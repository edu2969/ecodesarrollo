ECOOrganizaciones = new Meteor.Collection("ecoorganizaciones");
ECOOrganizaciones.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

ECOCampanas = new Meteor.Collection("ecocampanas");
ECOCampanas.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

ECOSos = new Meteor.Collection("ecosos");
ECOSos.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

ECODesarrollos = new Meteor.Collection("ecodesarrollos");
ECODesarrollos.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

Depositos = new Meteor.Collection("depositos");
Depositos.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

Regiones = new Meteor.Collection("regiones");
Regiones.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

Comunas = new Meteor.Collection("comunas");
Comunas.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});
