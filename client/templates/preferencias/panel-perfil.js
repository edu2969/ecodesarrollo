Template.panelPerfil.helpers({
  perfil() {
    const usuario = Meteor.user();
    const perfil = usuario.profile;
    perfil.pseudonimo = usuario.username;
    console.log(perfil);
    return perfil;
  }
})