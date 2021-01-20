Template.foto.helpers({
	foto() {
		return Session.get("ImagenSeleccionada");
	}
})

Template.foto.events({
	"click .marco-foto-full .cruz"() {
    document.querySelector(".marco-foto-full")
			.classList.toggle("activo");
	},
})