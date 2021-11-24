let gameframe = 0, ctx, canvas;
var screen_width, screen_height;
var corazon, scoring;
var premios = [], textos = [], desechos = [], golpes = [];

screen_width = window.innerWidth;
screen_height = window.innerHeight;

var s_f = 300 / 815 / screen_height;

const PI = Math.PI;

const textos_premiados = [
  ["Principiante", "Bien", "Eso", "Ok", "Hecho", "Tuyo", "Yes", "Bueno"],
  ["Intermedio", "Muy Bien", "Eso es", "Ok", "Sigue", "Ufa", "WoW", "Amazing"],
  ["Crack", "Oiga", "Con todo", "Vamos", "Sigue", "Buena", "Huy", "Buenisima"],
  ["Moustruoso", "Impresionante", "De lujo", "Colosal", "Destacable", "Alucinante", "Increible"],
  ["Profesional", "Potente", "Grandioso", "Cool", "Hermoso", "Despampanante", "Fenomenal"],
  ["Bestial", "Destacado", "Top", "Grandisimo", "Evolucionado", "Total", "OMG", "Yeah!", "Guau", "Letal"],
  ["Capitan", "Fenomeno", "Maginifico", "Irreal", "Astral", "Topisimo", "Potente"],
  ["Maestro", "Espectacular", "Excepcional", "Loquisimo", "Infartante", "Durisimo", "Descuadrado"],
  ["Heroe", "Increible", "Awesome", "Killer", "Total", "Inparable", "Owned", "Magnanimo", "Talentoso"],
  ["Paranormal", "Fantasma", "Gigante", "Increible", "Para", "Anonadadante"],
  ["Anomalo", "Descuadrado", "Detente", "Cuantico", "Caotico", "Revolucionario", "The One", "Perplejante"],
  ["Exorbitante", "Exhuberante", "Ensalsable", "Exotico", "Turbiante", "Ticky"],
  ["Mundial", "Continental", "Unico", "Excepcional", "Titanico"],
  ["Espacial", "Estelar", "Nebuloso", "Explosivo", "Atomico", "Nuclear"],
  ["Extraterreste", "Marciano", "Avanzado", "Alienigena", "UFO"],
  ["Universal", "Lactico", "MetaVersal", "Paralelo", "Metafisico", "Luz", "Todo"],
]

// Resources
var resourceImages = {};
[
  { "cuerpo": { w: 371, h: 316, offset: [0, 0] } },
  { "brazo_der": { w: 85, h: 201, offset: [5, 190] } },
  { "brazo_izq": { w: 133, h: 266, offset: [255, 170] } },
  { "piernas": { w: 333, h: 348, offset: [15, 220] } },
  { "atrapa_01": { w: 204, h: 179, offset: [-80, 180] } },
  { "atrapa_02": { w: 163, h: 176, offset: [-80, 180] } },
  { "rosa": { w: 192, h: 182, offset: [0, 0] } },
  { "cara_01": { w: 194, h: 149, offset: [85, 95] } },
  { "cara_02": { w: 159, h: 165, offset: [80, -10] } },
  { "cara_03": { w: 176, h: 132, offset: [0, 0] } },
  { "cara_04": { w: 173, h: 153, offset: [0, 0] } },
  { "cara_10": { w: 173, h: 151, offset: [-25, -15] } },
  { "cara_11": { w: 159, h: 199, offset: [-20, -20] } },
  { "cara_12": { w: 174, h: 165, offset: [-20, -20] } },
  { "cara_f01": { w: 120, h: 137, offset: [98, 75] } },
  { "cara_f02": { w: 136, h: 134, offset: [0, 0] } },
  { "cara_f03": { w: 149, h: 119, offset: [0, 0] } },
  { "cara_f04": { w: 189, h: 171, offset: [0, 0] } },
  { "cara_f10": { w: 163, h: 154, offset: [-10, -20] } },
  { "cara_f11": { w: 121, h: 135, offset: [0, 0] } },
  { "cara_f12": { w: 145, h: 142, offset: [-10, 0] } },]
  .forEach((item) => {
    const llave = Object.keys(item)[0];
    var image = new Image();
    image.src = '/img/corazon/' + llave + '.png';
    resourceImages[llave] = {
      img: image,
      w: item[llave].w,
      h: item[llave].h,
      offset: item[llave].offset,
    }
  });

class CorazonVerde {
  constructor(sexo) {
    this.sh_f = screen_height / 1024;
    this.x = screen_width - 2.25 * 200 * this.sh_f;
    this.y = screen_height * 0.30;
    this.frame = 0;
    this.sexo = sexo;
    this.atrapando = false;
    this.atrapa = false;
    this.preparado = false;
    this.golpeado = false;
    this.caraGolpe = 0;
    this.frameGolpe = 0;
  }

