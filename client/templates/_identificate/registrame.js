Template.registrame.onCreated(function() {
	this.paso = new ReactiveVar(1);
});

Template.registrame.helpers({
	pasoCompletado(paso) {
		const template = Template.instance().paso.get();
		const pasoActual = template.paso.get();
		return paso == ( pasoActual + 1 )
	}
});

Template.registrame.events({
	"click .navegador .boton"(e, template) {
		var clase = e.currentTarget.classList.value;
		var paso = template.paso.get();
		if( clase.indexOf("izquierda")!=-1 && paso > 1 ) {
			if(paso==2) {
				UIUtils.toggle("izquierda", "deshabilitado");
			}
			if(paso==4) {
				UIUtils.toggle("derecha", "deshabilitado");
			}
			UIUtils.toggle("carrousel", "paso" + paso);
			template.paso.set(paso - 1);
			UIUtils.toggle("carrousel", "paso" + ( paso - 1 ) );
		} else if( clase.indexOf("derecha")!=-1 && paso < 4 ) {
			if(paso==1) {
				UIUtils.toggle("izquierda", "deshabilitado");
			}
			if(paso==3) {
				UIUtils.toggle("derecha", "deshabilitado");
			}			
			UIUtils.toggle("carrousel", "paso" + paso);
			template.paso.set(paso + 1);
			UIUtils.toggle("carrousel", "paso" + ( paso + 1 ) );
		} 
	},
	
})