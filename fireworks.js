let fws = [];

function setup() {
  createCanvas(800, 800);
  textSize(32);
}

function draw() {
  background(255);
  
  // Text
  fill("#333333");
  strokeWeight(0);
  text(frameCount % 50, 10, 35);

  // Cursor
  fill(37, 37, 37, 50);
  ellipse(mouseX, mouseY, 20, 20);
  fill(255);
  ellipse(mouseX, mouseY, 10, 10);


  for (let i = fws.length - 1; i >= 0; i--) {
    if (fws[i].alive) fws[i].draw();
    else fws.splice(i, 1);
  }

  if (frameCount % 50 == 0) fws.push(new Firework(createVector(Math.ceil(random(50, width - 50)), 700)))
}

function mouseClicked() {fws.push(new Firework(createVector(mouseX, mouseY)))}

// Firework class
let Firework = function(position) {
  this.pos = position.copy();
  this.trail = new Trail(this.pos);
  this.blast = new Blast(this.trail.lastDot().pos);
  this.alive = true;
}

Firework.prototype.draw = function() {
  if (this.trail.alive) this.trail.draw();
  if (this.trail.isReady() && this.blast.alive) this.blast.show();

  if (!this.trail.alive) this.alive = false;
}

// Trail class
let Trail = function(position) {
  this.pos = position.copy();
  this.dots = [];
  this.drawn = [];
  this.count = 0;
  this.alive = true;

  for (let i = 0; i < random(10, 15); i++) {
    this.dots.push(new TrailDot(createVector(this.pos.x, this.pos.y - (20 * i))));
  }
}

Trail.prototype.lastDot = function() {
  return this.dots[this.dots.length - 1]
}

Trail.prototype.isReady = function() {
  return (this.drawn.length != 0 && this.drawn[this.drawn.length - 1].strokeWeight <= 8.5)
}

Trail.prototype.draw = function() {
  for (let d of this.drawn) {
    if (d.strokeWeight > 0) d.draw();
  }
  
  if (this.drawn.length != 0 && this.drawn[this.drawn.length - 1].strokeWeight <= 1) {
    this.alive = false;
  }

  if (frameCount % 5 == 0 && this.count != this.dots.length) {
    this.drawn.push(this.dots[this.count])
    this.count++;
  }
}

// Trail dot class
let TrailDot = function(position) {
  this.pos = position.copy();
  this.strokeWeight = 10;
}

TrailDot.prototype.draw = function() {
  stroke(220);
  strokeWeight(this.strokeWeight);
  point(this.pos.x, this.pos.y);
  this.strokeWeight -= 0.2;
}


// Blast class
let Blast = function(position) {
  this.pos = position.copy();
  this.range = 40;
  this.ellipseSize = 20;
  this.pointSize = 20;
  this.pointSpeed = 25;
  this.pointAlpha = 1;
  this.alive = true;
  this.color = {
    r: Math.ceil(random(100, 255)),
    g: Math.ceil(random(100, 255)),
    b: Math.ceil(random(100, 255))
  }
}

Blast.prototype.show = function() {
  strokeWeight(0);
  fill(this.color.r, this.color.g, this.color.b);
  ellipse(this.pos.x, this.pos.y, this.ellipseSize, this.ellipseSize);

  stroke(`rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.pointAlpha})`);
  strokeWeight(this.pointSize);
  point(this.pos.x, this.pos.y - this.range + this.pointSpeed); // TOP
  point(this.pos.x + (this.range / 2) - this.pointSpeed, this.pos.y - (this.range / 2) + this.pointSpeed); // TOP RIGHT 
  point(this.pos.x + this.range - this.pointSpeed, this.pos.y); // RIGHT
  point(this.pos.x + (this.range / 2) - this.pointSpeed, this.pos.y + (this.range / 2) - this.pointSpeed); // BOTTOM RIGHT
  point(this.pos.x - this.range + this.pointSpeed, this.pos.y); // LEFT 
  point(this.pos.x - (this.range / 2) + this.pointSpeed, this.pos.y + (this.range / 2) - this.pointSpeed); // BOTTOM LEFT
  point(this.pos.x, this.pos.y + this.range - this.pointSpeed); // BOTTOM
  point(this.pos.x - (this.range / 2) + this.pointSpeed, this.pos.y - (this.range / 2) + this.pointSpeed); // TOP LEFT
  
  this.ellipseSize -= .5;
  this.pointSize -= .8;
  this.pointSpeed -= 2;
  this.pointAlpha = this.pointAlpha > 0.2 ? this.pointAlpha - 0.01 : 0;
  if (this.ellipseSize <= 0) this.alive = false;
}