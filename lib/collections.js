Tareas = new Meteor.Collection("tareas");
Tareas.allow({
  insert() {
    return true;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  }
});

Entregas = new Meteor.Collection("entregas");
Entregas.allow({
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