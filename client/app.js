Session.setDefault("EstadoApp", {});

Template.body.helpers({
	enLogin() {
		return Session.get("EstadoApp").enLogin;
	},
});

Template.body.events({
	"click .nav-tab .tab"(e) {
		const id = e.currentTarget.id;
		const space = id.split("-")[1];
		$(".nav-tab .tab").removeClass("active");
		$(".nav-content-container .tab-container").hide();
		$("#" + id).addClass("active");
		$("#content-" + space).show();
	}
})