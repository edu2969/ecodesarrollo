Template.home.events({
  "click button"() {
    document.querySelector("#modalcreditos")
      .classList.add("activo");
  },
  "click .barra"(e) {
    e.currentTarget.classList.toggle("gris");
    e.currentTarget.classList.toggle("verde");
  }
})