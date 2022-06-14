import { Meteor } from 'meteor/meteor'

export const EsAdmin = (rol: number) => {
  if(!rol) {
    rol = Meteor.user()?.profile.rol;
  }
  return rol & 1;
}

export const EsEquipoBase = (rol: number) => {
  if(!rol) {
    rol = Meteor.user()?.profile.rol;
  }
  return rol & 2;
}

export const EsLiderCampana = (rol: number) => {
  if(!rol) {
    rol = Meteor.user()?.profile.rol;
  }
  return rol & 4;
}

export const EsCorazonVerde = (rol: number) => {
  if(!rol) {
    rol = Meteor.user()?.profile.rol;
  }
  return rol & 64;
}