  atrapar() {
    if (!this.atrapando) {
      this.atrapando = true;
    } else if (this.preparado) {
      this.preparado = false;
      this.frame = 0;
      this.atrapando = true;
      this.atrapa = false;
    }
  }

  update() {
    ctx.save();
    ctx.translate(this.x - 80, this.y - 32);
    ctx.scale(this.sh_f, this.sh_f);
    ctx.clearRect(0, 0, 371 + 180, 316 + 320);
    ctx.restore();

    if (this.atrapando) {
      this.frame++;
      if (this.frame < 25) {
        this.atrapa = true;
      } else this.atrapa = false;
      if (this.frame > 250) {
        this.frame = 0;
        this.atrapando = false;
        this.preparado = false;
      }
    }

    if (this.golpeado) {
      this.frameGolpe++;
      if (this.frameGolpe > 200) {
        this.frameGolpe = 0;
        this.golpeado = false;
      }
    }
  }

  iniciarGolpe() {
    this.golpeado = true;
    this.frameGolpe = 0;
    this.caraGolpe = Math.floor(Math.random() * 3) + 10;
  }

  draw() {
    const drawImage = (key) => {
      var resource = resourceImages[key];
      ctx.drawImage(resource.img, 0, 0, resource.w, resource.h,
        resource.offset[0], resource.offset[1], resource.w, resource.h);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.sh_f, this.sh_f);
    drawImage("piernas");

    // Brazo der o atrapando
    if (!this.atrapando) {
      drawImage("brazo_der");
    } else {
      var brazo;
      if (this.frame < 25) {
        brazo = "atrapa_01";
      } else {
        brazo = "atrapa_02";
      }
      drawImage(brazo);
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

    // Cuerpo
    ctx.drawImage(resourceImages["cuerpo"].img,
      0, 0, resourceImages["cuerpo"].w, resourceImages["cuerpo"].h,
      - (factor / 2) * this.sh_f, - (factor / 2) * this.sh_f,
      resourceImages["cuerpo"].w + (factor / 2) * this.sh_f,
      resourceImages["cuerpo"].h + (factor / 2) * this.sh_f);

    drawImage("brazo_izq");

    // Cara
    if (!this.golpeado) {
      const resource = resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + "01"];
      ctx.drawImage(resource.img, 0, 0,
        resource.w, resource.h,
        resource.offset[0] - (factor / 2) * this.sh_f, resource.offset[1] - (factor / 2) * this.sh_f,
        resource.w + (factor / 2) * this.sh_f, resource.h + (factor / 2) * this.sh_f);
    } else {
      const resource = resourceImages["cara_" + (this.sexo == "F" ? "f" : "") + this.caraGolpe];
      const offset = resource.offset;
      ctx.drawImage(resource.img, 0, 0, resource.w, resource.h,
        102 + offset[0] - (factor / 2) * this.sh_f,
        85 + offset[1] - (factor / 2) * this.sh_f,
        resource.w + (factor / 2) * this.sh_f, resource.h + (factor / 2) * this.sh_f);
    }

    // Rosa
    if (this.sexo == "F") {
      ctx.drawImage(resourceImages["rosa"].img,
        0, 0, resourceImages["rosa"].w, resourceImages["rosa"].h,
        248 - factor / 2,
        -15 - factor / 2,
        resourceImages["rosa"].w + factor,
        resourceImages["rosa"].h + factor);
    }

    ctx.restore();
  }
}

var resourceDesechos = [
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
    this.y = screen_height * 0.50;
    this.frame = 0;
    this.imagen = undefined;
    this.spriteHeight = 0;
    this.spriteWidth = 0;
    this.setImage();
    this.angle = 0;
    this.impacto = false;
    this.factor;
    this.atrapable = false;
    this.velocidad = Math.random() * 5 + 1;
    this.velocidadRotacion = (Math.floor(Math.random() * 3 + 5)) / 100;
  }

  setImage() {
    const numeroDesecho = Math.floor(Math.random() * 12);
    this.imagen = resourceDesechos[numeroDesecho].img;
    this.spriteWidth = resourceDesechos[numeroDesecho].w;
    this.spriteHeight = resourceDesechos[numeroDesecho].h;
  }

  update() {
    const max = this.spriteWidth > this.spriteHeight ? this.spriteWidth : this.spriteHeight;
    const radio = PI * max * max;
    ctx.clearRect(this.x - radio / 2, this.y - radio / 2, radio, radio);

    if (!this.impacto) {
      this.x += this.velocidad;
      this.angle += this.velocidadRotacion;

      if (this.angle >= 360) {
        this.angle = 0;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.imagen,
      0, 0, this.spriteWidth, this.spriteHeight,
      0 - this.spriteWidth / 2, 0 - this.spriteHeight / 2,
      this.spriteWidth, this.spriteHeight);
    ctx.restore();
  }
}

