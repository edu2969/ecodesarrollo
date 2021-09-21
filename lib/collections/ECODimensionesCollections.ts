import { Meteor } from 'meteor/meteor'

export const ECOOrganizaciones = new Meteor.Collection("ecoorganizaciones");
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

export const ECOCampanas = new Meteor.Collection("ecocampanas");
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

export const ECOSos = new Meteor.Collection("ecosos");
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

export const ECODesarrollos = new Meteor.Collection("ecodesarrollos");
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

export const Participaciones = new Meteor.Collection("participaciones");
Participaciones.allow({
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
