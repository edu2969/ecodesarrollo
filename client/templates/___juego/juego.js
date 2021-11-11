let gameframe = 0, ctx, canvas;
var screen_width, screen_heigh;
var corazon, desecho, scoring;
var premios = [], textos = [];

screen_width = window.innerWidth;
screen_heigh = window.innerHeight;

const PI = Math.PI;

const textos_premiados = [
  ["Constante", "Bien", "Eso", "Ok", "Hecho", "Tuyo", "Yes", "Bueno"],
  ["Intermedio", "Muy Bien", "Eso es", "Ok", "Sigue", "Ufa", "WoW", "Amazing"],
  /*["Crack", "Oiga", "Con todo", "Vamos", "Sigue", "Buena", "Huy", "Buenisima"],
  ["Moustruoso", "Impresionante", "De lujo", "Colosal", "Destacable", "Alucinante", "Increible"],
  ["Profesional", "Potente", "Grandioso", "Cool", "Hermoso", "Despampanante", "Fenomenal"],
  ["Bestial", "Destacado", "Top", "Grandisimo", "Evolucionado", "Total", "OMG", "Yeah!", "Guau"],
  ["Capitan", "Fenomeno", "Maginifico", "Irreal", "Astral", "Topisimo", "Potente"],
  ["Maestro", "Espectacular", "Excepcional", "Loquisimo", "Infartante", "Durisimo", "Descuadrado"],
  ["Heroe", "Increible", "Awesome", "Killer", "Total", "Inparable", "Owned", "Magnanimo", "Talentoso"],
  ["Paranormal", "Fantasma", "Gigante", "Increible", "Para"],
  ["Anomalo", "Descuadrado"],
  ["Exorbitante", "Exhuberante", "Ensalsable", "Exotico", "Turbiante", "Ticky"],
  ["Mundial", "Continental", "Unico", "Excepcional", "Titanico"],
  ["Espacial", "Estelar", "Nebuloso", "Explosivo"],
  ["Extraterreste", "Marciano", "Avanzado", "Alienigena", "UFO"],
  ["Universal", "Lactico", "MetaVersal", "Paralelo", "Metafisico", "Luz", "Todo"],*/
]

// Resources
var resourceImages = {};
[
  { "cuerpo": { w: 371, h: 316, } }, { "brazo_der": { w: 85, h: 201, } },
  { "brazo_izq": { w: 133, h: 266, } }, { "piernas": { w: 333, h: 348, } },
  { "atrapa_01": { w: 204, h: 179, } }, { "atrapa_02": { w: 163, h: 176, } },
  { "rosa": { w: 99, h: 107, } }, { "cara_01": { w: 194, h: 149, } },
  { "cara_02": { w: 159, h: 165, } }, { "cara_03": { w: 176, h: 132, } },
  { "cara_04": { w: 173, h: 153, } }, { "cara_10": { w: 173, h: 151, } },
  { "cara_11": { w: 159, h: 199, } }, { "cara_12": { w: 174, h: 165, } },
  { "cara_f01": { w: 120, h: 137, } }, { "cara_f02": { w: 136, h: 134, } },
  { "cara_f03": { w: 149, h: 119, } }, { "cara_f04": { w: 189, h: 171, } },
  { "cara_f10": { w: 163, h: 154, } }, { "cara_f11": { w: 121, h: 135, } },
  { "cara_f12": { w: 145, h: 142, } },]
  .forEach((item) => {
    const llave = Object.keys(item)[0];
    var image = new Image();
    image.src = '/img/corazon/' + llave + '.png';
    resourceImages[llave] = {
      img: image,
      w: item[llave].w,
      h: item[llave].h,
    }
  });

class CorazonVerde {
  constructor(sexo) {
    this.x = screen_width - 240;
    this.y = screen_heigh - 380;
    this.frame = 0;
    this.sexo = sexo;
    this.atrapando = false;
    this.atrapa = false;
  }

  atrapar() {
    if (!this.atrapando) {
      this.atrapando = true;
    }
  }

  update() {
    ctx.clearRect(this.x - 10, this.y - 10, 371 + 20, 316 + 20);

    if (this.atrapando) {
      this.frame++;
      if (this.frame < 25) {
        this.atrapa = true;
      } else this.atrapa = false;
      if (this.frame > 250) {
        this.preparado();
      }
    }
  }

  preparado() {
    this.frame = 0;
    this.atrapando = false;
  }

