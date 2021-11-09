let gameframe = 0, ctx, canvas;
var screen_width, screen_heigh;
var corazon, desecho;

screen_width = window.innerWidth;
screen_heigh = window.innerHeight;

const PI = Math.PI;

// Resources
var resourceImages = {};
[
  "corazon_verde", "corazon_verde_brazo_der", "corazon_verde_brazo_izq",
  "corazon_verde_piernas", "corazon_verde_rosa",
  "corazon_verde_cara_01", "corazon_verde_cara_02",
  "corazon_verde_cara_03", "corazon_verde_cara_04",
  "corazon_verde_cara_10", "corazon_verde_cara_11",
  "corazon_verde_cara_12",
  "corazon_verde_cara_b01", "corazon_verde_cara_b02",
  "corazon_verde_cara_b03", "corazon_verde_cara_b04",
  "corazon_verde_cara_b10", "corazon_verde_cara_b11",
  "corazon_verde_cara_b12",
].forEach((nameFile) => {
  var image = new Image();
  image.src = '/img/corazon/' + nameFile + '.png';
  resourceImages[nameFile] = image;
});

class CorazonVerde {
  constructor(sexo) {
    this.x = screen_width - 240;
    this.y = screen_heigh - 380;
    this.gesto = 0;
    this.brazo = 0;
    this.frame = 0;
    this.spriteWidth = 400;
    this.spriteHeight = 300;
    this.sexo = sexo;
  }

  update() {
    ctx.clearRect(this.x - 10, this.y - 10, 371 + 20, 316 + 20);
  }

  draw() {
    ctx.save();
    ctx.filter = 'grayscale(0.2)';

    // Piernas
    ctx.drawImage(resourceImages["corazon_verde_piernas"],
      0, 0, 333, 348,
      this.x + 15, this.y + 130,
      333 / 2, 348 / 2);

    // Brazo der
    ctx.drawImage(resourceImages["corazon_verde_brazo_der"],
      0, 0, 85, 201,
      this.x + 5, this.y + 90,
      85 / 2, 201 / 2);

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
    ctx.drawImage(resourceImages["corazon_verde"],
      0, 0, 371, 316,
      this.x - factor / 2, this.y - factor / 2,
      371 / 2 + factor, 316 / 2 + factor);

    // Brazo izq
    ctx.drawImage(resourceImages["corazon_verde_brazo_izq"],
      0, 0, 133, 266,
      this.x + 135, this.y + 90,
      133 / 2, 266 / 2);

    // Cara
    ctx.drawImage(resourceImages["corazon_verde_cara_" + (this.sexo == "F" ? "b" : "") + "01"],
      0, 0, 194, 149,
      this.x + 38, this.y + 45,
      194 / 2, 149 / 2);

    // Rosa
    if (this.sexo == "F") {
      ctx.drawImage(resourceImages["corazon_verde_rosa"],
        0, 0, 99, 107,
        this.x + 108 - factor / 2, this.y - 25 - factor / 2,
        99 + factor, 107 + factor);
    }
    ctx.restore();
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

console.log("DESECHOS", desechos);

class Desecho {
  constructor() {
    this.x = 0;
    this.y = screen_heigh - 320;
    this.frame = 0;
    this.imagen = undefined;
    this.spriteHeight = 0;
    this.spriteWidth = 0;
    this.setImage();
    this.angle = 0;
    this.impacto = false;
    this.factor;
  }

  setImage() {
    const numeroDesecho = Math.floor(Math.random() * 12);
    console.log("NUEVO DESECHO", numeroDesecho);
    this.imagen = desechos[numeroDesecho].img;
    this.spriteWidth = desechos[numeroDesecho].w;
    this.spriteHeight = desechos[numeroDesecho].h;
  }

  update() {
    const max = this.spriteWidth > this.spriteHeight ? this.spriteWidth : this.spriteHeight;
    const radio = PI * max * max;
    ctx.clearRect(this.x - radio / 2, this.y - radio / 2,
      radio + this.factor, radio + this.factor);

    if (!this.impacto) {
      this.x += 2;
      this.angle += 0.025;
      if (this.x > screen_width) {
        this.x = 0;
        this.setImage();
      }
      if (this.angle >= 360) {
        this.angle = 0;
      }
      if (this.x >= corazon.x) {
        this.impacto = true;
        this.angle = 0;
        this.imagen = new Image();
        this.imagen.src = '/img/desechos/golpe.png';
        this.spriteWidth = 188;
        this.spriteHeight = 174;
      }
    } else {
      this.frame++;
      this.factor = 2 * Math.sqrt(2 * (25 - this.frame));

      if (this.frame >= 50) {
        this.frame = 0;
        this.impacto = false;
        this.x = 0;
        this.factor = 0;
        this.setImage();
      }
    }
  }

  draw() {
    // Disbujo desecho
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.imagen,
      0, 0, this.spriteWidth, this.spriteHeight,
      0 - this.spriteWidth / 2, 0 - this.spriteHeight / 2,
      this.spriteWidth + this.factor, this.spriteHeight + this.factor);
    ctx.restore();
  }
}

Template.juego.rendered = () => {


  console.log("EMPIEZA");

  canvas = document.getElementById('canvas1');
  ctx = canvas.getContext('2d');

  canvas.width = screen_width;
  canvas.height = screen_heigh;

  this.score = new ReactiveVar();

  corazon = new CorazonVerde("F");
  desecho = new Desecho();

  const animate = () => {
    gameframe++;
    corazon.update();
    desecho.update();
    corazon.draw();
    desecho.draw();
    requestAnimationFrame(animate);
  }

  animate();
}