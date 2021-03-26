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