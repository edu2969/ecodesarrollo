import { Meteor } from 'meteor/meteor'

export const Depositos = new Meteor.Collection("depositos");
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

export const Regiones = new Meteor.Collection("regiones");
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

export const Comunas = new Meteor.Collection("comunas");
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

export const Notificaciones = new Meteor.Collection("notificaciones");
Notificaciones.allow({
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