class Golpe {
  constructor() {
    this.frame = 0;
    this.x = corazon.x + 188 / 2 - 80;
    this.y = corazon.y + 174 / 2;
    this.spriteWidth = 188;
    this.spriteHeight = 174;
    this.factor = 0;
  }

  update() {
    ctx.clearRect(this.x - this.factor / 2, this.y - this.factor / 2,
      this.spriteWidth + this.factor / 2, this.spriteHeight + this.factor / 2);
    this.frame += 1;
    this.factor = 40 - 40 * Math.abs(Math.sin((20 - (this.frame % 40)) / 20));
  }

  draw() {
    this.impacto = true;
    this.angle = 0;
    this.imagen = new Image();
    this.imagen.src = '/img/desechos/golpe.png';
    ctx.save();
    ctx.translate(this.x - this.spriteWidth / 2 - this.factor / 2,
      this.y - this.spriteHeight / 2 - this.factor / 2);
    ctx.drawImage(this.imagen,
      0, 0, this.spriteWidth, this.spriteHeight,
      0, 0,
      this.spriteWidth + this.factor, this.spriteHeight + this.factor);
    ctx.restore();
  }
}

class Premio {
  constructor() {
    this.x = corazon.x - 50;
    this.y = screen_height - 260;
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
    if (this.angle < -0.55) {
      this.direccionAngular = 1;
    }
    if (this.angle > 0.55) {
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
    this.y = screen_height - 400;
    this.escala = screen_height / 360;
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
    ctx.font = 'bold ' + (32 + this.escala) + 'px Attack Of Monster';
    ctx.fillStyle = 'white';
    ctx.fillText(this.texto + " x" + scoring.hits, this.x - this.escala - this.texto.length * 24, this.y - this.escala * 2);
    ctx.restore();
  }
}

class Scoring {
  constructor() {
    this.escala = screen_height / 640;
    this.hits = 0;
    this.nivel = 0;
    this.record = 0;
    this.x = screen_width - 240 * this.escala;
    this.y = 16 * this.escala;
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
    ctx.save();
    ctx.translate(this.x, this.y - 16);
    ctx.scale(this.escala, this.escala);
    ctx.clearRect(this.x, this.y, 240, 80);
    ctx.restore();
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.font = 'normal 1.5em ArcadeClasic';
    const clave = this.nivel > textos_premiados.length - 1 ? textos_premiados.length - 1 : scoring.nivel;
    const nivel = textos_premiados[clave][0];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.escala, this.escala);
    ctx.fillText("Nivel ", 0, 0);
    ctx.fillText("Score ", 0, 16);
    ctx.fillText("Record", 0, 32);
    ctx.fillStyle = 'yellow';
    ctx.fillText(nivel, 80, 0);
    ctx.fillText(this.hits, 80, 16);
    ctx.fillText(this.record, 80, 32);
    ctx.restore();
  }
}

Template.juego.rendered = () => {
  canvas = document.getElementById('canvas1');
  canvas.onselectstart = function () { return false; }
  ctx = canvas.getContext('2d');

  canvas.width = screen_width;
  canvas.height = screen_height;

  scoring = new Scoring();

  corazon = new CorazonVerde("M");
  desechos.push(new Desecho());
  textos.push(new Textos());
  var nuevoDesecho = 100;

  const animate = () => {
    gameframe++;


    if (gameframe % nuevoDesecho == 0) {
      desechos.push(new Desecho());
      nuevoDesecho = Math.floor(Math.random() * 500) + 400;
    }

    // Updates
    corazon.update();
    desechos.forEach((desecho, index) => {
      desecho.update();
      if (desecho.x > (corazon.x - 280) && desecho.x < (corazon.x - 50)) {
        if (corazon.atrapa) {
          desechos.splice(index, 1);
          premios.push(new Premio());
          scoring.acierto();
          textos.push(new Textos(scoring.nivel));
          corazon.preparado = true;
        }
      }
      if (desecho.x >= corazon.x) {
        desechos.splice(index, 1);
        golpes.push(new Golpe());
        corazon.iniciarGolpe();
        scoring.resetear();
      }
    })
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
    golpes.forEach((golpe, index) => {
      golpe.update();
      if (golpe.frame >= 40) {
        golpes.splice(index, 1);
      }
    })
    scoring.update();

    // Draws
    corazon.draw();
    premios.forEach((premio) => {
      premio.draw();
    })
    textos.forEach((texto) => {
      texto.draw();
    });
    desechos.forEach((desecho) => {
      desecho.draw();
    });
    golpes.forEach((golpe) => {
      golpe.draw();
    })
    scoring.draw();
    requestAnimationFrame(animate);
  }

  animate();
}

Template.juego.events({
  "click #canvas1"(e, template) {
    corazon.atrapar();
  }
})