  draw() {
    // Piernas
    ctx.drawImage(resourceImages["piernas"].img,
      0, 0, 333, 348,
      this.x + 15, this.y + 130,
      resourceImages["piernas"].w / 2, resourceImages["piernas"].h / 2);

    // Brazo der o atrapando
    if (!this.atrapando) {
      ctx.drawImage(resourceImages["brazo_der"].img,
        0, 0, 85, 201,
        this.x + 5, this.y + 90,
        resourceImages["brazo_der"].w / 2, resourceImages["brazo_der"].h / 2);
    } else {
      var brazo;
      if (this.frame < 25) {
        brazo = "atrapa_01";
      } else {
        brazo = "atrapa_02";
      }
      ctx.drawImage(resourceImages[brazo].img,
        0, 0, resourceImages[brazo].w, resourceImages[brazo].h,
        this.x - resourceImages[brazo].w / 2 + 20, this.y + 80,
        resourceImages[brazo].w / 2, resourceImages[brazo].h / 2);
    }

    // latido
    const totalFrames = 200;
    const animacion = gameframe % totalFrames;
    var factor = 1;
    if (animacion >= 50 && animacion < 75) {
      factor = 1 + (animacion % 25) / 5;
    } else if (animacion >= 75 && animacion < 100) {
      factor = 1 - (animacion % 25) / 5;
    } else if (animacion >= 100 && animacion < 125) {
      factor = 1 + (animacion % 25) / 5;
    } else if (animacion >= 125 && animacion < 150) {
      factor = 1 - (animacion % 25) / 5;
    }

    ctx.drawImage(resourceImages["cuerpo"].img,
      0, 0, 371, 316,
      this.x - factor / 2, this.y - factor / 2,
      resourceImages["cuerpo"].w / 2 + factor, resourceImages["cuerpo"].h / 2 + factor);

    // Brazo izq
    ctx.drawImage(resourceImages["brazo_izq"].img,
      0, 0, 133, 266,
      this.x + 135, this.y + 90,
      resourceImages["brazo_izq"].w / 2, resourceImages["brazo_izq"].h / 2);

    // Cara
    ctx.drawImage(resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"].img,
      0, 0,
      resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"].w,
      resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"].h,
      this.x + resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"].w / 2 - 12,
      this.y + 45,
      resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"].w / 2,
      resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"].h / 2);

    // Rosa
    if (this.sexo == "F") {
      ctx.drawImage(resourceImages["rosa"].img,
        0, 0, 99, 107,
        this.x + 108 - factor / 2, this.y - 25 - factor / 2,
        resourceImages["rosa"].w + factor, resourceImages["rosa"].h + factor);
    }
  }
}

var desechos = [
  [55, 81],
  [49, 118],
  [50, 119],
  [47, 90],
  [59, 95],
  [87, 139],
  [62, 213],
  [29, 71],
  [29, 71],
  [141, 87],
  [146, 72],
  [55, 137],
].map((par, index) => {
  const indice = (index < 9 ? "0" : "") + (index + 1);
  var img = new Image();
  img.src = '/img/desechos/desecho_' + indice + '.png';
  return {
    img: img,
    w: par[0],
    h: par[1],
  }
})

class Desecho {
  constructor() {
    this.x = 0;
    this.y = screen_heigh - 280;
    this.frame = 0;
    this.imagen = undefined;
    this.spriteHeight = 0;
    this.spriteWidth = 0;
    this.setImage();
    this.angle = 0;
    this.impacto = false;
    this.factor;
    this.atrapable = false;
    this.atrapado = false;
  }

  setImage() {
    const numeroDesecho = Math.floor(Math.random() * 12);
    this.imagen = desechos[numeroDesecho].img;
    this.spriteWidth = desechos[numeroDesecho].w;
    this.spriteHeight = desechos[numeroDesecho].h;
  }

  update() {
    const max = this.spriteWidth > this.spriteHeight ? this.spriteWidth : this.spriteHeight;
    const radio = PI * max * max;
    ctx.clearRect(this.x - radio / 2, this.y - radio / 2,
      radio + this.factor, radio + this.factor);

    if (!this.impacto && !this.atrapado) {
      this.x += 5;
      this.angle += 0.025;

      if (this.x > screen_width) {
        this.x = 0;
        this.setImage();
      }

      if (this.angle >= 360) {
        this.angle = 0;
      }

      if (this.x > (corazon.x - 280) && this.x < (corazon.x - 50)) {
        if (corazon.atrapa && !this.atrapado) {
          this.atrapado = true;
          premios.push(new Premio());
          scoring.acierto();
          textos.push(new Textos(scoring.nivel));
        }
      }

      if (this.x >= corazon.x) {
        this.impacto = true;
        this.angle = 0;
        this.imagen = new Image();
        this.imagen.src = '/img/desechos/golpe.png';
        this.spriteWidth = 188;
        this.spriteHeight = 174;
        scoring.resetear();
      }
    }

    if (!this.atrapado && this.impacto) {
      this.frame++;
      this.factor = 80 * Math.abs(Math.sin((50 - (this.frame % 50)) / 50));

      if (this.frame >= 100) {
        this.frame = 0;
        this.impacto = false;
        this.x = 0;
        this.factor = 0;
        this.setImage();
      }
    }

    if (this.atrapado) {
      this.frame++;
      if (this.frame > 500) {
        this.frame = 0;
        this.x = 0;
        this.angle = 0;
        this.atrapado = false;
        this.setImage();
      }
    }
  }

