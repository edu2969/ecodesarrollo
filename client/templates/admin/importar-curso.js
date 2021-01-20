Template.importarcurso.events({
  "change input[type='file']"(event) {
    console.log("ACA!");
    const file = event.currentTarget.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = function (e) {
      const data = e.target.result;
      const name = file.name;
      var doc = {};
			var cursos = {};

      Meteor.call(rABS ? 'uploadS' : 'uploadU',
                  rABS ? data : new Uint8Array(data),
                  name,
                  function (err, wb) {
        if (err) throw err;
				for(let curso = 0; curso < wb.SheetNames.length; curso++ ) {
					const ws = wb.Sheets[wb.SheetNames[curso]];
					var columnas = ["rut", "nombres"];
					let j = 1;
					var registros = [];
					cursos[wb.SheetNames[curso]] = [];
					while (ws["A" + j]) {						
						var rut = ws["A" + j].v;
						var nombreCompleto = ws["B" + j].v.split(" ");
						var nombres = nombreCompleto.slice(2, nombreCompleto.length);
						var apellidos = nombreCompleto.slice(0, 2);						
						cursos[wb.SheetNames[curso]].push({
							rut: rut, 
							nombres: nombres, 
							apellidos: apellidos
						})
						j++;						
					}
					doc[wb.SheetNames[curso]] = cursos[wb.SheetNames[curso]];
				}

				Meteor.call("IngresarAlumnos", doc, function(err, resp) {
          if(!err) {
            console.log("TODO CORRECTO!");
          } else {
						console.log("UPS... algo malo ocurrio", err);
					}
        });
      });
      $("input[type='file']").val("");
    }
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  },
})