  draw() {
    if (!this.atrapado) {
      ctx.save();
      ctx.translate(this.x - this.factor / 2, this.y - this.factor / 2);
      ctx.rotate(this.angle);
      ctx.drawImage(this.imagen,
        0, 0, this.spriteWidth, this.spriteHeight,
        0 - this.spriteWidth / 2, 0 - this.spriteHeight / 2,
        this.spriteWidth + this.factor, this.spriteHeight + this.factor);
      ctx.restore();
    }
  }
}

class Premio {
  constructor() {
    this.x = corazon.x - 50;
    this.y = screen_heigh - 260;
    this.img = resourceImages["cuerpo"].img;
    this.spriteWidth = resourceImages["cuerpo"].w;
    this.spriteHeight = resourceImages["cuerpo"].h;
    this.frame = 0;
    this.direccionAngular = 0;
    this.angle = 0;
  }

  update() {
    this.frame++;
    ctx.clearRect(this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2,
      this.x + this.spriteWidth / 2, this.y + this.spriteHeight / 2);
    this.y -= 0.5; // 2

    // ZigZag angular
    if (this.direccionAngular == 0) {
      this.direccionAngular = Math.random() < 0.5 ? -1 : 1;
    }
    if (this.angle < -0.25) {
      this.direccionAngular = 1;
    }
    if (this.angle > 0.25) {
      this.direccionAngular = -1;
    }
    this.angle += this.direccionAngular * 0.01;
    if (Math.random() > 0.95) {
      this.direccionAngular *= -1;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = (400 - this.frame) / 400;
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, 0, 0, this.spriteWidth, this.spriteHeight,
      0 - this.spriteWidth / 12, 0 - this.spriteHeight / 12,
      this.spriteWidth / 6, this.spriteHeight / 6);
    ctx.restore();
  }
}

class Textos {
  constructor() {
    this.frame = 0;
    this.x = screen_width - 200;
    this.y = screen_heigh - 400;
    this.escala = 1;
    const clave = scoring.nivel > textos_premiados.length - 1 ? textos_premiados.length - 1 : scoring.nivel;
    const largo = textos_premiados[clave].length - 1;
    this.texto = textos_premiados[clave][Math.floor((Math.random() * largo) + 1)];
  }

  update() {
    this.frame += 0.5;
    this.escala += 0.1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = (100 - this.frame) / 100;
    ctx.font = 'bold ' + (48 + this.escala) + 'px Attack Of Monster';
    ctx.fillStyle = 'white';
    ctx.fillText(this.texto + " x" + scoring.hits, this.x - this.escala - this.texto.length * 24, this.y - this.escala * 2);
    ctx.restore();
  }
}

class Scoring {
  constructor() {
    this.hits = 0;
    this.nivel = 0;
    this.record = 0;
    this.x = screen_width - 320;
    this.y = 16;
  }

  resetear() {
    this.hits = 0;
    this.nivel = 0;
  }

  acierto() {
    this.hits++;
    if (this.hits % 20 == 0) {
      this.nivel++;
    }
    if (this.hits > this.record) {
      this.record = this.hits;
    }
  }

  update() {
    ctx.clearRect(this.x, this.y, 100, 80);
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 20px ArcadeClasic';
    const nivel = textos_premiados[this.nivel][0];
    ctx.fillText("Score: " + this.hits + " | Nivel: " + nivel + " | Record: " + this.record, this.x, this.y);
  }
}

Template.juego.rendered = () => {
  canvas = document.getElementById('canvas1');
  ctx = canvas.getContext('2d');

  canvas.width = screen_width;
  canvas.height = screen_heigh;

  scoring = new Scoring();

  corazon = new CorazonVerde("F");
  desecho = new Desecho();
  textos.push(new Textos());

  const animate = () => {
    gameframe++;

    // Updates
    corazon.update();
    desecho.update();
    premios.forEach((premio, index) => {
      premio.update();
      if (premio.frame > 400) {
        premios.splice(index, 1);
      }
    });
    textos.forEach((texto, index) => {
      texto.update();
      if (texto.frame > 100) {
        textos.splice(index, 1);
      }
    });
    scoring.update();

    // Draws
    corazon.draw();
    desecho.draw();
    premios.forEach((premio) => {
      premio.draw();
    })
    textos.forEach((texto) => {
      texto.draw();
    });
    scoring.draw();
    //console.log(corazon.x, desecho.x, corazon.atrapa, desecho.atrapable);
    requestAnimationFrame(animate);
  }

  animate();
}

Template.juego.events({
  "click #canvas1"(e, template) {
    corazon.atrapar();
  }
})